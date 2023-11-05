<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import Note from "../interfaces/Note.ts";
import {deleteNote, getSelfNotes} from "../api/NoteApi.ts";
import Result from "../interfaces/Result.ts";
import router from "../router/router.ts";
import {elPrompt} from "../utils/elPrompt.ts";

const notes: Ref<Note[]> = ref([])

/**
 * 获取笔记
 */
function getNotes () {
  getSelfNotes((result: Result<Note[]>) => {
    notes.value = result.data
  })
}

/**
 * 查看笔记
 * @param noteId 笔记id
 */
function viewNote(noteId: number) {
  window.open(`/view/${noteId}`, '_blank')
}

/**
 * 编辑笔记
 * @param noteId 笔记id
 */
function editNote(noteId: number) {
  router.push(`/edit/${noteId}`)
}

/**
 * 删除笔记
 * @param noteId 笔记id
 */
function removeNote(noteId: number) {
  deleteNote(noteId, (result: Result<number>) => {
    if (result.data !== noteId) return
    elPrompt('删除成功！', 'success')
    getNotes()
  })
}

onMounted(() => {getNotes()})
</script>

<template>
  <div class="user-notes">
    <el-table :data="notes" style="width: 100%">
      <el-table-column fixed prop="title" label="标题"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button link type="primary" @click="viewNote(scope.row.id)">查看</el-button>
          <el-button link type="success" @click="editNote(scope.row.id)">修改</el-button>
          <el-button link type="danger" @click="removeNote(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="less">

</style>