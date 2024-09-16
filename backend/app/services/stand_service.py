from app.repository.queries.stands import get_stand_db, get_stands_db, add_stand_db, change_stand_db, delete_stand_db


def get_stands():
    return get_stands_db()


def add_stand(name: str, description: str):
    add_stand_db(name=name, description=description)


def delete_stand(id: int):
    delete_stand_db(id=id)


def change_stand(id: int, name: str, description: str):
    change_stand_db(id=id, name=name, description=description)
