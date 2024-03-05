from sys import platform
import os
from dotenv import load_dotenv


def get_env_var(var_name: str):
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)
    return os.environ[var_name]
