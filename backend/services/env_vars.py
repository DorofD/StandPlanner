import os
from dotenv import load_dotenv


def get_env_var(var_name: str):
    print(os.path.dirname(__file__))
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)
    print(os.environ)
    return os.environ[var_name]
