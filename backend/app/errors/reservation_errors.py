class IntersectionError(Exception):
    def __init__(self, username, start_time):
        super().__init__(username, start_time)
        self.message = f"Заданное время пересекается с резервированием пользователя {username}, запланированным на {start_time}"

    def __str__(self):
        return self.message


class ReservationError(Exception):
    def __init__(self, error_message):
        super().__init__(error_message)
        self.message = error_message

    def __str__(self):
        return self.message
