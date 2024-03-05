import json
from ldap3 import Connection
from env_vars import get_env_var


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

        conn.search(search_filter=f'(&(objectClass=user)(objectCategory=person)(sAMAccountName={login}))',
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


print(ldap_auth('edorofeev', EDOROFEEV_PASS))
