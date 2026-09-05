import { adminAuthLogin, adminAuthRegister, adminStudentUserDetails } from "../src/auth.js";
import { setData } from '../src/dataStore.js';
import {
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { requestAdminAuthLogin, requestAdminAuthRegister, requestAdminStudentUserDetails } from "../src/requestHelpers.js";
import { findStudentIdFromSession } from "../src/helper.js";

beforeEach(() => {
  setData({
    studentArray: [],
    StudentAuthArray: [],
    controlUserSessionsArray: [],
  });
});


// Test function adminAuthRegister
describe('adminAuthRegister tests', () => {

    test('register successfully', async () => {
        const registerReturn = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        expect(registerReturn).toEqual({
            controlUserSessionId: expect.any(String)
        });
    });

    test('register unsuccessfully: invalid email', async () => {
        await expect(
            adminAuthRegister(
            'invalid-email',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: duplicate email', async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'def456~!@',
            'Peter',
            'Smith',
            'Engineering',
            21
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid password', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            '123',
            'Alan',
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid name first', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'a'.repeat(1000),
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid name last', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'a'.repeat(1000),
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid program name', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'a'.repeat(1000),
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid program age', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            -1
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

});

describe('POST /v1/admin/auth/register - HTTP layer via requestHelper', () => {

    test('returns 200 for valid registration', async () => {
          const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('controlUserSessionId');
        expect(typeof response.body.controlUserSessionId).toBe('string');
    });
    

    test('returns 400 for invalid registration: email case', async () => {
        const response = await requestAdminAuthRegister(
            'invalid-email',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: duplicate email case', async () => {
        await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'def456~!@',
            'Peter',
            'Smith',
            'Engineering',
            21
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: password case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'a'.repeat(100),
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: nameFirst case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'a'.repeat(100),
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: nameLast case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'G'.repeat(100),
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid registration: programName case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'C'.repeat(100),
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid registration: age case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            -1
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });



})

// Test function adminAuthLogin
describe('adminAuthLogin tests', () => {

    beforeEach(async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
    });

    test('Login successfully', async () => {

        const LoginReturn = await adminAuthLogin(
            'z5678705@unsw.edu.au',
            'abc123~!@'
        );

        expect(LoginReturn).toEqual({
            controlUserSessionId: expect.any(String)
        });

    });

    test('Login unsuccessfully: email case', async () => {
        await expect(
            adminAuthLogin(
                'z5555555@unsw.edu.au',
                'abc123~!@'
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });


    test('Login unseccessfully: password case', async () => {
        await expect(
            adminAuthLogin(
                'z5678705@unsw.edu.au',
                '123'
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

});

describe('POST /v1/admin/auth/login - HTTP layer via requestHelper', () => {

    beforeEach(async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
    });

    test('returns 200 for valid login', async () => {
        const response = await requestAdminAuthLogin(
            'z5678705@unsw.edu.au',
            'abc123~!@'
        );
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('controlUserSessionId');
        expect(typeof response.body.controlUserSessionId).toBe('string');
    });

    test('returns 400 for invalid login: email case', async () => {
        const response = await requestAdminAuthLogin(
            'invalid-email',
            'abc123~!@'
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid login: password case', async () => {
        const response = await requestAdminAuthLogin(
            'z5678705@unsw.edu.au',
            'wrongPassword123'
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});

// Test function adminStudentUserDetails
describe('adminStudentUserDetails tests', () => {

    let studentId: number;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        studentId = findStudentIdFromSession(register.controlUserSessionId);
    });

    test('Correct Student Details', () => {

        const student = adminStudentUserDetails(studentId);

        expect(student).toEqual({
        user: {
            studentId,
            name: 'Alan Guo',
            age: 20,
            email: 'z5678705@unsw.edu.au',
            programName: 'Computer Science',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
        },
        });
    });

    test('throws for invalid studentId', () => {
        expect(() => adminStudentUserDetails(-1)).toThrow('Invalid studentId');
    });

});

describe('GET /v1/admin/studentuser/details - HTTP layer via requestHelper', () => {

    let controlUserSessionId: string;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        controlUserSessionId = register.controlUserSessionId;
    });

    test('returns 200 for valid details', async () => {
        const response = await requestAdminStudentUserDetails(controlUserSessionId);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        user: {
            studentId: expect.any(Number),
            name: 'Alan Guo',
            age: 20,
            email: 'z5678705@unsw.edu.au',
            programName: 'Computer Science',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
        },
        });
    });

    test('returns 401 for invalid controlUserSessionId', async () => {
        const response = await requestAdminStudentUserDetails('-1');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});