import os
import requests
from dotenv import load_dotenv


class ConfluenceAPI:
    def __init__(self):
        load_dotenv('.env')
        self.base_url = os.environ['CONFLUENCE_BASE_URL']
        self.headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {os.environ['CONFLUENCE_API_TOKEN']}"
        }

    def _request_get(self, api_path):
        """Возвращает словарь или список, декодированный из json"""
        response = requests.get(
            self.base_url + api_path, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        return data

    def get_page_data(self, page_id):
        """
        Возвращает словарь
        {'title': str, 'version': str, 'layout': str}
        """
        api_path = f"/content/{str(page_id)}?expand=body.export_view,version"
        data = self._request_get(api_path)

        layout = data['body']['export_view']['value']
        result = {
            'title': data['title'],
            'version': f"{data['version']['when']}_{data['version']['number']}",
            'layout': layout
        }
        return result

    def get_page_version(self, page_id):
        """
        Возвращает строку версии в формате 'when_number'
        """
        api_path = f"/content/{str(page_id)}?expand=version"
        data = self._request_get(api_path)
        version = f"{data['version']['when']}_{data['version']['number']}"
        return version

    def get_pages_by_label(self, label):
        """
        Возвращает список словарей [{'title': str, 'id': str, ...}]
        """
        cql = f'type=page AND label="{label}"'
        limit = 100
        start = 0
        all_results = []
        while True:
            api_path = f"/content/search?cql={cql}&limit={limit}&start={start}"
            data = self._request_get(api_path)
            results = data.get('results', [])
            all_results.extend(results)
            if len(results) < limit:
                break
            start += limit
        return all_results
