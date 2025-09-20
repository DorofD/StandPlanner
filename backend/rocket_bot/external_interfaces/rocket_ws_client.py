import os
import requests
import json
import threading
import time
import uuid
from websocket import WebSocketApp
from dotenv import load_dotenv


class RocketChatWSClient:
    def __init__(self, channels):
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
        self.channels_to_sub = channels
        self.subscribes = []
        self.room_id_to_channel_dict = {}
        self.sub_id_to_channel_dict = {}

    def on_open(self, ws):
        print("WebSocket: соединение открыто")
        self.connected = True

        # DDP handshake (connect)
        ws.send(json.dumps({
            "msg": "connect",
            "version": "1",
            "support": ["1"]
        }))

    def on_message(self, ws, message):
        msg = json.loads(message)
        print("DEBUG:", msg)

        if msg.get("msg") == "ping":
            ws.send('{"msg":"pong"}')
            print("Отправлен pong")
        if msg.get("msg") == "nosub":
            print(
                f"Ошибка подписки на комнату {self.sub_id_to_channel_dict[msg.get('id')]['channel_name']}, ошибка: {msg.get('error')['error']}")

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

        # После авторизации подписываемся на комнаты
        if msg.get("msg") == "result" and msg.get("id") == self.ws_login_id:
            if msg.get("error"):
                print(f"DDP: auth failed: {msg.get('error')['message']}")
            else:
                print("DDP: auth, подписываемся на комнаты")
                for channel in self.channels_to_sub:
                    print(f"Подписка на {channel['name']}")
                    sub_id = str(uuid.uuid4())
                    ws.send(json.dumps({
                        "msg": "sub",
                        "id": sub_id,
                        "name": "stream-room-messages",
                        "params": [
                            channel['id'],
                            False
                        ]
                    }))
                    self.subscribes.append({'channel_name': channel['name'],
                                            'channel_id': channel['id'],
                                            'sub_id': sub_id,
                                            })
                    self.room_id_to_channel_dict[channel['id']] = {'channel_name': channel['name'],
                                                                   'channel_id': channel['id'],
                                                                   'sub_id': sub_id,
                                                                   }
                    self.sub_id_to_channel_dict[sub_id] = {'channel_name': channel['name'],
                                                           'channel_id': channel['id'],
                                                           'sub_id': sub_id
                                                           }

        # Получаем сообщения из комнаты
        if msg.get("collection") == "stream-room-messages":
            fields = msg.get("fields", {})
            args = fields.get("args", [])
            if args:
                message_obj = args[0]
                # print(f"rid - {message_obj.get('rid')}")
                print(
                    f"\nВ комнате {self.room_id_to_channel_dict[message_obj.get('rid')]['channel_name']} сообщение от {message_obj.get('u', {}).get('username')}: {message_obj.get('msg')}")

    def on_close(self, ws, close_status_code, close_msg):
        print(
            f"WebSocket: соединение закрыто ({close_status_code}): {close_msg}")
        self.connected = False

    def on_error(self, ws, error):
        print(f"WebSocket: ошибка: {error}")
        self.connected = False

    def connect(self):
        self.ws = WebSocketApp(
            self.ws_url + "/websocket",
            header=[f"{k}: {v}" for k, v in self.headers.items()],
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
            on_error=self.on_error
        )
        # Запускаем статус-принтер в отдельном потоке
        # Запускаем основной цикл WebSocket
        self.ws.run_forever(ping_interval=20, ping_payload='PING', ping_timeout=10,
                            sslopt={"cert_reqs": 0 if not self.verify_cert else 2})


# rocket = RocketChatAPI()
# channels = rocket.get_channels()


# desired_channels_names = ['sp_test', 'sp_test2', 'sp_test3']
# channels_to_sub = []
# for i in channels['channels']:
#     # for j in i:
#     #     print(j)
#     if i['fname'] in desired_channels_names:

#         # print(i['fname'], i['_id'], i['lastMessage'])
#         print(i['fname'], i['_id'])
#         channels_to_sub.append({'name': i['fname'], 'id': i['_id']})
#     # break


# client = RocketChatWSClient(channels_to_sub)
# client.connect()
