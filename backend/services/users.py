import json
from ldap3 import Connection
from backend.services.env_vars import get_env_var
from backend.db.queries import get_user


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


def signin(login, password):
    user = get_user(login)
    if not user:
        return False
    if user['auth_type'] == 'ldap':
        if ldap_auth(login, password):
            return {'login': login, 'role': user['role']}
        return False
    else:
        if password == user['password']:
            return {'login': login, 'role': user['role']}
        return False


# print(signin('edorofeev', EDOROFEEV_PASS))
# print(signin('admin', 'admin'))
# print(ldap_auth('edorofeev', EDOROFEEV_PASS))
