import { authFetch } from './authFetch';

export async function apiGetSources(source_type) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources?source_type=${source_type}`, {
        method: 'GET',
    })
    const sources = await response.json()
    return sources
}

export async function apiAddSource(source_note) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'add',
            source_note: source_note
        })
    })
    return response
}

// export async function apiChangeUser(id, login, role, auth_type, password) {
//     const response = await authFetch(`${process.env.BACKEND_URL}/users`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             action: 'change',
//             id: id,
//             login: login,
//             role: role,
//             auth_type: auth_type,
//             password: password
//         })
//     })
//     return response
// }

export async function apiDeleteSource(source_type, id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id,
            source_type: source_type
        })
    })
    return response
}