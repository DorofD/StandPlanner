from datetime import datetime
from external_interfaces.rocket_http_api import RocketChatAPI


class MessageHandler():
    def __init__(self):
        self.rooms_stands_dict = []
        self.substrings_purposes_dict = {}
        self.rooms_stands_dict = {}

    def handle_message(self, msg):
        # print('---')
        # print(msg)
        # print('---')
        # print(
        #     f"""
        #         Сообщение: \n
        #         room_id: {msg['_id']}, \n
        #         room_name: {msg['name']}, \n
        #         room_fname: {msg['fname']}, \n
        #         username: {msg['u']['username']}, \n
        #         user_name: {msg['u']['name']}, \n
        #         user_id: {msg['u']['_id']}, \n
        #         message_text: {msg['lastMessage']['msg']}, \n
        #         message_id: {msg['lastMessage']['_id']} \n
        #         """
        # )
        if msg['t'] == 'd' and msg['lastMessage']['u']['name'] != 'StandPlanner':
            # RocketChatAPI().send_message(
            #     msg['_id'], f"{msg['lastMessage']['_id']}")
            RocketChatAPI().send_message(
                msg['_id'], f"{msg['lastMessage']['u']['name'].split()[1]}, вы написали в директ, обращение: {msg['lastMessage']['msg']}")
        issue_text = f"""
                Сообщение: \n
                room_id: {msg['_id']}, \n
                room_name: {msg['name']}, \n
                room_fname: {msg['fname']}, \n
                username: {msg['u']['username']}, \n
                user_name: {msg['u']['name']}, \n
                user_id: {msg['u']['_id']}, \n
                message_text: {msg['lastMessage']['msg']}, \n
                message_id: {msg['lastMessage']['_id']} \n
                """
        issue_text = f"""
                Сообщение:
                room_id: {msg['_id']},
                room_name: {msg['name']},
                room_fname: {msg['fname']},
                username: {msg['u']['username']},
                user_name: {msg['u']['name']},
                user_id: {msg['u']['_id']},
                message_text: {msg['lastMessage']['msg']},
                message_id: {msg['lastMessage']['_id']}
                """
        if msg['u']['username'] == 'edorofeev' and msg['lastMessage']['u']['name'] != 'StandPlanner' and msg['lastMessage']['msg'][0] == '!':
            # RocketChatAPI().send_message(
            #     msg['_id'], f"{msg['lastMessage']['_id']}")
            RocketChatAPI().send_message(
                msg['_id'], f"{msg['u']['name'].split()[1]}, вот данные о вашем обращении: \n{issue_text}")
        # defined_action = self._define_message_action(msg_text)
        # не удалось определить действие по подстроке

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
