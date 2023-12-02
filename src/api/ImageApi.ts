import request from "../utils/request.ts";

/**
 * 上传图片
 * @param uploadImage 图片file对象
 * @param callback 回调函数
 */
export async function uploadImage(uploadImage: File, callback: Function) {
    const formData = new FormData();
    formData.append('uploadImage', uploadImage)
    await request.post(
        '/image/upload',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    ).then((result) => {
        callback(result)
    })
}