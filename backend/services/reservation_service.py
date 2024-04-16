from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from repository.queries.reservations import add_reservation_db, change_reservation_status_db, change_reservation_job_db, get_reservations_for_check_intersections, get_info_for_failed_intersection, delete_reservation_db
from errors.intersection_error import IntersectionError
from datetime import datetime, time, timedelta


import time

current_time = datetime.now().replace(microsecond=0)
print(current_time)


def run_scheduler():
    executors = {'default': ThreadPoolExecutor(1)}
    scheduler = BackgroundScheduler(executors)
    scheduler.start()
    return scheduler


scheduler = run_scheduler()


def check_intersections(stand_id: int, start_time: datetime, end_time: datetime):
    reservations = get_reservations_for_check_intersections(stand_id)
    for reservation in reservations:
        temp_parsed_start_time = datetime.strptime(
            reservation['start_time'], '%Y-%m-%d %H:%M')
        temp_parsed_duration = datetime.strptime(
            reservation['duration'], '%H:%M').time()
        temp_end_time = temp_parsed_start_time + \
            timedelta(hours=temp_parsed_duration.hour,
                      minutes=temp_parsed_duration.minute)
        if max(start_time, temp_parsed_start_time) < min(end_time, temp_end_time):
            info = get_info_for_failed_intersection(reservation['id'])
            error = IntersectionError(
                username=info[0]['login'], start_time=info[0]['start_time'])
            raise error
    return True


def change_reservation_status(id: int, status: str):
    """
    статусы: planned, active, completed
    """
    change_reservation_status_db(id, status)
    pass


def create_reservaiton(user_id: int, stand_id: int, start_time: str, duration: str):
    """
    start_time - ожидается строка в формате '%Y-%m-%d %H:%M' 
    duration - ожидается строка в формате '%H:%M'
    """
    parsed_start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M')
    parsed_duration = datetime.strptime(duration, '%H:%M').time()
    end_time = parsed_start_time + \
        timedelta(hours=parsed_duration.hour, minutes=parsed_duration.minute)

    check_intersections(stand_id, parsed_start_time, end_time)

    last_row_id = add_reservation_db(
        user_id=user_id, stand_id=stand_id, start_time=start_time, duration=duration, status='planned')['last_row_id']

    start_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                  run_date=parsed_start_time, args=[last_row_id, 'active'], misfire_grace_time=30)
    change_reservation_job_db(
        id=last_row_id, job_type='start_job', job_id=start_job.id)

    end_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                run_date=end_time, args=[last_row_id, 'completed'], misfire_grace_time=30)
    change_reservation_job_db(
        id=last_row_id, job_type='end_job', job_id=end_job.id)


def delete_reservation(id: int):
    #
    delete_reservation_db(id)


# create_reservaiton(1, 19, '2024-04-15 23:42', '1:3')

# print(scheduler.get_jobs())
# time.sleep(70)
# time.sleep(700)
scheduler.shutdown()
