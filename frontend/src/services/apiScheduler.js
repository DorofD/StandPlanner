export async function apiGetSchedulerInfo() {
    const response = await fetch(`${process.env.BACKEND_URL}/scheduler`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}
