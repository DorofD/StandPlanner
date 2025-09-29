from app.repository.queries.base_query import execute_parametrized_query

# CREATE TABLE IF NOT EXISTS rocket_rooms (
#     id SERIAL PRIMARY KEY,
#     rocket_id TEXT UNIQUE,
#     rocket_link TEXT UNIQUE,
#     name TEXT UNIQUE,
#     stand_uuid TEXT,
#     description TEXT,
#     updated_at TEXT,
#     FOREIGN KEY(stand_uuid) REFERENCES stands(uuid)


class DBRocketRooms():
    def __init__(self):
        self.table_name = 'rocket_rooms'
        self.allowed_fields = {'rocket_id', 'rocket_link', 'room_type',
                               'name', 'fname', 'stand_uuid', 'description', 'status', 'updated_at'}

    def get_rooms(self):
        query = f"SELECT * FROM {self.table_name}"
        return execute_parametrized_query(query)

    def add_room(self, rocket_id, rocket_link, room_type, name, fname, stand_uuid, description, status, updated_at):
        query = f"""
            INSERT INTO {self.table_name} (rocket_id, rocket_link, room_type, name, fname, stand_uuid, description, status, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (rocket_id, rocket_link, room_type, name, fname,
                  stand_uuid, description, status, updated_at)
        return execute_parametrized_query(query, params)

    def update_field(self, id: int, field: str, value: str):
        if field not in self.allowed_fields:
            raise ValueError(f"Field '{field}' is not allowed to be updated.")
        query = f"UPDATE {self.table_name} SET {field} = %s WHERE id = %s"
        params = (value, id)
        return execute_parametrized_query(query, params)

    def delete_room(self, id: int):
        query = f"DELETE FROM {self.table_name} WHERE id = %s"
        params = (id,)
        return execute_parametrized_query(query, params)

    def delete_room_by_rocket_id(self, rocket_id):
        query = f"DELETE FROM {self.table_name} WHERE rocket_id = %s"
        params = (rocket_id,)
        return execute_parametrized_query(query, params)
