import axios from "axios";
import {elPrompt} from "./elPrompt.ts";
import getLocalStorage from "./getLocalStorage.ts";
import getConfig from "./config.ts";
import {Config} from "../interfaces/Config.ts";
import ResultType from "../enums/ResultType.ts";

//读取外部配置文件中的后端地址
let baseURL = 'http://localhsot:8080'
await getConfig((config: Config) => {
    baseURL = config.serverUrl ? config.serverUrl : baseURL
})
const request = axios.create({
    baseURL: baseURL,  // 这里加上后端接口前缀，后端必须进行跨域配置
    timeout: 10000 // ms
})

// request 拦截器，可以自请求发送前对请求做一些处理
request.interceptors.request.use(config => {
        const contentType = config.headers['Content-Type']
        if (!contentType) config.headers['Content-Type'] = 'application/json;charset=utf-8';
        // 设置请求头
        const token = getLocalStorage('token')
        if (token) config.headers['token'] = token
        return config;
    },
    (error: Error) => {
        elPrompt(`请求出错：${error.message}`, "error")
        return Promise.reject(error);
    }
);

// response 拦截器，可以在接口响应后统一处理结果
request.interceptors.response.use((response) => {
        let result = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') return result;
        // 兼容服务端返回的字符串数据
        if (typeof result === 'string' && result) result = JSON.parse(result)
        if (result.status !== ResultType.SUCCESS) {
            elPrompt(result.message, "error")
            return Promise.reject(result.message)
        }
        return result;
    },
    (error: Error) => {
        elPrompt(`请求失败：${error.message}`, "error")
        return Promise.reject(error);
    }
)
export default request

