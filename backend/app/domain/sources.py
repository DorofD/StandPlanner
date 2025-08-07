from app.domain.confluence_api import ConfluenceAPI


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
            источник привязан к одному стенду
            вручную можно менять только description источника и стендов
            данные актуализируются и обновляются на основе verion страницы
    Статусы ресурсов:
        Статусы могут быть конечными либо промежуточными.
        Ресурсам с промежуточным статусом требуется последующая обработка и получение конечного статуса

    Существующие статусы:
        new (промежуточный)- ресурс только создан и не обрабатывался ранее
        data_success (промежуточный) - данные успешно получены, но стенд пока не создавался
        stand_success (промежуточный) - стенд успешно создан, после проверки ресурс будет готов к работе
        outdate (промежуточный) - при проверке не совпали версии ресурса и целевой страницы в Confluence, нужно обновление
        updated (конечный) - успешно прошел последнюю проверку
        error (конечный)- не удалось обработать источник, тело ошибки будет добавлено в конец description
    Порядок получения статусов:
        1) При создании ресурса - new > data_success > stand_success > updated
        2) При актуализации ресурса - updated > updated или updated > outdate > updated
        3) Если на любом этапе обработки происходит ошибка - ресурс получает статус error и пояснение ошибки добавляется в конец описания (поле description)
    """

    def __init__(self, source_note):
        self.source_type = ['confluence_page_id']
        self.confluence = ConfluenceAPI()
        self.source = source_note
        self.fields_to_update = {}
        self.stand_data = {}

    def validate_source(self):
        fields = ['id', 'value', 'version',
                  'description', 'status', 'stand_id']
        for field in fields:
            try:
                self.source[field]
            except KeyError as e:
                raise Exception(
                    f"Invalid source confluence_page_id, missing field: {field}")
        for field in ['id', 'value', 'status']:
            if not self.source['field']:
                raise Exception(
                    f"Invalid source confluence_page_id, empty field: {field}")

    def process_source_dispatcher(self):
        """
        Точка входа обработки ресурсов. 
        За один вызов обрабатывает ресурс ОДИН раз. Для получения конечного статуса необходимо вызвать несколько раз
        Вернёт {fields_to_update: {}, stand_data: {}}
        сначала нужно обновить все поля из fields_to_update 
        затем обновить поля стенда из stand_data, либо создать стенд
        ключи из словарей совпадают с полями бд
        """
        self.validate_source()
        if self.source['status'] == 'new':
            return self._process_new()

    def _process_new(self):
        page_data = self.get_page_data()
        if not page_data['success']:
            self.fields_to_update['status'] = 'error'
            self.fields_to_update['description'] = f"{self.source['description']} ||| {page_data['error']}"
            return {'fields_to_update': self.fields_to_update, 'success': False}
        self.fields_to_update['status'] = 'data_success'
        self.fields_to_update['version'] = page_data['version']
        self.stand_data['html_layout'] = page_data['layout']
        self.stand_data['name'] = page_data['title']
        self.stand_data['description'] = [
            f"Created by confluence_page_id source {self.source['value']}\n\nConfluence link should be: \n{self.confluence.base_url.replace('/rest/api', '')}/pages/viewpage.action?pageId={self.source['value']}"]

    def _get_page_data(self):
        """Вернёт {'success': True, 'title': str, 'version': str, 'layout': str}, если 'success': False, добавится ключ 'error'"""
        try:
            return self.confluence.get_page_data(self.source['value'])
        except Exception as e:
            return {'success': False, 'error': f'Unknown error when get_page_data: {e}'}

    def _get_page_version(self):
        """Вернёт {'success': True, 'version': str 'when_number'} если 'success': False, добавится ключ 'error'"""
        try:
            return self.confluence.get_page_version(self.source['value'])
        except Exception as e:
            return {'success': False, 'error': f'Unknown error when get_page_version: {e}'}
