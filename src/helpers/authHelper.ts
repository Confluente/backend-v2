import q, {Promise} from "q";
import {pbkdf2, pbkdf2Sync, randomBytes} from "crypto";
import {User} from "../models/database/user.model";
import {Session} from "../models/database/session.model";

const digest_iterations = (process.env.NODE_ENV === "test") ? 1 : 100000;

/**
 * Asynchronous function returning Hash of password based on password and salt.
 * @param password             Password to be checked.
 * @param salt                 Salt to be used in check.
 * @return Hash, or rejects
 */
export function getPasswordHash(password: string, salt: string): any {
    return Promise(function(resolve: any, reject: any): any {
        pbkdf2(password, salt, digest_iterations, 256 / 8, 'sha256',
            function(err: Error | null, hash: Buffer): any {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
}


/**
 * Generates random string of characters i.e salt.
 * @param length                Length of the random string.
 * @return Salt characters
 */
export function generateSalt(length: number): string {
    return randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
}

/**
 * Synchronous function returning Hash of password based on password and salt
 * @param password              Password for which Hash is to be found
 * @param salt                  Salt for which Hash is to be found
 * @return Hash
 */
export function getPasswordHashSync(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, digest_iterations, 256 / 8, 'sha256').toString();
}


/**
 * Function for verifying user identity based on email and password.
 * @param email                 Email of user.
 * @param password              Password of user.
 * @return user object if valid, otherwise null
 */
export function authenticate(email: string, password: string): any {
    email = email.toLowerCase();
    return User.findOne({where: {email}}).then(function(user: User): any {
        if (!user) {
            return {error: 406, data: "Email address not associated to any account"};
        }
        return getPasswordHash(password, user.passwordSalt)
            .then(function(hash: string): any {
                return (hash === user.passwordHash) ? user : {error: 406, data: "Password incorrect"};
            });
    });
}


/**
 * Function for generating session with logged in user on given IP, with a random token and set lifetime
 * @param userId                ID of the user.
 * @param ip                    IP address associated to user session.
 * @return session
 */
export function startSession(userId: number, ip: string): any {
    const session_lifetime = 7; // in days
    return q.nfbind(randomBytes)(32).then(function(bytes: any): any {
        console.log("new session made");
        return Session.create({
            user: userId,
            ip,
            token: bytes,
            expires: (new Date()).setDate(new Date().getDate() + session_lifetime)
        });
    });
}
