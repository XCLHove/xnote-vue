let locked = false;

/**
 * 异步锁
 * @param fun 要加锁的操作
 * @param lockedFun 上锁时要执行的操作
 * @param timeoutFun 超时后要执行的操作
 * @param timeoutSecond 超时时间(秒)，超时后自动关闭锁
 */
const lock = (
    fun: Function,
    lockedFun?: Function,
    timeoutFun?: Function,
    timeoutSecond = 10,
) => {
    return async () => {
        // 判断是否加锁
        if (locked && lockedFun) {
            lockedFun();
            return;
        }

        // 加锁
        locked = true;

        // 超时后自动取消锁
        const timerId = setTimeout(() => {
            if (locked) locked = false;
            if (timeoutFun) timeoutFun();
            clearTimeout(timerId);
        }, timeoutSecond * 1000);

        // 执行操作
        await fun();

        clearTimeout(timerId);

        // 关闭锁
        locked = false;
    };
};

export default lock;
