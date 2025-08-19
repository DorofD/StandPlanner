from app.domain.confluence_api import ConfluenceAPI
from app.domain.html_parser import HTMLParser
from datetime import datetime
import traceback


class ManualSource():
    """
    Обрабатываемый тип источников:
        manual - добавление стенда вручную через веб-интерфейс, правил для обработки нет
    """

    def __init__(self):
        self.source_type = ['manual']


class ConfluencePageIdSource():
    """
    Тип источника (ресурса) - confluence_page_id
        confluence_page_id - добавление и обновление стенда автоматически по результатам поиска страницы с указанным pageId
        Особенности:
            источник привязан к стенду, созданному на основе его данных
            все параметры стенда управляются автоматически, изменять можно только описание
            данные актуализируются и обновляются на основе version страницы
    Статусы ресурсов:
        new - ресурс только создан
        relevant - ресурс успешно прошел обработку, данные в актуальном состоянии
        failed - что-то во время обработки пошло не так, возможно требуется вмешательство

        Этапы обработки в зависимости от статуса
        new: > загрузка данных > обработка данных > сохранение данных > создание стенда > relevant
        relevant > сверка версий страниц > 1 - версии не различаются > relevant
                                      > 2 - версии различаются > загрузка актуальных данных > обработка данных > сохранение актуальных данных и обновление стенда > relevant
        failed > загрузка данных > обработка данных > сохранение данных > 1 - стенд уже создан > полное обновление стенда > relevant
                                                                        > 2 - стенд отсутствует > создание стенда > relevant
        если в процессе обработки источника возникло непредвиденное исключение:
        - обработка данного источника завершается досрочно, источнику присваивается статус failed
        - в конец описания источника добавляется описание произошедшей ошибки
        - если к источнику привязан стенд, он помечается как source_failed
    """

    def __init__(self, source_note):
        self.source_type = ['confluence_page_id']
        self.confluence = ConfluenceAPI()
        self.source = source_note
        self.fields_to_update = {}
        self.stand_data = {}
        self.operations_log = []
        self.error_message = ''

    def validate_source(self):
        pass

    def process_source_dispatcher(self):
        """
        Точка входа обработки ресурсов.
        Вернёт {'success': True, fields_to_update: {}, stand_data: {}}
        fields_to_update - обновленные поля источника
        stand_data - данные для добавления или обновления стенда
        В случае ошибки обработки вернет {'success': False, 'error_message': str, 'operations_log': list }
        """
        self.operations_log.append('Enter in process_source_dispatcher')

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

        # try:
        #     if self.source['status'] == 'new':
        #         result_dict = self._full_process()
        #         return result_dict
        #     if self.source['status'] == 'relevant':
        #         result_dict = self._check_relevance()
        #         return result_dict
        #     if self.source['status'] == 'failed':
        #         result_dict = self._full_process()
        #         return result_dict
        # except Exception as e:
        #     self.operations_log.append(
        #         f'There was an exception at this stage: {e}')
        #     self.error_message = f"{str(e)} | {traceback.format_exc()}"
        #     return {
        #         'success': False,
        #         'error_message': self.error_message,
        #         'operations_log': self.operations_log
        #     }

    def _full_process(self):
        self.operations_log.append('Enter int _full_process')

        self.operations_log.append("Going to get page_data")
        page_data = self._get_page_data()
        self.operations_log[-1] = "Successfully got page_data"

        self.operations_log.append("Going to parse layout")
        parsed_json_layout = HTMLParser(
            page_data['layout']).convert_confluence_storage_into_json()
        self.operations_log[-1] = "Successfully parsed layout"

        now = datetime.now()
        formatted_now = now.strftime("%d.%m.%Y-%H:%M")
        print(page_data['title'])
        self.operations_log.append('Going to set returning values')
        self.fields_to_update['status'] = 'relevant'
        self.fields_to_update['version'] = page_data['version']
        self.fields_to_update['last_update'] = formatted_now
        self.stand_data['last_update'] = formatted_now
        self.stand_data['name'] = page_data['title']
        self.stand_data['page_layout'] = parsed_json_layout
        self.stand_data['description'] = f"""Created by Confluence source (pageId={self.source['value']}) \n\nOriginal link should be: \n{self.confluence.base_url.replace('/rest/api', '')}/pages/viewpage.action?pageId={self.source['value']}"""
        self.operations_log[-1] = "Successfully set returning values"

        self.operations_log.append('Return from _full_process')
        return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}

    def _check_relevance(self):
        self.operations_log.append('Enter in _check_relevance')

        self.operations_log.append(
            'Going to get local and Confluence versions')
        local_version = self.source['version']
        confluence_version = self._get_page_version()
        self.operations_log[-1] = f"Successfully got local and Convluence versions"

        if local_version == confluence_version:
            self.operations_log.append('Versions are the same')

            self.operations_log.append('Going to set returning values')
            now = datetime.now()
            formatted_now = now.strftime("%d.%m.%Y-%H:%M")
            self.fields_to_update['last_update'] = formatted_now
            self.stand_data['last_update'] = formatted_now
            self.operations_log[-1] = "Successfully set returning values"

            self.operations_log.append('Return from _check_relevance')
            return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}
        else:
            self.operations_log.append('Versions are different')

            self.operations_log.append("Going to get page_data")
            page_data = self._get_page_data()
            self.operations_log[-1] = "Successfully got page_data"

            self.operations_log.append("Going to parse layout")
            parsed_json_layout = HTMLParser(
                page_data['layout']).convert_confluence_storage_into_json()
            self.operations_log[-1] = "Successfully parsed layout"

            self.operations_log.append('Going to set returning values')
            now = datetime.now()
            formatted_now = now.strftime("%d.%m.%Y-%H:%M")
            self.fields_to_update['last_update'] = formatted_now
            self.fields_to_update['version'] = page_data['version']
            self.stand_data['page_layout'] = parsed_json_layout
            self.stand_data['name'] = page_data['title']
            self.stand_data['last_update'] = formatted_now
            self.operations_log[-1] = "Successfully set returning values"

            self.operations_log.append('Return from _check_relevance')
            return {'success': True, 'fields_to_update': self.fields_to_update, 'stand_data': self.stand_data}

    def _get_page_data(self):
        """Возвращает словарь {'title': str, 'version': str, 'layout': str}"""
        return self.confluence.get_page_data(self.source['value'])

    def _get_page_version(self):
        """
        Возвращает строку версии в формате 'when_number'
        """
        return self.confluence.get_page_version(self.source['value'])
