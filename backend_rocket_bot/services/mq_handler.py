import threading
from shared .queues import ws_message_queue
from queue import Empty
from datetime import datetime
from external_interfaces.redis_api import RedisApi
from services.logger import logger, get_formatted_uptime


class MessageQueueHandler:
    def __init__(self):
        self._count = 0
        self._running = False
        self._thread = None
        self.redis = RedisApi()
        self.rooms_stands_dict = []
        self.substrings_purposes_dict = {}
        # self.start_time = 0

    def _listen_queue(self):
        while self._running:
            try:
                message = ws_message_queue.get(timeout=2)
                handled_message = self._handle_message(message)
                if not handled_message['success']:
                    logger.error(
                        f"mq_handler: Unknown error in handled_message: {handled_message['error']}")
                    message['handle_status'] = {
                        'success': False, 'error': {handled_message['error']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_failed', message)
                    continue
                if not handled_message['action']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    continue
                if handled_message['event']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    self._push_to_redis_queue(
                        'rocket_events', handled_message['event'])

                    # if not handled_message['success']:

                    #     if handled_message['action']
            except Empty:
                continue
            except Exception as e:
                logger.error(f"mq_handler: Unknown error {e}")
                continue

    def _push_to_redis_queue(self, queue_name, message):
        return self.redis.push_message_to_queue(queue_name, message)

    def _set_stand_status(self, stand_uuid, status, author):
        return self.redis.set_stand(stand_uuid, status, author)

    def _handle_message(self, msg):
        msg_id = msg['_id']
        msg_rid = msg['rid']
        msg_text = msg['msg']
        dt = datetime.fromtimestamp(msg['ts']['$date'] / 1000)
        msg_date = dt.strftime('%Y-%m-%d %H:%M:%S')

        author = {}
        author['id'] = msg['u']['_id']
        author['username'] = msg['u']['username']
        author['name'] = msg['u']['name']

        target_stand = {}
        target_stand['name'] = self.rooms_stands_dict[msg_rid]['name']
        target_stand['uuid'] = self.rooms_stands_dict[msg_rid]['uuid']

        print(
            f"""
            Оригинальное сообщение: \n
            Пользователь: {author['name']}({author['username']}, {author['id']}), \n
            время: {msg_date}, \n
            сообщение {msg_text}, \n
            стенд: {target_stand['name']}/{target_stand['uuid']}, \n
            message_id: {msg_id} \n
            """
        )
        result = {'success': False,
                  'action': False,
                  'message': '',
                  'error': '',
                  'event': {}}
        message_action = self._define_message_action(msg_text)
        if not message_action['action']:
            result['success'] = True
            result['message'] = message_action['message']
            return result

        action_valid = self._validate_action(
            message_action, target_stand, author)
        if not action_valid['success']:
            result['success'] = True
            result['message'] = action_valid['message']
            return result

        if message_action == "free" or message_action == "busy" or message_action == "maintenance":
            new_status = message_action.capitalize()
            execute = self._set_stand_status(
                target_stand['uuid'], new_status, author)
            if execute:
                result['success'] = True
                result['action'] = True
                result['event'] = {
                    'action_type': 'set_stand_status',
                    'stand': target_stand,
                    'author': author,
                    'stand_status': new_status,
                    'time': msg_date}
                return result
            else:
                result['error'] = "Failed to set new stand status"
                return result
        if message_action == "lining_up":
            pass

    def _define_message_action(self, message_text):
        matches = []
        for substring in self.substrings_purposes_dict:
            if substring.lower() in message_text.lower():
                matches.append(substring)
        if not matches:
            return {'success': True, 'action': False, 'message': "No substring match in message text, can't define action"}
        if len(matches) > 1:
            return {'success': True, 'action': False, 'message': "More than one substring match in message, can't define action"}
        if matches[0]:
            action = self.substrings_purposes_dict[matches[0]]
            return {'success': True, 'action': action.lower(), 'message': f"Found substring match is {matches[0]}, action is {action}"}

    def _validate_action(self, action, target_stand, author):
        # Статусы стендов:
        # "Free"
        # "Busy"
        # "Unknown"
        # "Maintenance"
        redis_stand = self.redis.get_stand(
            target_stand['uuid'])
        if not redis_stand:
            return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) not found in redis"}
        current_status = redis_stand['status']
        if current_status == 'Unknown':
            return {'success': True}
        if action == current_status.lower() and action != 'lining_up':
            return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is already in status {current_status}"}

        if action == 'free':
            if current_status == 'Busy' or current_status == 'Maintenance':
                if author['username'] != redis_stand['last_modified_by']['username']:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Busy by {redis_stand['last_modified_by']['username']}, only author or admin can free it"}
                return {'success': True}

        if action == 'busy':
            if current_status == 'Free':
                return {'success': True}
            if current_status == 'Maintenance':
                if author['username'] != redis_stand['last_modified_by']['username']:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is in Maintenance by {redis_stand['last_modified_by']['username']}, only author or admin can free it"}
                else:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is in Maintenance by you, free it before busy"}
            if author['username'] != redis_stand['last_modified_by']['username']:
                return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is busy by {redis_stand['last_modified_by']['username']}, only author or administrator can free it"}

        if action == 'maintenance':
            if current_status == 'Free':
                return {'success': True}
            if current_status == 'Busy':
                if author['username'] != redis_stand['last_modified_by']['username']:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Busy by {redis_stand['last_modified_by']['username']}, only author or admin can free it"}
                else:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Busy by you, free it before Maintenance"}

        if action == 'lining_up':
            if current_status == 'Free':
                return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Free now, you can Busy it"}
            if current_status == 'Busy' or current_status == 'Maintenance':
                return {'success': False, 'message': f"Lining up in develop"}

    def connect(self, target_rooms, target_strings):
        # self.start_time = datetime.now()
        self.rooms_stands_dict = {}
        for room in target_rooms:
            self.rooms_stands_dict[room['rid']] = {
                'name': room['name'], 'stand_uuid': room['stand_uuid']}
        self.substrings_purposes_dict = {}
        for purpose in target_strings:
            for substring in target_strings[purpose]:
                self.substrings_purposes_dict[substring] = purpose

        if not self._running:
            logger.info(
                f"mq_handler: start listen ws_message_queue (local queue)")
            self._running = True
            self._thread = threading.Thread(
                target=self._listen_queue, daemon=True)
            self._thread.start()

    def stop(self):
        logger.info(
            f"mq_handler: stopping")
        # print("Stopping mq_handler")
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)

    @property
    def status(self):
        return {
            "alive": True,
            "message_count": self._count
        }

    # @property
    # def get_status(self):
    #     if self.start_time == 0:
    #         uptime = False
    #     else:
    #         now = datetime.now()
    #         uptime = get_formatted_uptime(
    #             self.start_time, now)
    #     result = {"alive": True,
    #               "message_count": self._count, "uptime": uptime, }
    #     return result
