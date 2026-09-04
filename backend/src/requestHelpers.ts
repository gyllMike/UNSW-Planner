const SERVER_URL = 'http://localhost:3000';
const TIMEOUT_MS = 5 * 1000;

/**
 * Send POST '/v1/admin/auth/register' request
 * 
 * @param email        
 * @param password     
 * @param nameFirst    
 * @param nameLast     
 * @param programName  
 * @param age        
 *   
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string, programName: string, age: number) {
    const res = await fetch(SERVER_URL + '/v1/admin/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            nameFirst,
            nameLast,
            programName,
            age,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}


/**
 * Send POST '/v1/admin/auth/login' request
 *
 * @param email
 * @param password
 * @returns The HTTP status code and leith response body
 */
export async function requestAdminAuthLogin(email: string, password: string) {
    const res = await fetch(SERVER_URL + '/v1/admin/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return {
        statusCode: res.status,
        body: await res.json(),
    };
}

