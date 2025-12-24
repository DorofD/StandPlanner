import os
import json
import uuid
import threading
from websocket import WebSocketApp
from dotenv import load_dotenv
from external_interfaces.rocket_http_api import RocketChatAPI
from services.logger import logger


class RocketChatWSClient:
    def __init__(self):
        load_dotenv('.env')

        self.base_url = os.environ['ROCKET_BASE_URL']
        self.user_id = os.environ['ROCKET_USER_ID']
        self.user_token = os.environ['ROCKET_USER_TOKEN']
        verify = os.environ.get('ROCKET_VERIFY_SERVER_CERT', 'True')
        self.verify_cert = False if verify == 'False' else True
        self.headers = {
            "Accept": "application/json",
            "X-User-Id": self.user_id,
            "X-Auth-Token": self.user_token
        }
        if self.base_url.startswith('https'):
            self.ws_url = self.base_url.replace('https', 'wss', 1)
        elif self.base_url.startswith('http'):
            self.ws_url = self.base_url.replace('http', 'ws', 1)
        else:
            self.ws_url = self.base_url
        self.ws_login_id = ''
        self.connected = False
        self.ws = None
        self.local_queue = None
        self.rooms_to_sub = RocketChatAPI().get_rooms()

    def on_open(self, ws):
        logger.info(f"WebSocket: connection opened")
        self.connected = True

        # DDP handshake (connect)
        ws.send(json.dumps({
            "msg": "connect",
            "version": "1",
            "support": ["1"]
        }))

    def on_message(self, ws, message):
        msg = json.loads(message)
        # print("DEBUG:", msg)

        if msg.get("msg") == "ping":
            ws.send('{"msg":"pong"}')
            print("Отправлен pong")

        if msg.get("msg") == "nosub":
            logger.error(
                f"Fail to sub on room: {self.sub_id_to_channel_dict[msg.get('id')]['channel_name']}, error: {msg.get('error')['error']}")
            print(
                f"Fail to sub on room: {self.sub_id_to_channel_dict[msg.get('id')]['channel_name']}, error: {msg.get('error')['error']}")

        # После успешного DDP connect надо авторизоваться
        if msg.get("msg") == "connected":
            print("DDP: connected, авторизация...")
            self.ws_login_id = str(uuid.uuid4())
            print(f"Generated login_id is {self.ws_login_id}")
            ws.send(json.dumps({
                "msg": "method",
                "method": "login",
                "id": self.ws_login_id,
                "params": [{
                    "resume": self.user_token
                }]
            }))

        # подписка на комнаты
        if msg.get("msg") == "result" and msg.get("id") == self.ws_login_id:
            if msg.get("error"):
                logger.error(
                    f"WebSocket DDP: auth failed: {msg.get('error')['message']}")
                print(
                    f"WebSocket DDP: auth failed: {msg.get('error')['message']}")
            else:
                print("!WebSocket DDP: auth success, subscribing to rooms")
                logger.info(
                    "WebSocket DDP: auth success, subscribing to rooms")
                # for room in self.rooms_to_sub:
                #     print(room)
                #     # print(f"Send sub message for {room['name']}")
                #     sub_id = str(uuid.uuid4())
                #     ws.send(json.dumps({
                #         "msg": "sub",
                #         "id": sub_id,
                #         "name": "stream-room-messages",
                #         "params": [
                #             room['_id'],
                #             False
                #         ]
                #     }))
                # подписка на уведомления{
                sub_id = str(uuid.uuid4())
                ws.send(json.dumps({
                    "msg": "sub",
                    "id": sub_id,
                    "name": "stream-notify-user",
                    "params": [
                        f"{self.user_id }/rooms-changed",
                        False
                    ]
                }))

        # cообщения из комнат
        if msg.get("collection") == "stream-room-messages":
            fields = msg.get("fields", {})
            args = fields.get("args", [])
            if args:
                message_obj = args[0]
                # print(
                #     f"\nВ комнате {self.room_id_to_channel_dict[message_obj.get('rid')]['channel_name']} сообщение от {message_obj.get('u', {}).get('username')}: {message_obj.get('msg')}")
                # print(
                #     f"\nCообщение от {message_obj.get('u', {}).get('username')}: {message_obj.get('msg')}")
                try:
                    self.local_queue.put(message_obj)
                except Exception as exc:
                    print(
                        f"Exception when tryin to put msg in local_queue: {exc}")
        # cообщения об уведомлениях
        if msg.get("collection") == "stream-notify-user":
            fields = msg.get("fields", {})
            args = fields.get("args", [])
            if args:
                # print(args)
                message_obj = args[1]
                # print(
                #     f"\nCообщение от {message_obj.get('u', {}).get('username')}: {message_obj.get('lastMessage').get('msg')}")
                try:
                    self.local_queue.put(message_obj)
                except Exception as exc:
                    print(
                        f"Exception when tryin to put msg in local_queue: {exc}")

    def on_close(self, ws, close_status_code, close_msg):
        logger.info(
            f"WebSocket: close connection ({close_status_code}): {close_msg}")
        self.connected = False

    def on_error(self, ws, error):
        logger.error(f"WebSocket: Error: {error}")
        print(f"WebSocket: Error: {error}")
        self.connected = False

    def on_pong(self, ws, error):
        # print('pong from on_pong')
        pass

    def connect(self):
        logger.info(f"WebSocket: start connecton")
        self.ws = WebSocketApp(
            self.ws_url + "/websocket",
            header=[f"{k}: {v}" for k, v in self.headers.items()],
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
            on_error=self.on_error,
            on_pong=self.on_pong
        )

    def run(self, local_queue):
        self.local_queue = local_queue
        self.connect()
        # run_forever блокирует основной поток, поэтому запускаем в дополнительном
        self._ws_thread = threading.Thread(
            target=self.ws.run_forever,
            kwargs=dict(
                ping_interval=5,
                ping_payload='PING',
                ping_timeout=4,
                sslopt={"cert_reqs": 0 if not self.verify_cert else 2}
            ),
            daemon=True
        )
        self._ws_thread.start()

    def stop(self):
        logger.info(f"WebSocket: stop ws_client")
        if self.ws:
            self.ws.close()
        if self._ws_thread and self._ws_thread.is_alive():
            self._ws_thread.join(timeout=5)
