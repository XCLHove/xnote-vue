import axios from "axios";

// 异步函数，用于获取配置数据
export async function getConfig(callback: (config: Config) => void) {
    try {
        const response = await axios.get("/config.json");
        callback(response.data);
    } catch (error) {
        console.error("Error fetching config:", error);
    }
}

export interface Config {
    //后端服务器地址
    serverUrl: string;
    //备案号
    icp: string;
}
