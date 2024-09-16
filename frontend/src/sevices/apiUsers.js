export async function apiGetUsers() {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'GET',
    })
    return response
}

export async function apiAddUser(login, role, authType) {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add',
                    login: login,
                    role: role, 
                    auth_type: authType
                })
    })
    return response
}

export async function apiChangeUser(id, selectedRole) {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'change',
            id: id,
            role: selectedRole

        })
    })
    return response
}

export async function apiDeleteUser(id) {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'delete',
            id: id
        })
    })
    return response
}