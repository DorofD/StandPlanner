from repository.queries.base_query import execute_db_query


def get_reservations_db():
    query = f"""
            SELECT * FROM reservations
            """
    return execute_db_query(query)


def get_reservations_for_planner_db():
    query = f"""
            SELECT reservations.id, users.login, stands.name, reservations.start_time, reservations.duration, reservations.status FROM reservations
            JOIN users ON reservations.user_id=users.id
            JOIN stands ON reservations.stand_id=stands.id
            WHERE status = 'planned' OR status = 'active'
            """
    return execute_db_query(query)


def get_reservation_db(id: int):
    query = f"""
            SELECT * FROM reservations
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def get_reservations_for_check_intersections_db(stand_id: int):
    query = f"""
            SELECT * FROM reservations
            WHERE stand_id = {stand_id}
            AND (status = 'planned' OR status = 'active')
            """
    return execute_db_query(query)


def get_info_for_failed_intersection_db(id: int):
    query = f"""
            SELECT users.login, reservations.start_time FROM reservations
            JOIN users ON reservations.user_id=users.id
            WHERE reservations.id = '{id}'
            """
    return execute_db_query(query)


def add_reservation_db(user_id: int, stand_id: int, start_time: str, duration: str, status: str):
    query = f"""
            INSERT INTO reservations ('user_id', 'stand_id', 'start_time', 'duration', 'status') VALUES('{user_id}', '{stand_id}', '{start_time}', '{duration}', '{status}');
            """
    return execute_db_query(query, last_row_id=True)


def change_reservation_job_db(id: int, job_type: str, job_id: str):
    """
    job_type - ожидается строка 'start_job' или 'end_job'
    """
    query = f"""
            UPDATE reservations SET {job_type} = '{job_id}'
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def change_reservation_status_db(id: int, status: str):
    """
    статусы: planned, active, completed
    """
    query = f"""
            UPDATE reservations SET status = '{status}'
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def change_reservation_start_time_db(id: int, start_time: str):
    query = f"""
            UPDATE reservations SET start_time = '{start_time}'
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def change_reservation_duration_db(id: int, duration: str):
    query = f"""
            UPDATE reservations SET duration = '{duration}'
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def delete_reservation_db(id: int):
    query = f"""
            DELETE FROM reservations
            WHERE id = '{id}'
            """
    return execute_db_query(query)


# print(add_reservation_db(1, 2, '10:00', '2 часа нахуй', 'planned'))
# print(change_reservation_job_db(3, 'start_job', 'adfgsedgertgzdf'))
