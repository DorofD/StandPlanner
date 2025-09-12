from flask import current_app
from app.repository.queries.sources_confluence_page_id import DBSourcesConfluencePageId
from app.repository.queries.sources_confluence_tag import DBSourcesConfluenceTag
from app.repository.queries.stands import DBStands
from app.domain.sources import ConfluencePageIdSource, ConfluenceTagSource
import traceback
import json
# logger = current_app.logger
# logger.error(f"User failed to log in: {user['login']}")
# logger.info(f"User is logged in: {user['login']}")


def add_source(source_note, user: str = ''):
    if 'source_type' not in source_note:
        return {'success': False, 'message': "no source_type field in source_note"}
    if not source_note['source_type']:
        return {'success': False, 'message': "source_type field is empty"}
    if source_note['source_type'] == 'confluence_page_id':
        DBSourcesConfluencePageId().add_source(
            source_note['value'], source_note['description'], '', user)
        return {'success': True, 'message': "Source added"}
    if source_note['source_type'] == 'confluence_tag':
        DBSourcesConfluenceTag().add_source(
            source_note['value'], source_note['description'], user)
        return {'success': True, 'message': "Source added"}


def process_source(source_type, source_id):
    if source_type == 'confluence_page_id':
        result = handle_confluence_page_id(source_id)
        return result
    if source_type == 'confluence_tag':
        result = handle_confluence_tag(source_id)
        return result


def bulk_process_sources(source_type):
    if source_type == 'confluence_page_id':
        current_app.logger.debug(
            f"Starting bulk update for confluence_page_id sources")
        all_sources = DBSourcesConfluencePageId().get_all_sources_short_info()
        result = True
        for source in all_sources:
            try:
                if not process_source('confluence_page_id', source['id']):
                    result = False
            except Exception as e:
                result = False
                current_app.logger.error(
                    f"Unknown exception in bulk update with source: id {source['id']}, pageId: {source['value']}; Exception is: {str(e)} | {traceback.format_exc()}")
                DBSourcesConfluencePageId().update_source_field(
                    source['id'], 'status', 'failed')
                DBSourcesConfluencePageId().add_text_to_source_description(
                    source['id'], f"Exception is: {str(e)} | {traceback.format_exc()}")
                continue
        return result


def handle_confluence_page_id(source_id):
    """
    Передает ресурс обработчику соответствующего типа, затем сохраняет данные и обрабатывает ошибки
    """
    db_source = DBSourcesConfluencePageId()
    db_stands = DBStands()
    source_type = 'confluence_page_id'

    processed_note = db_source.get_source(source_id)
    try:
        process_result = ConfluencePageIdSource(
            processed_note).process_source_dispatcher()
    except Exception as e:
        current_app.logger.error(
            f"Error in handle_confluence_page_id => ConfluencePageIdSource: {str(e)} | {traceback.format_exc()}")
        db_source.update_source_field(source_id, 'status', 'failed')
        db_source.add_text_to_source_description(
            source_id, f"\n\n{e}")
        if processed_note['stand_id']:
            DBStands().update_stand_field(
                processed_note['stand_id'], 'source_status', 'failed')
        return False

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
            # stand_data['updated_at']
            # stand_data['name']
            # stand_data['page_layout']
            # stand_data['description']
            # stand_data['created_by']
            # stand_data['source_link']
            # fields_to_update['status']
            # fields_to_update['version']
            # fields_to_update['updated_at']
            # print(stand_data['name'])
            added_stand_id = db_stands.add_stand(
                stand_data['name'], source_type, "unknown", stand_data['description'], '', stand_data['updated_at'], 'relevant', stand_data['source_link'], stand_data['created_by'])
            if not added_stand_id:
                raise Exception(
                    'Fail to add stand')
            db_stands.update_stand_layout(
                added_stand_id, stand_data['page_layout'])
            db_source.set_source_stand_id(
                processed_note['id'], added_stand_id)

        else:
            for field_name in stand_data:
                if field_name == 'updated_at':
                    db_stands.update_stand_field(
                        processed_note['stand_id'], 'updated_at', stand_data['updated_at'])
                if field_name == 'name':
                    db_stands.update_stand_field(
                        processed_note['stand_id'], 'name', stand_data['name'])
                elif field_name == 'page_layout':
                    db_stands.update_stand_layout(
                        processed_note['stand_id'], stand_data['page_layout'])
    return True


