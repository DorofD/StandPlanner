import os
import requests
from dotenv import load_dotenv


class Confluence:
    def __init__(self):
        load_dotenv('.env')
        self.base_url = os.environ['CONFLUENCE_BASE_URL']
        self.headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {os.environ['CONFLUENCE_API_TOKEN ']}"
        }

    def get_page_body(self, page_id):
        """
        Возвращает словарь
        {'title': str, 'version': str, 'layout': str}
        """
        response = requests.get(
            self.base_url + f"/content/{str(page_id)}?expand=body.export_view,version", headers=self.headers)
        print(response)
        data = response.json()

        table_style = """
        <style type="text/css">
            table, th, td {
                border: 1px solid black;
            }
        </style>
        """

        result = {
            'title': data['title'],
            'version': f"{data['version']['when']}_{data['version']['number']}",
            'layout': table_style + data['body']['export_view']['value']
        }
        return result

    def get_page_version(self, page_id):
        """
        Возвращает str версию в формате when_number
        """
        response = requests.get(
            self.base_url + f"/content/{str(page_id)}?expand=version", headers=self.headers)
        print(response)
        data = response.json()
        result = f"{data['version']['when']}_{data['version']['number']}"
        return result
