from app.repository.queries.stands import DBStands


def get_stands():
    return DBStands().get_stands_list()


def get_stand(id):
    return DBStands().get_stand(id)


def add_stand(name: str, description: str, current_user):
    DBStands().add_stand(name=name, source_type='manual',
                         status='unknown', description=description, created_by=current_user)


def delete_stand(id: int):
    DBStands().delete_stand(id=id)


def change_stand(id: int, updated_fields: list):
    if 'name' in updated_fields:
        DBStands().update_stand_field(id, 'name', updated_fields['name'])
    if 'description' in updated_fields:
        DBStands().update_stand_field(
            id, 'description', updated_fields['description'])
