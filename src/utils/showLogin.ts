import { sendMessage } from "./crossTagMessage.ts";
import CrossTagMessageKey from "../enums/CrossTagMessageKey.ts";

/**
 * 显示用户登录界面
 */
export const showUserLogin = () => {
    sendMessage(CrossTagMessageKey.SHOW_USER_LOGIN, true);
};

/**
 * 显示用户注册界面
 */
export const showUserRegister = () => {
    sendMessage(CrossTagMessageKey.SHOW_USER_Register, true);
};
