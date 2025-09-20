from rocket_bot.external_interfaces.rocket_http_api import RocketChatAPI
from rocket_bot.external_interfaces.rocket_ws_client import RocketChatWSClient
from rocket_bot.external_interfaces.redis_api import RedisExecutor


class RocketBot:
    def __init__(self):
        self.rocket_api = RocketChatAPI()
        self.rocket_ws = RocketChatWSClient()
        self.redis_exec = RedisExecutor()
        self.target_rooms = []

    def gather_data(self):
        all_rooms = self.rocket_api.get_all_reachable_rooms()
        redis_stands = self.redis_exec.get_all_stands()
