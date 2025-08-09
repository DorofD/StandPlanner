import os
import requests
from requests.exceptions import RequestException, JSONDecodeError
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
        """Возвращает объект {'success': True, 'errror': '', 'data': some_python_object_decoded_from_json_body}"""
        result = {'success': None, 'error': None, 'data': None}
        try:
            response = requests.get(
                self.base_url + api_path, headers=self.headers)
        except RequestException as e:
            result['success'] = False
            result['error'] = e
            return result
        try:
            response.raise_for_status()
        except Exception as e:
            print(e)
            result['success'] = False
            result['error'] = e
            return result
        try:
            data = response.json()
        except JSONDecodeError:
            result['success'] = False
            result['error'] = f"JSONDecodeError when decoding responce body. Respone info: {response.status_code} on {response.request.method} {response.url} "
            return result
        result['success'] = True
        result['data'] = data
        return result

    def _format_layout(self, layout):
        table_style = """
        <style type="text/css">
            table, th, td {
                border: 1px solid black;
            }
        </style>
        """
        result = table_style + layout
        return result

    def get_page_data(self, page_id):
        """
        Возвращает словарь
        {'success': True, 'title': str, 'version': str, 'layout': str}
        если 'success': False, добавится ключ 'error'
        """
        api_path = f"/content/{str(page_id)}?expand=body.export_view,version"
        response = self._request_get(api_path)
        if not response['success']:
            return response
        data = response['data']

        try:
            layout = self._format_layout(data['body']['export_view']['value'])
            result = {
                'success': True,
                'title': data['title'],
                'version': f"{data['version']['when']}_{data['version']['number']}",
                'layout': layout
            }
        except KeyError as e:
            return {'success': False, 'error': f"Successfully loaded {self.base_url}{api_path}, but missing field {e}"}
        return result

    def get_page_version(self, page_id):
        """
                Возвращает словарь
        {'success': True, 'version': str 'when_number'} если 'success': False, добавится ключ 'error'

        """
        api_path = f"/content/{str(page_id)}?expand=version"
        response = self._request_get(api_path)
        if not response['success']:
            return response
        data = response['data']
        try:
            result = {'success': True,
                      'version': f"{data['version']['when']}_{data['version']['number']}"}
        except KeyError as e:
            return {'success': False, 'error': f"Successfully loaded {self.base_url}{api_path}, but missing field {e}"}
        return result
