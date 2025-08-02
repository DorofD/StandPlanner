import { authFetch } from './authFetch';

export async function apiGetSchedulerInfo() {
    const response = await authFetch(`${process.env.BACKEND_URL}/scheduler`, {
        method: 'GET',
    })
    const result = await response.json()
    return result
}
