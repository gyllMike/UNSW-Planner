import { adminAuthRegister } from "../src/auth.js";
import { setData } from '../src/dataStore.js';
import {
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { requestAdminAuthRegister } from "../src/requestHelpers.js";
import { response } from "express";
import { controlUserSessionIdGen } from "../src/helper.js";


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

    test('invalid email', async () => {
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


    test('invalid name first', async () => {
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


    test('invalid name last', async () => {
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


    test('invalid program name', async () => {
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


    test('invalid program age', async () => {
    await expect(
        adminAuthRegister(
        'z5678705@unsw.edu.au',
        'abc123~!@',
        'Alan',
        'Guo',
        'a'.repeat(1000),
        -1
        )
    ).rejects.toMatchObject({
        status: 400,
    });
    });

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
     
});
