import json
import os
from ldap3 import Connection, ALL_ATTRIBUTES
from dotenv import load_dotenv
import traceback
# from app.repository.queries.users import get_user_db, get_users_db, add_user_db, delete_user_db, change_user_db


class User():
    def __init__(self):
        load_dotenv('.env')
        self.server = os.environ['LDAP_SERVER']
        self.user = os.environ['LDAP_USER']
        self.password = os.environ['LDAP_PASSWORD']
        self.user_cn = os.environ['LDAP_USER_CN']
        self.search_user_catalog = os.environ['SEARCH_USER_CATALOG']
        self.search_base = os.environ['SEARCH_BASE']

    def ldap_auth(self, login: str, password: str):
        load_dotenv('.env')
        # реализовать добавление информации о доменном пользователе в вывод ldap
        try:
            conn = Connection(server=self.server, user=self.user_cn,
                              auto_bind=True, password=self.password)

            search_filter = f'(sAMAccountName={login})'
            attributes_to_search = [
                "sAMAccountName",
                "userPrincipalName",
                "displayName",
                "givenName",
                "sn",
                "mail",
                "telephoneNumber",
                "department",
                "title",
                "memberOf",
                "distinguishedName",
                "objectGUID",
                "whenCreated",
                "whenChanged",
            ]
            conn.search(search_base=self.search_base,
                        search_filter=search_filter,
                        attributes=attributes_to_search)
            if not conn.entries:
                return {'success': False, 'error': f"User {login} not found"}

            entry = conn.entries[0]
            user_dn = entry.distinguishedName.value

            entry = json.loads(conn.entries[0].entry_to_json())
            user_dn = entry['dn']

            # for i in attributes_to_search:
            #     print(i, '---', entry['attributes'][i])
            conn = Connection(server=self.server, user=user_dn,
                              password=password, raise_exceptions=True)
            if conn.bind():
                return True
            return False
        except Exception as exc:
            print(exc, '--', traceback.format_exc())
            return False

    def get_password_hash(self, password):
        pass

    def local_auth(self, login: str, password: str):
        pass

    def signin(self, login, password, user):
        if user['auth_type'] == 'ldap':
            if self.ldap_auth(login, password):
                return {'id': user['id'], 'login': login, 'role': user['role']}
            return False
        elif user['auth_type'] == 'local':
            if password == user['password']:
                return {'id': user['id'], 'login': login, 'role': user['role']}
            return False
        else:
            raise Exception(
                f"Unknown user auth_type in function signin: {user['auth_type']}")
