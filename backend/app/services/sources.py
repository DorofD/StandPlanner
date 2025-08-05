from app.repository.queries.sources_confluence_page_id import DBSourcesConfluencePageId
from app.repository.queries.stands import DBStands
from app.domain.sources import ConfluencePageIdSource


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
        process_result = ConfluencePageIdSource(source_note)
        db = DBSourcesConfluencePageId()
        if process_result['fields_to_update']:
            updated_fields = process_result['fields_to_update']
            for field_name in updated_fields:
                db.update_source_field(
                    source_note['id'], field_name, updated_fields['field_name'])
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
                        raise Exception('stand_id not found after creation')
                    db.set_source_stand_id(source_note['id'], stand_id)
                    db.update_source_field(
                        source_note['id'], 'status', 'stand_success')
                except Exception as e:
                    db.update_source_field(
                        source_note['id'], 'status', 'error')
                    current_description = db.get_source(source_note['id'])[
                        0]['description']
                    db.update_source_field(
                        source_note['id'], 'description', current_description + f"||| Unknown error when creating stand: {e}")


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
