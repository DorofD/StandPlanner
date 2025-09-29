import os
import requests
from dotenv import load_dotenv


class RocketBotAPI:
    def __init__(self):
        load_dotenv('.env')
        rbot_host = os.environ['ROCKET_BOT_HOST']
        rbot_port = os.environ['ROCKET_BOT_PORT']
        self.rbot_url = f"http://{rbot_host}:{rbot_port}"
        self.headers = {
            "Accept": "application/json"
        }

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.rbot_url + api_path, headers=self.headers, verify=False)
        response.raise_for_status()
        data = response.json()
        return data

    def get_check(self):
        api_path = f"/"
        data = self._request_get(api_path)
        return data

    def get_status(self):
        api_path = f"/status"
        data = self._request_get(api_path)
        return data

    def get_reload(self):
        api_path = f"/reload"
        data = self._request_get(api_path)
        return data

    def get_rooms(self):
        api_path = f"/rocket_data?value=rooms"
        data = self._request_get(api_path)
        return data
