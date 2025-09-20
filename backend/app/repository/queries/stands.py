from app.repository.queries.base_query import execute_db_query, execute_parametrized_query


# class DBStands():
#     def __init__(self):
#         self.table_name = 'stands'

#     def get_stands_list(self):
#         query = f"""
#                 SELECT id, uuid, name, source_type, updated_at, created_by, source_status FROM {self.table_name};
#                 """
#         return execute_db_query(query)

#     def get_stands_list_by_source_type(self, source_type):
#         query = f"""
#                 SELECT id, uuid, name, source_type, updated_at, created_by FROM {self.table_name}
#                 WHERE source_type = '{source_type}';
#                 """
#         return execute_db_query(query)

#     def get_stand(self, id: int):
#         query = f"""
#                 SELECT * FROM {self.table_name}
#                 WHERE id = '{id}';
#                 """
#         result = execute_db_query(query)
#         if result:
#             return result[0]
#         else:
#             return False

#     def get_stand_id_by_name(self, name):
#         """Возвращает int"""
#         query = f"""
#                 SELECT id FROM {self.table_name}
#                 WHERE name = '{name}';
#                 """
#         note = execute_db_query(query)
#         if note:
#             return note[0]['id']
#         else:
#             return False

#     def get_stand_uuid_by_id(self, id):
#         query = f"""
#                 SELECT uuid FROM {self.table_name}
#                 WHERE id = '{id}';
#                 """
#         note = execute_db_query(query)
#         if note:
#             return note[0]['uuid']
#         else:
#             return False

#     def add_stand(self, stand_uuid: str, name: str, source_type: str, description: str = '', page_layout: str = '', updated_at: str = 'never', source_status: str = '', source_link: str = "", created_by: str = ''):
#         """Возвращает int lastrowid"""
#         query = f"""
#             INSERT INTO stands (uuid, name, source_type, description, page_layout, updated_at, source_status, source_link, created_by)
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
#         """
#         params = [stand_uuid, name, source_type, description, page_layout,
#                   updated_at, source_status, source_link, created_by]
#         return execute_parametrized_query(query, params)

#     def update_stand_field(self, id: int, field: str, value: str):
#         """Можно менять значения полей name, description, page_layout"""
#         query = f"""
#                 UPDATE {self.table_name} SET {field} = '{value}'
#                 WHERE id = '{id}';
#                 """
#         return execute_db_query(query)

#     def update_stand_layout(self, id, page_layout):
#         query = f"""
#             UPDATE stands SET page_layout = ? WHERE id = ?;
#         """
#         params = [page_layout, id]
#         return execute_parametrized_query(query, params)

#     def add_text_to_stand_description(self, id, adding_text):
#         query = f"""
#                     UPDATE {self.table_name}
#                     SET description = description || '{adding_text}'
#                     WHERE id = '{id}';
#                     """
#         return execute_db_query(query)

#     def delete_stand(self, id: int):
#         query = f"""
#                 DELETE FROM {self.table_name}
#                 WHERE id = '{id}';
#                 """
#         return execute_db_query(query)


class DBStands:
    def __init__(self):
        self.table_name = 'stands'

    def get_stands_list(self):
        query = f"""
            SELECT id, uuid, name, source_type, updated_at, created_by, source_status
            FROM {self.table_name};
        """
        return execute_parametrized_query(query)

    def get_uuids_to_names_dict(self):
        query = f"""
            SELECT uuid, name
            FROM {self.table_name};
        """
        tmp_dict = execute_parametrized_query(query)
        # uuids_list = [row['uuid'] for row in tmp_dict]
        result_dict = {}
        for note in tmp_dict:
            result_dict[note['uuid']] = note['name']
        return result_dict

    def get_stands_list_by_source_type(self, source_type):
        query = f"""
            SELECT id, uuid, name, source_type, updated_at, created_by
            FROM {self.table_name}
            WHERE source_type = %s;
        """
        return execute_parametrized_query(query, [source_type])

    def get_stand(self, id: int):
        query = f"""
            SELECT * FROM {self.table_name}
            WHERE id = %s;
        """
        result = execute_parametrized_query(query, [id])
        if result:
            return result[0]
        else:
            return False

    def get_stand_id_by_name(self, name):
        """Возвращает int"""
        query = f"""
            SELECT id FROM {self.table_name}
            WHERE name = %s;
        """
        note = execute_parametrized_query(query, [name])
        if note:
            return note[0]['id']
        else:
            return False

    def get_stand_uuid_by_id(self, id):
        query = f"""
            SELECT uuid FROM {self.table_name}
            WHERE id = %s;
        """
        note = execute_parametrized_query(query, [id])
        if note:
            return note[0]['uuid']
        else:
            return False

    def add_stand(self, stand_uuid: str, name: str, source_type: str, description: str = '', page_layout: str = '', updated_at: str = 'never', source_status: str = '', source_link: str = "", created_by: str = ''):
        """Возвращает int lastrowid"""
        query = f"""
            INSERT INTO {self.table_name} (uuid, name, source_type, description, page_layout, updated_at, source_status, source_link, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        params = [stand_uuid, name, source_type, description, page_layout,
                  updated_at, source_status, source_link, created_by]
        result = execute_parametrized_query(query, params)
        if result:
            return result[0]['id']
        else:
            return None

    def update_stand_field(self, id: int, field: str, value: str):
        """Можно менять значения полей name, description, page_layout"""
        allowed_fields = {'name', 'description', 'page_layout'}
        if field not in allowed_fields:
            raise ValueError(f"Field '{field}' is not allowed to be updated")
        query = f"""
            UPDATE {self.table_name} SET {field} = %s
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [value, id])

    def update_stand_layout(self, id, page_layout):
        query = f"""
            UPDATE {self.table_name} SET page_layout = %s WHERE id = %s;
        """
        params = [page_layout, id]
        return execute_parametrized_query(query, params)

    def add_text_to_stand_description(self, id, adding_text):
        query = f"""
            UPDATE {self.table_name}
            SET description = COALESCE(description,'') || %s
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [adding_text, id])

    def delete_stand(self, id: int):
        query = f"""
            DELETE FROM {self.table_name}
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [id])
