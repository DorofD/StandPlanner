from flask import current_app
from app.repository.queries.sources_confluence_page_id import DBSourcesConfluencePageId
from app.repository.queries.stands import DBStands
from app.domain.sources import ConfluencePageIdSource

# logger = current_app.logger
# logger.error(f"User failed to log in: {user['login']}")
# logger.info(f"User is logged in: {user['login']}")


def add_source(source_note):
    try:
        source_type = source_note['source_type']
    except:
        raise Exception("No source_type field in source_note")

    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().add_source(
            source_note['value'], source_note['description'])
    raise Exception('Unknown source_type')


def process_source(source_type, source_note):
    if source_type == 'confluence_page_id':
        # обработка ресурса по правилам соответствующего типа ресурсов
        # на выходе отдаст обновленные данные ресурса и стенда (при наличии обновлений для стенда), которые необходимо записать в бд
        current_app.logger.info(f"Source")
        current_app.logger.debug(f"Source")
        pass


def handle_confluence_page_id(source_note):
    """
    Передает ресурс обработчику соответствующего типа ресурсов, полученные данные записывает записывает в БД
    Доводит обрабатываемый ресурс до конечного статуса (updated или error)
    """
    source_type = 'confluence_page_id'
    # вызов обработчика
    if source_note['status'] == 'updated':
        step_number = 3
    else:
        step_number = 6

    count = 0
    while count < step_number:
        count += 1
        process_result = ConfluencePageIdSource(
            source_note).process_source_dispatcher()

        if process_result['fields_to_update']:
            db_source = DBSourcesConfluencePageId()
            updated_fields = process_result['fields_to_update']
            for field_name in updated_fields:
                db_source.update_source_field(
                    source_note['id'], field_name, updated_fields[field_name])
        if process_result['stand_data']:
            db_stands = DBStands()
            stand_data = process_result['stand_data']
            if not source_note['stand_id']:
                try:
                    db_stands.add_stand[stand_data['name'], source_type,
                                        stand_data['description'], stand_data['html_layout']]
                    stand_id = db_stands.get_stand_id_by_name(
                        stand_data['name'])
                    if not stand_id:
                        raise Exception(
                            'stand_id not found after stand creation')
                    db_source.set_source_stand_id(source_note['id'], stand_id)
                    db_source.update_source_field(
                        source_note['id'], 'status', 'stand_success')
                except Exception as e:
                    db_source.update_source_field(
                        source_note['id'], 'status', 'error')
                    current_description = db_source.get_source(source_note['id'])[
                        0]['description']
                    db_source.update_source_field(
                        source_note['id'], 'description', current_description + f"||| Unknown error when creating stand: {e}")
            else:
                try:
                    for field_name in stand_data:
                        db_stands.update_stand_field(
                            source_note['stand_id'], field_name, stand_data[field_name])
                except Exception as e:
                    db_source.update_source_field(
                        source_note['id'], 'status', 'error')
                    current_description = db_source.get_source(source_note['id'])[
                        0]['description']
                    db_source.update_source_field(
                        source_note['id'], 'description', current_description + f"||| Unknown error when updating stand: {e}")


def process_all_sources():
    pass


def get_sources(source_type):
    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().get_all_sources()
    raise Exception('Unknown source_type')


def delete_source(source_id, source_type):
    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().delete_source(source_id)
    raise Exception('Unknown source_type')
