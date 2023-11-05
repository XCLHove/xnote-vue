<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import Note from "../interfaces/Note.ts";
import request from "../utils/request.ts";
import Result from "../interfaces/Result.ts";
import ResultStatus from "../enums/ResultStatus.ts";
import {elPrompt} from "../utils/elPrompt.ts";
import {useRoute} from "vue-router";

const notes: Ref<Note[]> = ref([])
const searchText = ref('')

/**
 * 搜索笔记
 * @param text 搜索内容
 */
function search(text: string) {
  if (!text) {
    elPrompt('搜索内容不能为空！', "warning")
    return
  }
  request.get(`/notes/search/${text}`).then((result: any) => {
    const typedResult = result as Result<Note[]>
    if (typedResult.status !== ResultStatus.SUCCESS) {
      return
    }
    notes.value = result.data
  })
}

/**
 * 预览笔记
 * @param noteId 笔记id
 */
function previewNote(noteId: number) {
  window.open(`/view/${noteId}`, '_blank')
}

onMounted(() => {
  const text = useRoute().query.text as string
  if (!text) return
  searchText.value = text
  search(searchText.value)
})
</script>

<template>
  <div class="home">
    <div class="search-part">
      <el-input v-model="searchText" placeholder="搜索" inline="true" @keyup.enter="search(searchText)"></el-input>
      <el-button type="primary" @click="search(searchText)">搜索</el-button>
    </div>
    <el-table :data="notes">
      <el-table-column prop="title" label="笔记">
        <template #default="scope">
          <div class="note-list-item" @click="previewNote(scope.row.id)">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="less" scoped>
.home {
  .search-part {
    text-align: center;
    margin: 10px 0;

    .el-button {
      margin: 0 10px;
    }

    .el-input {
      width: calc(100% - 90px);
    }

    @media screen and (max-width: 460px) {

    }
  }
}
</style>