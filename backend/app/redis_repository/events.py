
import json
from datetime import datetime, timezone
from app.redis_repository import RedisBase


class RedisEvents(RedisBase):
    def __init__(self, max_events=200):
        super().__init__()
        self.key = 'events'
        self.max_events = max_events

    def add_event(self, action_type, action_name, action_details):
        event = {
            'datetime': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            'action_type': action_type,
            'action_name': action_name,
            'action_details': action_details
        }
        self.r.lpush(self.key, json.dumps(event))
        self.r.ltrim(self.key, 0, self.max_events - 1)

    def get_events(self, count=20, offset=0):
        total = self.r.llen(self.key)
        if offset >= total:
            return []
        # вычисляем end, чтобы не выйти за пределы списка
        count = min(count, total - offset)
        start = offset
        end = offset + count - 1
        events = self.r.lrange(self.key, start, end)
        return [json.loads(e) for e in events]

    def clear_events(self):
        self.r.delete(self.key)
