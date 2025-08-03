from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor


class Scheduler:
    def __init__(self):
        executors = {'default': ThreadPoolExecutor(1)}
        self.scheduler = BackgroundScheduler(executors)
        self.scheduler.start()

    def get_info(self):
        data = {}
        data['status'] = self.scheduler.running
        data['jobs'] = []
        for job in self.scheduler.get_jobs():
            data['jobs'].append({'id': job.id, 'name': job.name,
                                'next_run': str(job.next_run_time), 'trigger': str(job.trigger)})
        return data

    def add_job(self, func, trigger, run_date, args=None, misfire_grace_time=30):
        try:
            return self.scheduler.add_job(
                func=func,
                trigger=trigger,
                run_date=run_date,
                args=args,
                misfire_grace_time=misfire_grace_time
            )
        except Exception as exc:
            # raise Exception('Error when adding job: ', exc) from exc
            print('Error when adding job: ', exc)

    def remove_job(self, job_id):
        try:
            self.scheduler.remove_job(job_id)
        except Exception as exc:
            # raise Exception('Error when removing job: ', exc) from exc
            print('Error when removing job: ', exc)
