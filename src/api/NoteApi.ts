import request from "../utils/request.ts";
import {Note} from "../interfaces/entity/Note.ts";
import {getUserSelf} from "./UserApi.ts";
import {Result} from "../interfaces/Result.ts";
import {User} from "../interfaces/entity/User.ts";

/**
 * 获取一篇笔记
 * @param noteId 笔记id
 * @param callback 回调函数
 */
export async function getOneNote(noteId: number, callback: Function) {
    await request.get(`/notes/${noteId}`).then((result) => {
        callback(result)
    })
}

/**
 * 更新笔记
 * @param note 笔记信息
 * @param callback 回调函数
 */
export async function updateNote(note: Note, callback?: Function) {
    await request.post('/notes', note).then((result) => {
        if (callback) callback(result)
    })
}

/**
 * 添加笔记
 * @param note 笔记信息
 * @param callback 回调函数
 */
export async function addNote(note: Note, callback?: Function) {
    await request.put('/notes', note).then((result) => {
        if (callback) callback(result)
    })
}

/**
 * 删除笔记
 * @param noteId 笔记id
 * @param callback 回调函数
 */
export async function deleteNote(noteId: number, callback?: Function) {
    await request.delete(`/notes/${noteId}`).then((result) => {
        if (callback) callback(result)
    })
}

/**
 * 获取某个用户的笔记
 * @param callback 回调函数
 */
export async function getUserNotes(callback: Function) {
    await getUserSelf(async (result: Result<User>) => {
        const user = result.data
        if (!user) return
        await request.get(`/notes/user/${user.id}`).then(result => {
            if (callback) callback(result)
        })
    })
}

/**
 * 获取自己的笔记
 * @param callback
 */
export async function getSelfNotes(callback: Function) {
    await request.get('/notes/user/self').then(result => {
        if (callback) callback(result)
    })
}

