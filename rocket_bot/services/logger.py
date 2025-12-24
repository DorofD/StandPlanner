from datetime import datetime, timedelta
import logging
import os

log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()

logger = logging.getLogger("app_logger")
logger.setLevel(getattr(logging, log_level))
formatter = logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

handler = logging.FileHandler('data/rocket_bot.log')
handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(handler)


def get_formatted_uptime(start_time: datetime, end_time: datetime):
    delta = end_time - start_time
    total_seconds = int(delta.total_seconds())
    if total_seconds < 60:
        return f"{total_seconds} sec"
    elif total_seconds < 3600:
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        return f"{minutes} min {seconds} sec"
    elif total_seconds < 86400:
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"{hours} h {minutes} min"
    else:
        days = total_seconds // 86400
        hours = (total_seconds % 86400) // 3600
        return f"{days} day(s) {hours} h"
