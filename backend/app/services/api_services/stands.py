from app.repository.queries.stands import get_stand_db, get_stands_list_db, add_stand_db, change_stand_db, delete_stand_db


def get_stands():
    return get_stands_list_db()


def get_stand(id):
    return get_stand_db(id)[0]


def add_stand(name: str, description: str):
    add_stand_db(name=name, creation_method='manual', description=description)


def delete_stand(id: int):
    delete_stand_db(id=id)


def change_stand(id: int, name: str = '', description: str = ''):
    if name:
        change_stand_db(id, 'name', name)
    if description:
        change_stand_db(id, 'description', description)
