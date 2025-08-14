import { authFetch } from './authFetch';

export async function apiGetStands() {
    const response = await authFetch(`${process.env.BACKEND_URL}/stands?action=get_list`, {
        method: 'GET',
    })
    const stands = await response.json()
    return stands
}

export async function apiGetStand(id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/stands?action=get_stand&stand_id=${id}`, {
        method: 'GET',
    })
    const stand = await response.json()
    return stand
}

export async function apiAddStand(name, description) {
    const response = await authFetch(`${process.env.BACKEND_URL}/stands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'add',
            name: name,
            description: description
        })
    })
    return response
}

export async function apiChangeStand(id, fields_to_update) {
    const response = await authFetch(`${process.env.BACKEND_URL}/stands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            id: id,
            fields_to_update: fields_to_update
        })
    })
    return response
}

export async function apiDeleteStand(id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/stands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id

        })
    })
    return response
}