import { adminAuthLogin, adminAuthRegister } from "../src/auth.js";
import { setData } from '../src/dataStore.js';
import {
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { requestAdminAuthRegister } from "../src/requestHelpers.js";


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
        const response = await requestAdminAuthRegister({
            email: 'z5678705@unsw.edu.au',
            password: 'abc123~!@',
            nameFirst: 'Alan',
            nameLast: 'Guo',
            programName: 'Computer Science',
            age: 20,
        });

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            controlUserSessionId: expect.any(String),
        });

    });
    

    test('returns 400 for invalid registration', async () => {
        const response = await requestAdminAuthRegister({
            email: 'invalid-email',
            password: 'abc123~!@',
            nameFirst: 'Alan',
            nameLast: 'Guo',
            programName: 'Computer Science',
            age: 20,
        });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            error: expect.any(String),
        });
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