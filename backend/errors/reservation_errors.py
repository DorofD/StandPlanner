class IntersectionError(Exception):
    def __init__(self, username, start_time):
        super().__init__(username, start_time)
        self.message = f"Заданное время пересекается с резервированием пользователя {username}, запланированным на {start_time}"

    def __str__(self):
        return self.message


class DeleteError(Exception):
    def __init__(self):
        super().__init__()
        self.message = f"Вы не можете удалить активное резервирование"

    def __str__(self):
        return self.message
