from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from repository.queries.reservations import add_reservation_db
from errors.intersection_error import IntersectionError

import time

from datetime import datetime, timedelta
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
    try:
        pass
    except IntersectionError as error:
        raise error


# статусы: planned, active, completed
def change_reservation_status(id: int, status: str):
    pass


def create_reservaiton(user_id: int, stand_id: int, start_time: str, duration: str):
    # проверка на пересечение времени с другими резервированиями
    # создание резервирования, получение его id
    last_row_id = add_reservation_db(
        user_id=user_id, stand_id=stand_id, start_time=start_time, duration=duration, status='planned')['last_row_id']
    print(last_row_id)
    # создание start_job и end_job c передачей им id созданного резервирования и получения их id
    # запись полученных id задач в резервирование
    pass


create_reservaiton(1, 1, '10:00', '2h')


def task_to_run(job_num):
    with open('data.txt', 'a') as f:
        f.write(f'running {job_num} \n')
        f.write(str(datetime.now()) + '\n')
        time.sleep(10)
    print(f'job run{job_num}')


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
