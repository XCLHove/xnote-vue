import request from "../utils/request.ts";
import { UserDTO } from "../interfaces/entity/dto/UserDTO.ts";

/**
 * 用户登录
 * @param account 账号
 * @param password 密码
 * @param callback 回调函数
 */
export async function userLogin(
    account: string,
    password: string,
    callback: Function,
) {
    await request
        .get("/users/login", {
            params: {
                account: account,
                password: password,
            },
        })
        .then((result) => {
            callback(result);
        });
}

/**
 * 用户退出登录
 * @param callback
 */
export async function userLogout(callback: Function) {
    await request.post("/users/logout").then((result) => {
        callback(result);
    });
}

/**
 * 用户注册
 * @param registerForm 用户注册信息
 * @param callback 回调函数
 */
export async function userRegister(registerForm: UserDTO, callback: Function) {
    await request.put("/users/register", registerForm).then((result) => {
        if (callback) callback(result);
    });
}

/**
 * 获取用户自己的信息
 * @param callback 回调函数
 */
export async function getUserSelf(callback: Function) {
    await request.get("/users/self").then((result) => {
        if (callback) callback(result);
    });
}

/**
 * 发送验证码
 * @param email 邮箱
 * @param callback 回调函数
 * @param errorCallback 错误回调函数
 */
export async function sendVerificationCode(
    email: string,
    callback: Function,
    errorCallback?: Function,
) {
    await request
        .get("/users/verificationCode", {
            params: {
                email: email,
            },
        })
        .then((result) => {
            callback(result);
        })
        .catch((error: any) => {
            errorCallback?.(error);
        });
}
