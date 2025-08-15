from flask import current_app
from app.repository.queries.sources_confluence_page_id import DBSourcesConfluencePageId
from app.repository.queries.stands import DBStands
from app.domain.sources import ConfluencePageIdSource
import traceback
# logger = current_app.logger
# logger.error(f"User failed to log in: {user['login']}")
# logger.info(f"User is logged in: {user['login']}")


def add_source(source_note):
    print('source_type' not in source_note)
    if 'source_type' not in source_note:
        return {'success': False, 'message': "no source_type field in source_note"}
    if not source_note['source_type']:
        return {'success': False, 'message': "source_type field is empty"}
    if source_note['source_type'] == 'confluence_page_id':
        DBSourcesConfluencePageId().add_source(
            source_note['value'], source_note['description'])
        return {'success': True, 'message': "Source added"}


def process_source(source_type, source_id):
    if source_type == 'confluence_page_id':
        result = handle_confluence_page_id(source_id)
        return result


def bulk_process_sources(source_type):
    if source_type == 'confluence_page_id':
        current_app.logger.debug(
            f"Starting bulk update for confluence_page_id sources")
        all_sources = DBSourcesConfluencePageId().get_all_sources_short_info()
        results = []
        exceptions = []
        for source in all_sources:
            result_note = {'id': source['id'], 'value': source['value'],
                           'status_before': source['status'], 'status_after': None, 'success': None}
            try:
                handle_result = handle_confluence_page_id(source['id'])
                if handle_result:
                    result_note['success'] = True
                else:
                    result_note['success'] = False
                result_note['status_after'] = DBSourcesConfluencePageId().get_source(source['id'])[
                    'status']
                results.append(result_note)
            except Exception as e:
                current_app.logger.error(
                    f"Unknown exception in bulk update with source: id {source['id']}, pageId: {source['value']}; Exception is: {e}")
                result_note['success'] = False
                exceptions.append(
                    {'id': source['id'], 'value': source['value']})

        current_app.logger.debug(
            f"Ending bulk update for confluence_page_id sources")
        if not exceptions:
            current_app.logger.debug(
                f"There were no exceptions on bulk update layer")

        else:
            current_app.logger.debug(
                f"Got {len(exceptions)} exceptions on bulk update, see the previous error logs")

        final_result_note_str = "Results summary is:\n"
        for note in results:
            final_result_note_str += f"\n\nSource - id: {note['id']}, pageId: {note['value']}, success: {note['success']}\nStatus changes: {note['status_before']} => {note['status_after']}"
        current_app.logger.debug(final_result_note_str)

        return {'success': True, 'results': results, 'exceptions': exceptions}


def handle_confluence_page_id(source_id):
    """
    Передает ресурс обработчику соответствующего типа, затем сохраняет данные и обрабатывает ошибки
    """
    db_source = DBSourcesConfluencePageId()
    db_stands = DBStands()
    source_type = 'confluence_page_id'

    processed_note = db_source.get_source(source_id)

    process_result = ConfluencePageIdSource(
        processed_note).process_source_dispatcher()
    current_app.logger.debug(
        f"Get proccess_result, result is: {process_result['success']}")
    # try:
    # обработка ошибки процессинга ConfluencePageIdSource
    if process_result['success'] == False:
        current_app.logger.error(
            f"ConfluencePageIdSource.process_source_dispatcher catched unknown exception when processing: \n\n {process_result['error_message']}")

        operations_log_str = f"[ {' ] => [ '.join(process_result['operations_log'])} ]"

        current_app.logger.error(
            f"Operations log: \n\n {operations_log_str}")
        db_source.update_source_field(source_id, 'status', 'failed')
        db_source.add_text_to_source_description(
            source_id, f"\n\n{process_result['error_message']}")
        if processed_note['stand_id']:
            DBStands().update_stand_field(
                processed_note['stand_id'], 'last_update', 'source_failed')
        return {'success': False, 'message': "Unknown error in ConfluencePageIdSource, see more in descriptions and logs"}

    if 'fields_to_update' in process_result:
        updated_fields = process_result['fields_to_update']
        for field_name in updated_fields:
            if field_name == 'id':
                continue
            db_source.update_source_field(
                processed_note['id'], field_name, updated_fields[field_name])

    if 'stand_data' in process_result:
        stand_data = process_result['stand_data']
        if not processed_note['stand_id']:
            # список ключей
            # stand_data['last_update']
            # stand_data['name']
            # stand_data['page_layout']
            # stand_data['description']
            # fields_to_update['status']
            # fields_to_update['version']
            # fields_to_update['last_update']
            added_stand_id = db_stands.add_stand(
                stand_data['name'], source_type, "unknown", stand_data['description'], '', stand_data['last_update'])
            if not added_stand_id:
                raise Exception(
                    'Fail to add stand')
            db_stands.update_stand_layout(
                added_stand_id, stand_data['page_layout'])
            db_source.set_source_stand_id(
                processed_note['id'], added_stand_id)

        else:
            for field_name in stand_data:
                if field_name == 'last_update':
                    db_stands.update_stand_field(
                        processed_note['stand_id'], 'last_update', stand_data['last_update'])
                if field_name == 'name':
                    db_stands.update_stand_field(
                        processed_note['stand_id'], 'name', stand_data['name'])
                elif field_name == 'page_layout':
                    db_stands.update_stand_layout(
                        processed_note['stand_id'], stand_data['page_layout'])
    return {'success': True, 'message': "Successful processed"}
    # except Exception as e:
    #     error_message = f"{str(e)} | {traceback.format_exc()}"
    #     current_app.logger.error(error_message)
    #     print(error_message)

    # finally:
    #     return {
    #         'success': False,
    #         'message': "Something went wrong! See logs to find more"
    #     }


def get_sources(source_type):
    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().get_all_sources()
    raise Exception('Unknown source_type')


def change_source(source_type, source_note):
    if source_type == 'confluence_page_id':
        try:
            source_id = source_note['id']
        except KeyError as e:
            raise Exception("Field id didn't found in source_note to change")

        if 'description' in source_note:
            DBSourcesConfluencePageId().update_source_field(
                source_id, 'description', source_note['description'])
        return True

    raise Exception('Unknown source_type')


def delete_source(source_id, source_type):
    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().delete_source(source_id)
    raise Exception('Unknown source_type')
