import os
import requests
from dotenv import load_dotenv


class RocketChatAPI:
    def __init__(self):
        load_dotenv('.env')
        self.base_url = os.environ['ROCKET_BASE_URL']
        self.user_id = os.environ['ROCKET_USER_ID']
        self.user_token = os.environ['ROCKET_USER_TOKEN']
        self.headers = {
            "Accept": "application/json",
            "X-User-Id": self.user_id,
            "X-Auth-Token": self.user_token
        }
        self.api_prefix = '/api/v1/'

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.base_url + self.api_prefix + api_path, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        return data

    def get_channels_list(self):
        api_path = f"channels.list?count=0"
        data = self._request_get(api_path)
        return data

    def get_groups_list(self):
        api_path = f"groups.list?count=0"
        data = self._request_get(api_path)
        return data


# rocket = RocketChatAPI()
# channels = rocket.get_channels_list()
# groups = rocket.get_groups_list()


# for i in channels:
#     print(i, '---', channels[i])
# for i in groups:
#     print(i, '---', groups[i])


# c_list = []
# g_list = []
# for i in channels['channels'][0]:
#     c_list.append(i)
# for i in groups['groups'][0]:
#     g_list.append(i)
# result = list(set(g_list) ^ set(c_list))
# print(result)


# for i in channels['groups']:
#     print(i['fname'])
# for i in groups['channels']:
#     print(i['fname'])
