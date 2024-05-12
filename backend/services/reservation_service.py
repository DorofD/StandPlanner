from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from repository.queries.reservations import *
from errors.reservation_errors import *
from datetime import datetime, time, timedelta


import time

# current_time = datetime.now().replace(microsecond=0)
# print(current_time)


def run_scheduler():
    executors = {'default': ThreadPoolExecutor(1)}
    scheduler = BackgroundScheduler(executors)
    scheduler.start()
    return scheduler


scheduler = run_scheduler()


def get_scheduler_info(scheduler):
    print(scheduler.running)
    for job in scheduler.get_jobs():
        print(
            f"ID: {job.id}, Имя: {job.name}, Следующий запуск: {job.next_run_time}, Триггер: {job.trigger}")


def get_reservations_for_planner():
    return get_reservations_for_planner_db()


def check_intersections(stand_id: int, start_time: datetime, end_time: datetime, reservation_id: int = 0):
    """ reservation_id указывается при необходимости исключить определенное резервирование из проверки """
    reservations = get_reservations_for_check_intersections_db(stand_id)
    if reservation_id:
        for i in range(len(reservations)):
            if reservations[i]['id'] == reservation_id:
                del reservations[i]
                break

    for reservation in reservations:
        temp_parsed_start_time = datetime.strptime(
            reservation['start_time'], '%d-%m-%Y %H:%M')
        temp_parsed_duration = datetime.strptime(
            reservation['duration'], '%H:%M').time()
        temp_end_time = temp_parsed_start_time + \
            timedelta(hours=temp_parsed_duration.hour,
                      minutes=temp_parsed_duration.minute)
        if max(start_time, temp_parsed_start_time) < min(end_time, temp_end_time):
            info = get_info_for_failed_intersection_db(reservation['id'])
            error = IntersectionError(
                username=info[0]['login'], start_time=info[0]['start_time'])
            raise error
    return True


# check_intersections(2, datetime.strptime(
#     '12-05-2024 10:00', '%d-%m-%Y %H:%M'), datetime.strptime('10:00', '%H:%M'), 46)


def change_reservation_status(id: int, status: str):
    """ статусы: planned, active, completed """
    change_reservation_status_db(id, status)
    pass


def add_reservaiton(user_id: int, stand_id: int, start_time: str, duration: str):
    """
    start_time - ожидается строка в формате '%d-%m-%Y %H:%M' или 'startNow'
    duration - ожидается строка в формате '%H:%M'
    """
    if start_time == 'startNow':
        status = 'active'
        parsed_start_time = datetime.strptime(
            str(datetime.now().replace(microsecond=0).strftime("%d-%m-%Y %H:%M")), '%d-%m-%Y %H:%M')
    else:
        status = 'planned'
        parsed_start_time = datetime.strptime(start_time, '%d-%m-%Y %H:%M')
        now = datetime.strptime(
            str(datetime.now().replace(microsecond=0).strftime("%d-%m-%Y %H:%M")), '%d-%m-%Y %H:%M')
        if parsed_start_time - now <= timedelta(minutes=5):
            raise ReservationError(
                "Запланированное резервирование должно начинаться не ранее 5 минут с момента создания")
    parsed_duration = datetime.strptime(duration, '%H:%M').time()
    end_time = parsed_start_time + \
        timedelta(hours=parsed_duration.hour, minutes=parsed_duration.minute)

    check_intersections(stand_id, parsed_start_time, end_time)

    time_to_db = f"{str(parsed_start_time)[8:10]}-{str(parsed_start_time)[5:7]}-{str(parsed_start_time)[0:4]} {str(parsed_start_time)[11:16]}"
    last_row_id = add_reservation_db(
        user_id, stand_id, time_to_db, duration, status)['last_row_id']

    if start_time == 'startNow':
        change_reservation_job_db(
            id=last_row_id, job_type='start_job', job_id='')
    else:
        start_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                      run_date=parsed_start_time, args=[last_row_id, 'active'], misfire_grace_time=30)
        change_reservation_job_db(
            id=last_row_id, job_type='start_job', job_id=start_job.id)

    end_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                run_date=end_time, args=[last_row_id, 'completed'], misfire_grace_time=30)
    change_reservation_job_db(
        id=last_row_id, job_type='end_job', job_id=end_job.id)


def change_reservation(reservation_id: int, stand_id: int, start_time: str, duration: str):
    """
    start_time - ожидается строка в формате '%d-%m-%Y %H:%M'
    duration - ожидается строка в формате '%H:%M'
    """
    reservation = get_reservation_db(reservation_id)

    parsed_start_time = datetime.strptime(start_time, '%d-%m-%Y %H:%M')
    now = datetime.strptime(
        str(datetime.now().replace(microsecond=0).strftime("%d-%m-%Y %H:%M")), '%d-%m-%Y %H:%M')

    if parsed_start_time - now <= timedelta(minutes=5) and reservation[0]['status'] != 'active':
        raise ReservationError(
            "Запланированное резервирование должно начинаться не ранее 5 минут с момента создания")
    parsed_duration = datetime.strptime(duration, '%H:%M').time()
    end_time = parsed_start_time + \
        timedelta(hours=parsed_duration.hour, minutes=parsed_duration.minute)

    if reservation[0]['status'] == 'active':
        parsed_reservation_start_time = datetime.strptime(
            reservation[0]['start_time'], '%d-%m-%Y %H:%M')
        parsed_reservation_duration = datetime.strptime(
            reservation[0]['duration'], '%H:%M').time()
        reservation_end_time = parsed_reservation_start_time + \
            timedelta(hours=parsed_reservation_duration.hour,
                      minutes=parsed_reservation_duration.minute)
        if reservation_end_time >= end_time:
            raise ReservationError(
                "Резервирование уже началось, вы можете только продлить его или завершить досрочно")

    check_intersections(stand_id, parsed_start_time, end_time, reservation_id)
    change_reservation_db(reservation_id, stand_id, start_time, duration)

    start_job_id = reservation[0]['start_job']
    end_job_id = reservation[0]['end_job']
    try:
        scheduler.remove_job(start_job_id)
    except:
        print("start job not found")

    try:
        scheduler.remove_job(end_job_id)
    except:
        print("end job not found")

    if reservation[0]['status'] != 'active':
        start_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                      run_date=parsed_start_time, args=[reservation_id, 'active'], misfire_grace_time=30)
        change_reservation_job_db(
            id=reservation_id, job_type='start_job', job_id=start_job.id)

    end_job = scheduler.add_job(func=change_reservation_status, trigger='date',
                                run_date=end_time, args=[reservation_id, 'completed'], misfire_grace_time=30)
    change_reservation_job_db(
        id=reservation_id, job_type='end_job', job_id=end_job.id)


def delete_reservation(id: int):
    reservation = get_reservation_db(id)
    start_job_id = reservation[0]['start_job']
    end_job_id = reservation[0]['end_job']
    if reservation[0]['status'] == 'active' or not start_job_id:
        # проверить на реальных джобах, скорректировать обработку ошибок для прода
        try:
            scheduler.remove_job(end_job_id)
        except:
            print("job not found")
    else:
        try:
            scheduler.remove_job(start_job_id)
            scheduler.remove_job(end_job_id)
        except:
            print("jobs not found")
    delete_reservation_db(id)


# print(scheduler.get_jobs())
# time.sleep(70)
# time.sleep(700)
# scheduler.shutdown()
