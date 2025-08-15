import { authFetch } from './authFetch';

export async function apiGetSources(source_type) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources?source_type=${source_type}`, {
        method: 'GET',
    })
    const sources = await response.json()
    return sources
}

export async function apiAddSource(source_note) {
    console.log(source_note)
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
export async function apiChangeSource(source_type, source_note) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            source_type: source_type,
            source_note: source_note
        })
    })
    return response
}

export async function apiActualizeSource(source_type, source_id) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: "process_one",
            source_type: source_type,
            source_id: source_id
        })
    })
    return response
}

export async function apiActualizeAllSources(source_type) {
    const response = await authFetch(`${process.env.BACKEND_URL}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: "process_all",
            source_type: source_type,
        })
    })
    return response
}

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