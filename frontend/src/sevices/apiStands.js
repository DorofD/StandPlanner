export async function apiGetStands() {
    const response = await fetch('http://127.0.0.1:5000', {
        method: 'GET',
    })
    const stands = await response.json()
    return stands
}

export async function apiAddStand(name, description) {
    const response = await fetch('http://127.0.0.1:5000/stands', {
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

export async function apiChangeStand(id, name, description) {
    const response = await fetch('http://127.0.0.1:5000/stands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            id: id,
            name: name,
            description: description
        })
    })
    return response
}

export async function apiDeleteStand(id) {
    const response = await fetch('http://127.0.0.1:5000/stands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id

        })
    })
    return response
}