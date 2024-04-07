from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

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


def task_to_run(job_num):
    # Здесь ваш код для работы с базой данных
    with open('data.txt', 'a') as f:
        f.write(f'running {job_num} \n')
        f.write(str(datetime.now()) + '\n')
        time.sleep(10)
    print(f'job run{job_num}')


current_time += timedelta(minutes=1)
print(current_time)
scheduler.add_job(task_to_run, 'date',
                  run_date=current_time, args=['job 1'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date',
                  run_date=current_time, args=['job 2'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date',
                  run_date=current_time, args=['job 3'], misfire_grace_time=300)
job = scheduler.add_job(task_to_run, 'date',
                        run_date=current_time, args=['job 4'], misfire_grace_time=300)
scheduler.add_job(task_to_run, 'date', args=[
    'job 5'], misfire_grace_time=300)

print('id --------------------------- ', job.id)

print('1-----------')
print(scheduler.get_jobs())
print('2-----------')

time.sleep(70)
scheduler.shutdown()
