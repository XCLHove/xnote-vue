import axios from "axios";

// 异步函数，用于获取配置数据
export function getConfig() {
    return new Promise<Config>((resolve, reject) => {
        axios
            .get("/config.json")
            .then(({ data }) => {
                resolve(data);
            })
            .catch((error) => {
                console.error("Error fetching config:", error);
                reject(error);
            });
    });
}

export interface Config {
    //后端服务器地址
    serverUrl: string;
    //备案号
    icp: string;
}
