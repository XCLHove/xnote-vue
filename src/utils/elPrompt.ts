import {ElMessage} from "element-plus";

export const elPrompt = (message: string,
                         type: 'info' | 'success' | 'warning' | 'error',
                         durationSecond: number = 1
) => {
    ElMessage({
        showClose: true,
        duration: durationSecond * 1000,
        message: message,
        type: type
    })
}