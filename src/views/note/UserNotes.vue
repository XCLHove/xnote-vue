<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Note} from "../../interfaces/entity/Note.ts";
import {deleteNoteById, pageNote} from "../../api/NoteApi.ts";
import {Result} from "../../interfaces/Result.ts";
import router from "../../router/router.ts";
import {elPrompt} from "../../utils/elPrompt.ts";
import {NotePageDTO} from "../../interfaces/entity/dto/NotePageDTO.ts";
import {getUserSelf} from "../../api/UserApi.ts";
import {User} from "../../interfaces/entity/User.ts";

const loading = ref(false)

/**
 * 分页
 */
const page = ref({
  total: 0,
  current: 1,
  size: 10,
  list: [],
  sizes: computed(() => {
    const numberArray = [10]
    let maxPageSize = numberArray[0]
    while (maxPageSize < page.value.total) {
      maxPageSize += 10
      numberArray.push(maxPageSize)
    }
    return numberArray
  }),
  layout: computed(() => {
    const type = {
      phone: 'total, sizes, prev, next',
      computer: 'total, sizes, prev, pager, next, jumper'
    }
    if (window.innerWidth > 450) return type.computer
    return type.phone
  }),
  handleSizeChange: (value: number) => {
    page.value.size = value
    getUserNote()
  },
  handleCurrentChange: (value: number) => {
    page.value.current = value
    getUserNote()
  },
})

/**
 * 搜索文本
 */
const searchText = ref<{ title: string, content: string, keywords: string }>({
  title: '',
  content: '',
  keywords: '',
})

onMounted(() => {
  getUserNote()
})

/**
 * 获取笔记
 */
async function getUserNote() {
  loading.value = true
  let userId = 0
  await getUserSelf((result: Result<User>) => {
    userId = result.data.id
  })
  const notePageDTO: NotePageDTO = {
    searchContent: searchText.value.content,
    searchKeyword: searchText.value.keywords,
    searchTitle: searchText.value.title,
    current: page.value.current,
    size: page.value.size,
    userId: userId
  }
  await pageNote(notePageDTO, (result: Result<NotePageDTO>) => {
    page.value.total = result.data.total
    page.value.list = result.data.list
  })
  loading.value = false
}

/**
 * 删除笔记
 * @param noteId 笔记id
 */
function removeNote(noteId: number) {
  deleteNoteById(noteId, (result: Result<number>) => {
    elPrompt('删除成功！', 'success')
    page.value.list = page.value.list.filter((note: Note) => {
      if (note.id !== noteId) return note
    })
    page.value.total--
  })
}

/**
 * 预览笔记
 * @param noteId 笔记id
 */
function preview(noteId: number) {
  window.open(`/preview/${noteId}`, '_blank')
}

const tableHeight = computed(() => {
  return  window.innerHeight - 210
})
</script>

<template>
  <div class="container">
    <div class="search-part">
      <el-input v-model="searchText.title" placeholder="搜索标题" @keyup.enter="getUserNote"/>
      <el-input v-model="searchText.keywords" placeholder="搜索关键词" @keyup.enter="getUserNote"/>
      <el-input v-model="searchText.content" placeholder="搜索笔记内容" @keyup.enter="getUserNote"/>
      <el-button type="primary" @click="getUserNote">搜索</el-button>
    </div>
    <div class="user-notes" v-loading="loading">
      <el-table :data="page.list" style="width: 100%" :height="tableHeight">
        <el-table-column fixed prop="title" label="笔记">
          <template #default="scope">
            <div @click="preview(scope.row.id)">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" @click="preview(scope.row.id)">查看</el-button>
            <el-button link type="success" @click="router.push(`/edit/${scope.row.id}`)">修改</el-button>
            <el-button link type="danger" @click="removeNote(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
          :layout="page.layout"
          v-model:current-page="page.current"
          v-model:page-size="page.size"
          :page-sizes="page.sizes"
          :background="true"
          :total="page.total"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .search-part {
    display: flex;
    margin: 10px 0;
    
    .el-input {
      margin-right: 10px;
    }
  }
  
  .page {
    margin-top: auto;
  }
}
</style>