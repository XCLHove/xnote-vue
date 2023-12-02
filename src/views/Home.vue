<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import {Note} from "../interfaces/entity/Note.ts";
import request from "../utils/request.ts";
import {Result} from "../interfaces/Result.ts";
import {elPrompt} from "../utils/elPrompt.ts";
import {useRoute} from "vue-router";
import ResultStatus from "../enums/ResultStatus.ts";

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

onMounted(() => {
  const text = useRoute().query.text as string
  if (!text) return
  searchText.value = text
  search(searchText.value)
})

/**
 * 预览笔记
 * @param noteId 笔记id
 */
function preview(noteId: number) {
  window.open(`/view/${noteId}`, '_blank')
}

/**
 * 分页
 */
const page = ref({
  total: 0,
  pageNumber: 1,
  pageSize: 10,
  pageSizes: computed(() => {
    const numberArray = [10]
    let maxPageSize = numberArray[0]
    while (maxPageSize < page.value.total) {
      maxPageSize += 10
      numberArray.push(maxPageSize)
    }
    return numberArray
  }),
  handleSizeChange: (value: number) => {
    page.value.pageSize = value
  },
  handleCurrentChange: (value: number) => {
    page.value.pageNumber = value
  },
})
</script>

<template>
  <div class="home">
    <div class="search-part">
      <el-input v-model="searchText" placeholder="搜索" inline="true" @keyup.enter="search(searchText)"></el-input>
      <el-button type="primary" @click="search(searchText)">搜索</el-button>
    </div>
    <div class="table-data">
      <el-table :data="notes">
        <el-table-column prop="title" label="笔记">
          <template #default="scope">
            <div class="note-list-item" @click="preview(scope.row.id)">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="page.pageNumber"
          v-model:page-size="page.pageSize"
          :page-sizes="page.pageSizes"
          :background="true"
          :total="page.total"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
      />
    </div>
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