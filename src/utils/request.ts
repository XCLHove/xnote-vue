import axios from "axios";
import { elPrompt } from "./elPrompt.ts";
import getLocalStorage from "./getLocalStorage.ts";
import ResultStatus from "../enums/ResultStatus.ts";
import LocalStorageKey from "../enums/LocalStorageKey.ts";
import RequestHeaderKey from "../enums/RequestHeaderKey.ts";
import { Config, getConfig } from "./config.ts";
import serviceExceptionHandler from "@/utils/serviceExceptionHandler.ts";
import { Result } from "@/interfaces/Result.ts";

//读取外部配置文件中的后端地址
let baseURL = "http://localhsot:8080";
await getConfig((config: Config) => {
    baseURL = config.serverUrl ? config.serverUrl : baseURL;
});

const request = axios.create({
    baseURL: baseURL, // 这里加上后端接口前缀，后端必须进行跨域配置
    timeout: 10000, // ms
});

// request 拦截器，可以自请求发送前对请求做一些处理
request.interceptors.request.use(
    (config) => {
        //设置Content-Type
        config.headers["Content-Type"] ||= "application/json;charset=utf-8";
        // 设置请求头
        const token = getLocalStorage(LocalStorageKey.TOKEN);
        config.headers[RequestHeaderKey.TOKEN] = token;

        return config;
    },
    (error: Error) => {
        elPrompt.error(`请求出错：${error.message}`);
        return Promise.reject(error);
    },
);

// response 拦截器，可以在接口响应后统一处理结果
request.interceptors.response.use(
    (response) => {
        // 如果返回的是文件
        if (response.config.responseType === "blob") {
            return response;
        }

        //response.data是服务端返回的数据
        const responseData = response.data;
        if (!responseData) {
            return response;
        }

        // 兼容服务端返回的字符串数据
        let result = responseData as Result<any>;
        if (typeof responseData === "string") {
            result = JSON.parse(responseData);
            response.data = result;
        }

        // 判断业务状态
        if (result.status >= ResultStatus.EXCEPTION) {
            serviceExceptionHandler(result);
            return Promise.reject(result);
        }

        return response;
    },
    (error: Error) => {
        elPrompt.error(`请求失败，请检查控制台报错！`, 2);
        return Promise.reject(error);
    },
);

export default request;
