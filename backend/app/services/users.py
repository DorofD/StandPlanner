from app.domain.user import User
from app.repository.queries.users import DBUsers


def signin(login: str, password: str):
    user_note = DBUsers().get_user(login)
    if not user_note:
        return False
    return User().signin(login, password, user_note[0])


def get_users():
    return DBUsers().get_users()


def add_user(login: str, auth_type: str, role: str, password: str):
    if auth_type == 'ldap':
        DBUsers().add_user(login, auth_type, role)
    elif auth_type == 'local':
        DBUsers().add_user(login, auth_type, role, password)
    else:
        raise Exception(
            f'Received unknown auth type when adding a user: {auth_type}')


def change_user(id: int, login: str, role: str, auth_type: str, password: str):
    if auth_type == 'local':
        if password:
            changes = {'login': login, 'role': role, 'password': password}
        else:
            changes = {'login': login, 'role': role}
    else:
        changes = {'login': login, 'role': role}
    DBUsers().change_user(id, changes)


def delete_user(id: int):
    DBUsers().delete_user(id=id)
