from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

import time
import datetime
# time.sleep(3)  # Сон в 3 секунды
current_time = datetime.datetime.now()
print(current_time)


def run_scheduler():
    executors = {'default': ThreadPoolExecutor(1)}
    scheduler = BackgroundScheduler(executors=executors)
    scheduler.start()
    return scheduler


scheduler = run_scheduler()


def task_to_run(job_num):
    # Здесь ваш код для работы с базой данных
    with open('data.txt', 'a') as f:
        f.write(f'running {job_num} \n')
        f.write(str(datetime.datetime.now()) + '\n')
        time.sleep(10)
    print(f'job run{job_num}')


bibos = '19:46:00'
scheduler.add_job(task_to_run, 'date',
                  run_date=f'2024-04-06 {bibos}', args=['job 1'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date',
                  run_date=f'2024-04-06 {bibos}', args=['job 2'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date',
                  run_date=f'2024-04-06 {bibos}', args=['job 3'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date',
                  run_date=f'2024-04-06 {bibos}', args=['job 4'], misfire_grace_time=300)

print('1-----------')
print(scheduler.get_jobs())
print('2-----------')

time.sleep(70)
scheduler.shutdown()
