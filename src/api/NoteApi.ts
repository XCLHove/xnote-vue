import request from "../utils/request.ts";
import {Note} from "../interfaces/entity/Note.ts";
import {NotePageDTO} from "../interfaces/entity/dto/NotePageDTO.ts";

/**
 * 获取一篇笔记
 * @param noteId 笔记id
 * @param callback 回调函数
 */
export async function getONoteById(noteId: number, callback: Function) {
    await request.get(`/notes/${noteId}`).then((result) => {
        callback(result)
    })
}

/**
 * 更新笔记
 * @param note 笔记信息
 * @param callback 回调函数
 */
export async function updateNote(note: Note, callback: Function) {
    await request.post('/notes', note).then((result) => {
        callback(result)
    })
}

/**
 * 添加笔记
 * @param note 笔记信息
 * @param callback 回调函数
 */
export async function addNote(note: Note, callback: Function) {
    await request.put('/notes', note).then((result) => {
        callback(result)
    })
}

/**
 * 删除笔记
 * @param noteId 笔记id
 * @param callback 回调函数
 */
export async function deleteNoteById(noteId: number, callback: Function) {
    await request.delete(`/notes/${noteId}`).then((result) => {
        callback(result)
    })
}

/**
 * 分页获取所有笔记
 * @param notePageDTO 分页数据
 * @param callback 回调函数
 */
export async function pageNote(notePageDTO: NotePageDTO, callback: Function) {
    await request.post('/notes/page', notePageDTO).then(result => {
        if (callback) callback(result)
    })
}
