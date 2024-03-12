import axios, { AxiosInstance, AxiosResponse } from "axios";
import { elPrompt } from "./elPrompt.ts";
import getLocalStorage from "./getLocalStorage.ts";
import ResultStatus from "../enums/ResultStatus.ts";
import LocalStorageKey from "../enums/LocalStorageKey.ts";
import RequestHeaderKey from "../enums/RequestHeaderKey.ts";
import { getConfig } from "./config.ts";
import serviceExceptionHandler from "@/utils/serviceExceptionHandler.ts";
import { Result } from "@/interfaces/Result.ts";

interface CustomAxiosConfig {
    /**返回true则不再往后处理*/
    extraResponseHandler:
        | ((response: CustomAxiosResponse) => boolean)
        | undefined;
}

type CustomAxiosInstance = AxiosInstance & { defaults: CustomAxiosConfig };

type CustomAxiosResponse = AxiosResponse<any, any> & {
    config: CustomAxiosConfig;
};

// 外部配置
const config = await getConfig();

// 后端地址
const baseURL = config.serverUrl;

const request = axios.create({
    baseURL: baseURL, // 这里加上后端接口前缀，后端必须进行跨域配置
    timeout: 10000, // ms
}) as CustomAxiosInstance;

// request拦截器
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

// response拦截器
request.interceptors.response.use(
    // @ts-ignore
    (response: CustomAxiosResponse) => {
        if (
            !(response.headers["content-type"] as string).includes(
                "application/json",
            )
        ) {
            return response;
        }

        const extraResponseHandler = response.config.extraResponseHandler;
        if (extraResponseHandler) {
            request.defaults.extraResponseHandler = undefined;
        }
        if (extraResponseHandler?.(response)) return response;

        const result = response.data as Result<any>;

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
