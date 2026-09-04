import { getData, setData } from './dataStore.js';
import type { Session, DataStore } from './dataStore.js';
import {
        studentIdGen,
        controlUserSessionIdGen,
        nameValidity,
        eamilValidity,
        passwordValidity,
        programNameValidity,
        ageValidity
} from './helper.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

/**
  * Registers a new mission control user and creates an authenticated user session.
  *
  * @param email - The email address that the controlUser uses to register
  * @param password - The password that the controlUser sets to register and later logins
  * @param nameFirst - The first name of the controlUser
  * @param nameLast - The last name of the controlUser
  *
  * @returns An object containing the generated controlUserSessionId if the controlUser is successfully registered.
  * @throws {HTTPError} 400 - Error case: if the email, name or password is invalid.
*/
export async function adminAuthRegister(
        email: string, 
        password: string, 
        nameFirst: string, 
        nameLast: string, 
        programName: string, 
        age: number): Promise<{ controlUserSessionId: string }> {
    
    // email Validity
    if (eamilValidity(email) !== null) {
        throw createHttpError(400, 'Invalid email');
    }

    // name Validity
    if (nameValidity(nameFirst, nameLast) !== true) {
        throw createHttpError(400, 'Name Invalid');
    }

    // Password Validity
    if (passwordValidity(password) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    // programName Validity
    if (programNameValidity(programName) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    // age Validity
    if (ageValidity(age) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    // get some data
    const data: DataStore = getData();
    const studentId: number = studentIdGen();
    const studentSessionId: string = controlUserSessionIdGen();
    const hashedPassword = await bcrypt.hash(password, 10);

    // push the information of the control user into controlUserArray of data
    data.StudentAuthArray.push({
        studentAuth: {
            studentId: studentId,
            nameFirst: nameFirst,
            nameLast: nameLast,
            email: email,
            oldPasswordHashes: [],
            passwordHash: hashedPassword,
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0
        }
    });

    data.controlUserSessionsArray.push({
        controlUserSession: {
            controlUserSessionId: studentSessionId,
            studentId: studentId
        }
    });

    data.studentArray.push({
        student: {
            studentId: studentId,
            age: age,
            programName: programName
        }
    });


    setData(data);

    return { controlUserSessionId: studentSessionId};
}

/**
 * Logs in an existing mission control user and creates an authenticated user session.
 *
 * @param email - The email address that the controlUser uses to log in
 * @param password - The password that the controlUser uses to log in
 * 
 * @returns An object containing the generated controlUserSessionId if the controlUser is successfully logged in.
 * @throws {HTTPError} 400 - Error case: if no user is found, the email does not exist, or the password is incorrect.
 */
export async function adminAuthLogin(email: string, password: string): Promise<{ controlUserSessionId: string }> {

    const data = getData();

    if (!data.StudentAuthArray || data.StudentAuthArray.length === 0) {
        throw createHttpError(400, 'No user found');
    }

    const userObject = data.StudentAuthArray.find(f => f.studentAuth.email === email);
    if (!userObject) {
        throw createHttpError(400, 'Incorrect email or password');
    }
    const user = userObject.studentAuth;

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);
        throw createHttpError(400, 'Incorrect email or password');
    }

    user.numSuccessfulLogins++;
    user.numFailedPasswordsSinceLastLogin = 0;
    const controlUserSessionId =
    controlUserSessionIdGen();

    const newSession: Session = {
        controlUserSessionId,
        studentId: user.studentId,
    };

    data.controlUserSessionsArray.push({
        controlUserSession: newSession,
    });

    setData(data);

    return { controlUserSessionId };
}

