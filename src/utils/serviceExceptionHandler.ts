import ResultStatus from "@/enums/ResultStatus.ts";
import LocalStorageKey from "@/enums/LocalStorageKey.ts";
import { Result } from "@/interfaces/Result.ts";
import { elPrompt } from "@/utils/elPrompt.ts";
import { useShowUserLogin } from "@/stores/useShowUserLoginAndRegister.ts";

const handler: {
    [key: number]: (result: Result<any>) => void;
} = {
    // 处理用户令牌异常
    [ResultStatus.USER_TOKEN_EXCEPTION]: () => {
        localStorage.removeItem(LocalStorageKey.TOKEN);
        // 显示用户登录页面
        useShowUserLogin().show();
    },
};

const serviceExceptionHandler = (result: Result<any>) => {
    elPrompt.error(result.message);
    handler[result.status]?.(result);
};

export default serviceExceptionHandler;
