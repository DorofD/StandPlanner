from repository.queries.base_query import execute_db_query


def get_stands_db():
    query = f"""
            SELECT * FROM stands
            """
    return execute_db_query(query)


def get_stand_db(id: int):
    query = f"""
            SELECT * FROM stands
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def add_stand_db(name: str, description: str = ''):
    query = f"""
            INSERT INTO stands ('name', 'description') VALUES('{name}', '{description}');
            """
    return execute_db_query(query)


# def change_stand_db(id: int, role: str):
#     query = f"""
#             UPDATE stands SET role = '{role}'
#             WHERE id = '{id}'
#             """
#     return execute_db_query(query)


def delete_stand_db(id: int):
    query = f"""
            DELETE FROM stands
            WHERE id = '{id}'
            """
    return execute_db_query(query)
