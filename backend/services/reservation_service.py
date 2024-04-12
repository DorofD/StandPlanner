from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from repository.queries.reservations import add_reservation_db, change_reservation_status_db
from datetime import datetime, time, timedelta


import time

# time.sleep(3)  # Сон в 3 секунды
current_time = datetime.now().replace(microsecond=0)
print(current_time)


def run_scheduler():
    executors = {'default': ThreadPoolExecutor(1)}
    scheduler = BackgroundScheduler(executors=executors)
    scheduler.start()
    return scheduler


scheduler = run_scheduler()


def check_reservation_intersections(stand_id: int, start_time: str, duration: str):
    pass


def change_reservation_status(id: int, status: str):
    """
    статусы: planned, active, completed
    """
    change_reservation_status_db(id=id, status=status)
    pass


def create_reservaiton(user_id: int, stand_id: int, start_time: str, duration: str):
    """
    start_time ожидается строка в формате '%Y-%m-%d %H:%M', например '2024-04-12 17:20', 
    duration ожидается строка в формате '%H:%M', например '17:20'
    """
    # проверка на пересечение времени с другими резервированиями

    # создание резервирования, получение его id
    # last_row_id = add_reservation_db(
    #     user_id=user_id, stand_id=stand_id, start_time=start_time, duration=duration, status='planned')['last_row_id']
    # print(last_row_id)
    last_row_id = 1
    # парсинг времени
    parsed_start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M')
    print(f"Объект datetime: {parsed_start_time}")

    # Парсинг строки в объект time
    parsed_duration = datetime.strptime(duration, '%H:%M').time()

    print(parsed_duration)

    """!"""
    print(parsed_start_time - timedelta(hours=parsed_duration.hour,
          minutes=parsed_duration.minute))

    # создание start_job и end_job c передачей им id созданного резервирования и получения их id
    start_job = scheduler.add_job(change_reservation_status, 'date',
                                  run_date=parsed_start_time, args=[last_row_id, 'active'], misfire_grace_time=300)
    print(start_job.id)
    # запись полученных id задач в резервирование
    pass


create_reservaiton(1, 1, '2024-04-12 22:00', '3:20')

# date_select = datetime.strptime('2011-12-1', '%Y-%m-%d')
# delta = timedelta(days=1)
# target_date = date_select + delta
# print(target_date)

# date_select = datetime.strptime('2hhh-34mmm', '%Y-%m-%d')
# delta = timedelta(days=1)
# target_date = date_select + delta
# print(target_date)

# print(create_reservaiton(1, 2, '2 часа', '2'))

# def task_to_run(job_num):
#     with open('data.txt', 'a') as f:
#         f.write(f'running {job_num} \n')
#         f.write(str(datetime.now()) + '\n')
#         time.sleep(10)
#     print(f'job run{job_num}')

# current_time += timedelta(minutes=1)
# print(current_time)
# scheduler.add_job(task_to_run, 'date',
#                   run_date=current_time, args=['job 1'], misfire_grace_time=300)
# scheduler.add_job(task_to_run, 'date',
#                   run_date=current_time, args=['job 2'], misfire_grace_time=300)
# scheduler.add_job(task_to_run, 'date',
#                   run_date=current_time, args=['job 3'], misfire_grace_time=300)
# job = scheduler.add_job(task_to_run, 'date',
#                         run_date=current_time, args=['job 4'], misfire_grace_time=300)
# scheduler.add_job(task_to_run, 'date', args=[
#     'job 5'], misfire_grace_time=300)

# print('id --------------------------- ', job.id)

# print('1-----------')
# print(scheduler.get_jobs())
# print('2-----------')

# time.sleep(70)
scheduler.shutdown()