def handle_confluence_tag(source_id):
    """
    Передает ресурс обработчику соответствующего типа, затем сохраняет данные и обрабатывает ошибки
    """
    db_source = DBSourcesConfluenceTag()
    db_child_source = DBSourcesConfluencePageId()

    processed_note = db_source.get_source(source_id)
    try:
        process_result = ConfluenceTagSource(
            processed_note).process_source_dispatcher()
    except Exception as e:
        current_app.logger.error(
            f"Error in handle_confluence_tag => ConfluenceTagSource: {str(e)} | {traceback.format_exc()}")
        db_source.update_source_field(source_id, 'status', 'failed')
        db_source.add_text_to_source_description(
            source_id, f"\n\n{e} | {traceback.format_exc()}")
        return False

    if 'fields_to_update' in process_result:
        updated_fields = process_result['fields_to_update']
        for field_name in updated_fields:
            if field_name == 'id':
                continue
            db_source.update_source_field(
                processed_note['id'], field_name, updated_fields[field_name])

    if 'found_sources' in process_result and process_result['found_sources']:
        found_sources = process_result['found_sources']

        # добавление новых дочерних источников PageId
        current_tag_source = db_source.get_source(source_id)
        current_child_sources = current_tag_source['child_sources']
        if current_child_sources:
            current_child_sources = json.loads(current_child_sources)
        else:
            current_child_sources = []
        for found_src in found_sources:
            # удаление дубликатов, созданных не текущим ConfluenceTag
            duplicate_source = db_child_source.get_source_by_value(
                found_src['value'])
            # print(duplicate_source)
            if duplicate_source and current_tag_source['value'] in duplicate_source['created_by']:
                delete_source(duplicate_source['id'], 'confluence_page_id')
                current_app.logger.info(
                    f"ConfluencePageId source with PageId {found_src['value']} was deleted due to duplication in the ConfluenceTag source with Tag {current_tag_source['value']}")
            # добавление дочернего источника в БД и в список дочерних источников ConfluenceTag
            exist = False
            for existing_source in current_child_sources:
                if existing_source['value'] == found_src['value']:
                    exist = True
            if not exist:
                added_source_id = db_child_source.add_source(
                    found_src['value'], found_src['description'], found_src['link'], found_src['created_by'])
                current_child_sources.append(
                    {'id': added_source_id, 'value': found_src['value']})
        # обновление списка текущих дочерних источников
        db_source.update_source_field(
            current_tag_source['id'], 'child_sources', json.dumps(current_child_sources))

        # удаление дочерних источников PageId, отсутствующих в найденных источниках
        current_tag_source = db_source.get_source(source_id)
        current_child_sources = current_tag_source['child_sources']
        if current_child_sources:
            current_child_sources = json.loads(current_child_sources)
        else:
            current_child_sources = []
        sources_to_delete = []
        for found_src in found_sources:
            exist = False
            for existing_source in current_child_sources:
                if found_src['value'] == existing_source['value']:
                    exist = True
            if exist:
                continue
            else:
                sources_to_delete.append(
                    {'id': existing_source['id'], 'value': existing_source['value']})

        if sources_to_delete:
            for src_to_del in sources_to_delete:
                delete_source(src_to_del['id'], 'confluence_page_id')
                current_child_sources.remove(src_to_del)
        # обновление списка текущих дочерних источников
        db_source.update_source_field(
            current_tag_source['id'], 'child_sources', json.dumps(current_child_sources))

    return True


def get_sources(source_type):
    if source_type == 'confluence_page_id':
        return DBSourcesConfluencePageId().get_all_sources()
    if source_type == 'confluence_tag':
        sources = DBSourcesConfluenceTag().get_all_sources()
        for src in sources:
            if src['child_sources']:
                src['child_sources'] = json.loads(src['child_sources'])

        return sources


def change_source(source_type, source_id, fields_to_update):
    if source_type == 'confluence_page_id':
        if 'description' in fields_to_update:
            DBSourcesConfluencePageId().update_source_field(
                source_id, 'description', fields_to_update['description'])
        return True

    if source_type == 'confluence_tag':
        if 'description' in fields_to_update:
            DBSourcesConfluenceTag().update_source_field(
                source_id, 'description', fields_to_update['description'])
        return True
    print("Nothing changed")
    return False


def delete_source(source_id, source_type):
    if source_type == 'confluence_page_id':
        source = DBSourcesConfluencePageId().get_source(source_id)
        if source['stand_id']:
            DBStands().delete_stand(source['stand_id'])
        DBSourcesConfluencePageId().delete_source(source_id)
        return source['value']
    if source_type == 'confluence_tag':
        source = DBSourcesConfluenceTag().get_source(source_id)
        if source['child_sources']:
            child_sources = json.loads(source['child_sources'])
            for child_src in child_sources:
                delete_source(child_src['id'], 'confluence_page_id')
        DBSourcesConfluenceTag().delete_source(source_id)
        return source['value']
    raise Exception('Unknown source_type')
