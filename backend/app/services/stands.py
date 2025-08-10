from app.repository.queries.stands import DBStands


def get_stands(source_type):
    if source_type == 'all':
        return DBStands().get_stands_list()
    else:
        return DBStands().get_stands_list_by_source_type(source_type)


def get_stand(id):
    return DBStands().get_stand(id)


def add_stand(name: str, description: str):
    DBStands().add_stand(name=name, source_type='manual',
                         status='unknown', description=description)


def delete_stand(id: int):
    DBStands().delete_stand(id=id)


def change_stand(id: int, name: str = '', description: str = ''):
    if name:
        DBStands().change_stand(id, 'name', name)
    if description:
        DBStands().change_stand(id, 'description', description)
