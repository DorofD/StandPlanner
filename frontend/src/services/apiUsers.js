import { authFetch } from './authFetch';

export async function apiGetUsers() {
    const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
        method: 'GET',
    })
    return response
}

export async function apiAddUser(login, role, authType, password) {
    const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'add',
            login: login,
            role: role,
            auth_type: authType,
            password: password
        })
    })
    return response
}

export async function apiChangeUser(id, chanesDict) {
    const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            fields_to_update: chanesDict,
            id: id
        })
    })
    return response
}

export async function apiDeleteUser(id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id
        })
    })
    return response
}