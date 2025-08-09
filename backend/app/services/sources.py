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


def process_source(source_type, source_id):
    if source_type == 'confluence_page_id':
        # обработка ресурса по правилам соответствующего типа ресурсов
        # на выходе отдаст обновленные данные ресурса и стенда (при наличии обновлений для стенда), которые необходимо записать в бд
        current_app.logger.debug(
            f"Calling handler for {source_type} with id {source_id}")
        result = handle_confluence_page_id(source_id)
        return result


def handle_confluence_page_id(source_id):
    """
    Передает ресурс обработчику соответствующего типа ресурсов, полученные данные записывает записывает в БД
    Доводит обрабатываемый ресурс до конечного статуса (updated или error)
    """
    db_source = DBSourcesConfluencePageId()
    db_stands = DBStands()
    processed_note = db_source.get_source(source_id)
    source_type = 'confluence_page_id'
    if processed_note['status'] == 'updated':
        step_number = 3
    else:
        step_number = 5

    count = 0
    while count < step_number:
        processed_note = db_source.get_source(source_id)
        current_app.logger.debug(
            f"Start iteration number: {count}, processed_note: status {processed_note['status']}, pageId {processed_note['value']}")
        if processed_note['status'] == 'updated' and count != 0:
            current_app.logger.debug(f"First check worked, returning True")
            return True
        # if processed_note['status'] == 'error':
        #     current_app.logger.debug(f"Second check worked, returning False")
        #     return False
        count += 1
        process_result = ConfluencePageIdSource(
            processed_note).process_source_dispatcher()
        current_app.logger.debug(
            f"Get proccess_result, result is: {process_result['success']}")
        if 'fields_to_update' in process_result:
            updated_fields = process_result['fields_to_update']
            for field_name in updated_fields:
                db_source.update_source_field(
                    processed_note['id'], field_name, updated_fields[field_name])
        if 'stand_data' in process_result:
            stand_data = process_result['stand_data']
            if not processed_note['stand_id']:
                try:
                    current_app.logger.debug(
                        f"Going to add stand: name - {stand_data['name']} \nsource_type - {source_type}\nstatus - {stand_data['status']}\ndescription - {stand_data['description']}\nsome long layout and last_update never")
                    added_stand_id = db_stands.add_stand(
                        stand_data['name'], source_type, stand_data['status'], stand_data['description'], stand_data['html_layout'].encode('utf-8'), 'never')
                    current_app.logger.debug(
                        f"Adding result is {str(added_stand_id)}")
                    if not added_stand_id:
                        raise Exception(
                            'Fail to add stand')
                    db_source.set_source_stand_id(
                        processed_note['id'], added_stand_id)
                    db_source.update_source_field(
                        processed_note['id'], 'status', 'stand_success')
                except Exception as e:
                    current_app.logger.error(
                        f"Source processing error: Unknown error when creating stand: {e}")
                    db_source.update_source_field(
                        processed_note['id'], 'status', 'error')
                    current_description = db_source.get_source(
                        processed_note['id'])['description']
                    for i in [int(processed_note['id']), 'description', str(
                            current_description) + f"||| Unknown error when creating stand: {e}", 'КОНЕЦ !']:
                        print(type(i))

                    db_source.add_text_to_source_description(
                        int(processed_note['id']), f"||| Unknown error when creating stand, check logs")
                    break
            else:
                try:
                    for field_name in stand_data:
                        if field_name != 'add_to_description' and field_name != 'html_layout':
                            db_stands.update_stand_field(
                                processed_note['stand_id'], field_name, stand_data[field_name])
                        elif field_name == 'add_to_description':
                            db_stands.add_text_to_stand_description(
                                processed_note['stand_id'], stand_data[field_name])
                        elif field_name == 'html_layout':
                            db_stands.update_stand_html(
                                processed_note['stand_id'], stand_data['html_layout'])
                except Exception as e:
                    current_app.logger.error(
                        f"Source processing error: Unknown error when updating stand: {e}")
                    db_source.update_source_field(
                        processed_note['id'], 'status', 'error')
                    current_description = db_source.get_source(
                        processed_note['id'])['description']
                    db_source.update_source_field(
                        processed_note['id'], 'description', current_description + f"||| Unknown error when updating stand: {e}")
                    break
    current_app.logger.debug(
        f"Enter out of cycle, something goes wrong, return False")
    return False


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
