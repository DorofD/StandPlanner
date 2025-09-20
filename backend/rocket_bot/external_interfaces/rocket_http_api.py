import os
import requests
import json
import threading
import time
import uuid
from websocket import WebSocketApp
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

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.base_url + self.api_prefix + api_path, headers=self.headers, verify=self.verify_cert)
        response.raise_for_status()
        data = response.json()
        return data

    # каналы могут быть публичными или приватными
    def get_channels(self):
        api_path = f"channels.list?count=0"
        data = self._request_get(api_path)
        return data

    def get_channel_messages(self, room_id, count=15):
        api_path = f"channels.messages?roomId={room_id}&count={count}"
        data = self._request_get(api_path)
        return data

    # группы только приватные
    def get_groups(self):
        api_path = f"groups.list?count=0"
        data = self._request_get(api_path)
        return data

    def get_group_messages(self, room_id, count=15):
        api_path = f"groups.messages?roomId={room_id}&count={count}"
        data = self._request_get(api_path)
        return data

    def get_all_reachable_rooms(self):
        result = []
        channels_data = self.get_channels()
        if channels_data['channels']:

            for i in channels_data['channels']:
                # print(i, '\n')
                result.append(
                    {'rid': i['_id'], 'name': i['fname'], 'type': 'channel'})

        groups_data = self.get_groups()
        if groups_data['groups']:

            for i in groups_data['groups']:
                # print(i, '\n')
                result.append(
                    {'rid': i['_id'], 'name': i['fname'], 'type': 'channel'})
        return result


rocket = RocketChatAPI()
rocket.get_all_reachable_rooms()
# channels = rocket.get_channels()
# groups = rocket.get_groups()
# group_messages = rocket.get_group_messages('67b876007cbd361f69bd0b22', 10)

# for msg in group_messages['messages']:
#     print(msg)


# print(rocket.get_channel_messages('68ce03dbf531ef2b877926b6', 10))

# desired_channels_names = ['sp_test', 'sp_test2', 'sp_test3']
# channels_to_sub = []
# for i in channels['channels']:
# for j in i:
#     print(j)
# if i['fname'] in desired_channels_names:
# print(i)
# print(i['fname'], i['_id'], i['lastMessage'])
# print(i['fname'], i['_id'])
# channels_to_sub.append({'name': i['fname'], 'id': i['_id']})
# break
# for i in channels['channels']:
# print(i)

# print(i['fname'], i['_id'])
# for i in groups['groups']:
#     if i['fname'] == "Стенд ТНИ2 SSD2 #11":
#         print(i['fname'], i['_id'])

# client = RocketChatWSClient(channels_to_sub)
# client.connect()


# Стенд ТНИ2 SSD2 #11 67b876007cbd361f69bd0b22
# 'msg': 'Передал @egorenkov'
