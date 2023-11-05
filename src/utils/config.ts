import axios from 'axios';

// 异步函数，用于获取配置数据
export default async function getConfig(callback: Function) {
    try {
        const response = await axios.get('/config.json');
        callback(response.data)
    } catch (error) {
        console.error('Error fetching config:', error);
    }
}