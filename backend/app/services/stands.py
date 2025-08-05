from app.repository.queries.stands import DBStands


def get_stands():
    return DBStands().get_stands_list()


def get_stand(id):
    return DBStands().get_stand(id)[0]


def add_stand(name: str, description: str):
    DBStands().add_stand(name=name, source_type='manual', description=description)


def delete_stand(id: int):
    DBStands().delete_stand(id=id)


def change_stand(id: int, name: str = '', description: str = ''):
    if name:
        DBStands().change_stand(id, 'name', name)
    if description:
        DBStands().change_stand(id, 'description', description)
