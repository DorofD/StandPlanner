from app.domain.confluence_api import ConfluenceAPI
from app.domain.html_parser import HTMLParser
from datetime import datetime


class ManualSource():
    """
    Обрабатываемый тип источников:
    """

    def __init__(self):
        self.source_type = ['manual']


class ConfluencePageIdSource():
    """
    Обрабатка и подготовка данных источников типа confluence_page_id
    Статусы источников:
        new - источник только создан
        relevant - источник успешно прошел обработку, данные в актуальном состоянии
        failed - что-то во время обработки пошло не так, возможно требуется вмешательство
    """

    def __init__(self, source_note):
        self.source_type = ['confluence_page_id']
        self.confluence = ConfluenceAPI()
        self.source = source_note
        self.fields_to_update = {}
        self.stand_data = {}
        self.error_message = ''

    def validate_source(self):
        pass

    def process_source_dispatcher(self):
        """
        Точка входа обработки источников.
        Вернёт {'success': True, fields_to_update: {}, stand_data: {}}
        fields_to_update - обновленные поля источника
        stand_data - данные для добавления или обновления стенда
        """

        if self.source['status'] == 'new':
            result_dict = self._full_process()
            print('result dict', result_dict['stand_data']['name'])
            return result_dict
        if self.source['status'] == 'relevant':
            result_dict = self._check_relevance()
            return result_dict
        if self.source['status'] == 'failed':
            result_dict = self._full_process()
            return result_dict

    def _full_process(self):
        page_data = self._get_page_data()

        parsed_json_layout = HTMLParser(
            page_data['layout']).convert_confluence_storage_into_json()
        now = datetime.now()
        formatted_now = now.strftime("%d.%m.%Y-%H:%M")
        self.fields_to_update['status'] = 'relevant'
        self.fields_to_update['version'] = page_data['version']
        self.fields_to_update['last_update'] = formatted_now
        self.stand_data['last_update'] = formatted_now
        self.stand_data['name'] = page_data['title']
        self.stand_data['page_layout'] = parsed_json_layout
        self.stand_data['description'] = f"""Created by Confluence source (pageId={self.source['value']}) \n\nOriginal link should be: \n{self.confluence.base_url.replace('/rest/api', '')}/pages/viewpage.action?pageId={self.source['value']}"""

        return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}

    def _check_relevance(self):
        local_version = self.source['version']
        confluence_version = self._get_page_version()
        if local_version == confluence_version:
            now = datetime.now()
            formatted_now = now.strftime("%d.%m.%Y-%H:%M")
            self.fields_to_update['last_update'] = formatted_now
            self.stand_data['last_update'] = formatted_now

            return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}
        else:
            page_data = self._get_page_data()

            parsed_json_layout = HTMLParser(
                page_data['layout']).convert_confluence_storage_into_json()

            now = datetime.now()
            formatted_now = now.strftime("%d.%m.%Y-%H:%M")
            self.fields_to_update['last_update'] = formatted_now
            self.fields_to_update['version'] = page_data['version']
            self.stand_data['page_layout'] = parsed_json_layout
            self.stand_data['name'] = page_data['title']
            self.stand_data['last_update'] = formatted_now

            return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}

    def _get_page_data(self):
        """Возвращает словарь {'title': str, 'version': str, 'layout': str}"""
        return self.confluence.get_page_data(self.source['value'])

    def _get_page_version(self):
        """
        Возвращает строку версии в формате 'when_number'
        """
        return self.confluence.get_page_version(self.source['value'])
