import json
from ldap3 import Connection
from env_vars import get_env_var
from repository.queries.users import get_user_db, get_users_db, add_user_db, delete_user_db, change_user_db


LDAP_SERVER = get_env_var('LDAP_SERVER')
LDAP_USER = get_env_var('LDAP_USER')
LDAP_PASSWORD = get_env_var('LDAP_PASSWORD')
LDAP_USER_CN = get_env_var('LDAP_USER_CN')
SEARCH_USER_CATALOG = get_env_var('SEARCH_USER_CATALOG')
SEARCH_BASE = get_env_var('SEARCH_BASE')

EDOROFEEV_PASS = get_env_var('EDOROFEEV_PASS')


def ldap_auth(login: str, password: str):
    try:
        conn = Connection(server=LDAP_SERVER, user=LDAP_USER_CN,
                          auto_bind=True, password=LDAP_PASSWORD)

        conn.search(search_filter=f'(sAMAccountName={login})',
                    search_base=SEARCH_BASE, )
        entry = json.loads(conn.entries[0].entry_to_json())
        user_dn = entry['dn']
        conn = Connection(server=LDAP_SERVER, user=user_dn,
                          password=password, raise_exceptions=True)
        if conn.bind():
            return True
        return False
    except:
        return False


def local_auth(login: str, password: str):
    pass


def signin(login: str, password: str):
    user = get_user_db(login)
    if not user:
        return False
    user = user[0]
    if user['auth_type'] == 'ldap':
        if ldap_auth(login, password):
            return {'login': login, 'role': user['role']}
        return False
    else:
        if password == user['password']:
            return {'login': login, 'role': user['role']}
        return False


def get_users():
    return get_users_db()


def add_user(login: str, auth_type: str, role: str):
    if auth_type == 'ldap':
        add_user_db(login=login, auth_type=auth_type, role=role)
    else:
        pasword = 'password'
        add_user_db(login=login, auth_type=auth_type,
                    role=role, password=pasword)


def change_user(id: int, role: str):
    print(id, role)
    change_user_db(id=id, role=role)


def delete_user(id: int):
    delete_user_db(id=id)

# print(signin('edorofeev', EDOROFEEV_PASS))
# print(signin('admin', 'admin'))
# print(ldap_auth('edorofeev', EDOROFEEV_PASS))
