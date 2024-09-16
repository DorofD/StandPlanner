export async function apiGetReservations() {
    const response = await fetch(`${process.env.BACKEND_URL}/reservations`, {
        method: 'GET',
    })
    const reservations = await response.json()
    return reservations
}

export async function apiAddReservation(userId, standId, date, startTime, duration) {
    if (startTime !== 'startNow'){
        startTime = date + ' ' + startTime
    }
    const response = await fetch(`${process.env.BACKEND_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'add',
            user_id: userId,
            stand_id: standId,
            start_time: startTime,
            duration: duration
        })})
    return response
}

export async function apiChangeReservation(reservationId, standId, date, startTime, duration) {
    const response = await fetch(`${process.env.BACKEND_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            reservation_id: reservationId,
            stand_id: standId,
            start_time: date + ' ' + startTime,
            duration: duration
        })})
    return response
}

export async function apiDeleteReservation(reservationId) {
    const response = await fetch(`${process.env.BACKEND_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            reservation_id: reservationId
        })})
    return response
}