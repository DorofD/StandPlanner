import { authFetch } from './authFetch';

export async function apiGetRbotCheck() {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}
export async function apiGetRbotStatus() {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket?action=get_bot_status`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}
export async function apiGetRocketRooms() {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket?action=get_rocket_rooms`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}
export async function apiGetLocalRocketRooms() {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket?action=get_local_rocket_rooms`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}

export async function apiUpdateLocalRocketRooms(rooms) {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'update',
            rooms: rooms
        })
    })
    return response
}

export async function apiLinkRoomsData() {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'link_data'
        })
    })
    return response
}

export async function apiDeleteLocalRoom(id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/rocket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id
        })
    })
    return response
}

// export async function apiChangeUser(id, chanesDict) {
//     const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             action: 'change',
//             fields_to_update: chanesDict,
//             id: id
//         })
//     })
//     return response
// }

// export async function apiDeleteUser(id) {
//     const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             action: 'delete',
//             id: id
//         })
//     })
//     return response
// }