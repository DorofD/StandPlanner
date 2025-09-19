from app.domain.user import User
from app.repository.queries.users import DBUsers


def signin(login: str, password: str):
    user_note = DBUsers().get_user(login)
    if not user_note:
        return {'success': False, 'error':  f"User '{login}' not found in local DatabBase"}
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


def change_user(id: int, fields_to_update: list):
    if 'auth_type' in fields_to_update:
        raise Exception("Forbidden to change auth_type")
    if 'id' in fields_to_update:
        raise Exception("Forbidden to change user id")
    if 'role' in fields_to_update:
        if fields_to_update['role'] != 'admin' and fields_to_update['role'] != 'user':
            raise Exception(f"Invalid role: {fields_to_update['role']}")
    for field_name in fields_to_update:
        DBUsers().update_user_field(
            id, field_name, fields_to_update[field_name])
    return True


def delete_user(id: int):
    DBUsers().delete_user(id=id)
