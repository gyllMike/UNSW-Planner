const SERVER_URL = 'http://localhost:3000';
const TIMEOUT_MS = 5 * 1000;

export interface RegisterRequest {
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  programName: string;
  age: number;
}

export async function requestAdminAuthRegister(
  input: RegisterRequest
) {
  const response = await fetch(
    `${SERVER_URL}/v1/admin/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(input),

      signal: AbortSignal.timeout(TIMEOUT_MS),
    }
  );

  return {
    statusCode: response.status,
    body: await response.json(),
  };
}