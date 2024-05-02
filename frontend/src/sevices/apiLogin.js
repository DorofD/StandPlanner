export async function apiAuth(username, password) {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            login: username,
            password: password
        })
    })
    return response
}