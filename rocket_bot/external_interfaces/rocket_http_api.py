import os
import requests
import json
from dotenv import load_dotenv


class RocketChatAPI:
    def __init__(self):
        load_dotenv('.env')
        self.base_url = os.environ['ROCKET_BASE_URL']
        self.user_id = os.environ['ROCKET_USER_ID']
        self.user_token = os.environ['ROCKET_USER_TOKEN']
        verify = os.environ['ROCKET_VERIFY_SERVER_CERT']
        if verify == 'False':
            self.verify_cert = False
        else:
            self.verify_cert = True
        self.headers = {
            "Accept": "application/json",
            "X-User-Id": self.user_id,
            "X-Auth-Token": self.user_token
        }
        self.api_prefix = '/api/v1/'
        # print(self.verify_cert)

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.base_url + self.api_prefix + api_path, headers=self.headers, verify=self.verify_cert)
        response.raise_for_status()
        data = response.json()
        # print(data)
        return data

    def _request_post(self, api_path, data_to_send=[]):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.post(
            self.base_url + self.api_prefix + api_path, headers=self.headers, verify=self.verify_cert, json=data_to_send)
        response.raise_for_status()
        data = response.json()
        # print(data)
        return data

    # каналы могут быть публичными или приватными
    def get_channels(self):
        # api_path = f"channels.list?count=0"
        api_path = f"channels.list"
        data = self._request_get(api_path)
        return data

    def get_channel_messages(self, room_id, count=15):
        api_path = f"channels.messages?roomId={room_id}&count={count}"
        data = self._request_get(api_path)
        return data

    # группы только приватные
    def get_groups(self):
        # api_path = f"groups.list?count=0"
        api_path = f"groups.list"
        data = self._request_get(api_path)
        return data

    def get_group_messages(self, room_id, count=15):
        api_path = f"groups.messages?roomId={room_id}&count={count}"
        data = self._request_get(api_path)
        return data

    def get_rooms(self):
        """
        't' - type
        't':'p' - private
        't':'c' - public
        't':'d' - direct
        """
        api_path = f"rooms.get"
        data = self._request_get(api_path)
        try:
            return data['update']
        except Exception as exc:
            print(f"Exception in get_rooms: {exc}")
            return []

    def get_user_info_by_name(self, userName):
        api_path = f"users.info?userName={userName}"
        # api_path = f"users.info"
        data = self._request_get(api_path)
        return data

    def get_user_info_by_id(self, userId):
        api_path = f"users.info?userId={userId}"
        data = self._request_get(api_path)
        return data

    def send_message(self, room_id, text):
        api_path = f"chat.sendMessage"
        data_to_send = {"message":
                        {
                            "rid": room_id,
                            "msg": text
                        }}
        data = self._request_post(api_path, data_to_send)
        print(data['errorType'])
