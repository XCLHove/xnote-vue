import request from "../utils/request.ts";
import { Result } from "@/interfaces/Result.ts";
import { Image } from "@/interfaces/entity/Image.ts";

/**
 * 上传图片
 * @param imageFile 图片file对象
 */
export function uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append("uploadImage", imageFile);
    return new Promise<Result<Image>>((resolve, reject) => {
        request
            .put("/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
