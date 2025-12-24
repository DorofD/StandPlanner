import os
import requests
from dotenv import load_dotenv


class MainAppAPI:
    def __init__(self):
        load_dotenv('.env')
        main_app_host = os.environ['MAIN_APP_HOST']
        main_app_port = os.environ['MAIN_APP_PORT']
        self.main_app_url = f"http://{main_app_host}:{main_app_port}"
        self.headers = {
            "Accept": "application/json",
        }

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.main_app_url + api_path, headers=self.headers)
        print(response.content)
        response.raise_for_status()
        data = response.json()
        return data

    def get_settings(self):
        api_path = f"/rocket_bot?action=get_settings"
        data = self._request_get(api_path)
        return data
