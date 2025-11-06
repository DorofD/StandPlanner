from datetime import datetime
from external_interfaces.redis_api import RedisApi


class ReservationsHandler():
    def __init__(self, settings):
        self.redis = RedisApi()
        self.rooms_stands_dict = []
        self.substrings_purposes_dict = {}
        self.rooms_stands_dict = {}
        for room in settings['target_rooms']:
            self.rooms_stands_dict[room['rid']] = {
                'name': room['name'], 'stand_uuid': room['stand_uuid']}
        self.substrings_purposes_dict = {}
        for purpose in settings['target_strings']:
            for substring in settings['target_strings'][purpose]:
                self.substrings_purposes_dict[substring] = purpose

    def handle_reservation(self, msg):
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
                Сообщение: \n
                Пользователь: {author['name']}({author['username']}, {author['id']}), \n
                время: {msg_date}, \n
                сообщение {msg_text}, \n
                стенд: {target_stand['name']}/{target_stand['uuid']}, \n
                message_id: {msg_id} \n
                """
        )

        defined_action = self._define_message_action(msg_text)
        # не удалось определить действие по подстроке
        if not defined_action:
            result = {'success': True,
                      'action': False,
                      'message': "",
                      'event': {}}
            return result

        action_valid = self._validate_action(
            defined_action, target_stand, author)
        # действие не может быть выполнено в текущих условиях
        if not action_valid['success']:
            result = {'success': True,
                      'action': False,
                      'message': action_valid['message'],
                      'error': '',
                      'event': {}}
            return result

        if defined_action == "free" or defined_action == "busy" or defined_action == "maintenance":
            new_status = defined_action.capitalize()
            execute = self.redis.set_stand(
                target_stand['uuid'], new_status, author)
            if execute:
                result = {'success': True,
                          'action': True,
                          'message': '',
                          'error': '',
                          'event': {
                              'action_type': 'set_stand_status',
                              'stand': target_stand,
                              'author': author,
                              'stand_status': new_status,
                              'time': msg_date}}
                return result
            else:
                result = {'success': False,
                          'action': False,
                          'message': '',
                          'error': "Failed to set new stand status",
                          'event': {}}
                return result
        if defined_action == "in_busy_queue":
            print(
                f"Добавить {author['username']} в очередь стенда {target_stand['name']}")
            pass
        if defined_action == "out_of_busy_queue":
            print(
                f"Убрать {author['username']} их очереди стенда {target_stand['name']}")
            pass

    def _define_message_action(self, message_text):
        matches = []
        for substring in self.substrings_purposes_dict:
            if substring.lower() in message_text.lower():
                matches.append(substring)

        if not matches or len(matches) > 1 or not matches[0]:
            print("Action not defined")
            return False
        action = self.substrings_purposes_dict[matches[0]]
        print(f"Defined action: {action}")
        return action.lower()

    def _validate_action(self, action, target_stand, author):
        # Статусы стендов:
        # "Free"
        # "Busy"
        # "Unknown"
        # "Maintenance"
        redis_stand = self.redis.get_stand(
            target_stand['uuid'])
        if not redis_stand:
            print("Stand not found in Redis")
            return False
        current_status = redis_stand['status'].lower()
        if current_status == 'unknown':
            return False

        if action == 'free':
            if current_status == 'free':
                print("Duplicate action")
                return False
            if current_status == 'busy' or current_status == 'maintenance':
                if author['username'] == redis_stand['last_modified_by']['username']:
                    return True
                return False

            print("Only author or admin can free busy stand")
            return True

        if action == 'busy':
            if current_status == 'Free':
                return True
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

        if action == 'in_busy_queue':
            if current_status == 'Free':
                return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Free now, you can Busy it"}
            if current_status == 'Busy' or current_status == 'Maintenance':
                if author['username'] == redis_stand['last_modified_by']['username']:
                    return {'success': False, 'message': f"Stand {target_stand['name']}({target_stand['uuid']}) is Busy or Maintenance by you, you can't get in line at the same time"}
                else:
                    return {'success': True}

        if action == 'out_of_busy_queue':
            if not redis_stand['queue']:
                return {'success': False, 'message': f"There is no busy queue for Stand {target_stand['name']}({target_stand['uuid']})"}
            if author['username'] not in redis_stand['queue']:
                return {'success': False, 'message': f"You are not in busy queue for Stand {target_stand['name']}({target_stand['uuid']})"}
            return {'success': True}
