<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {Result} from "../interfaces/Result.ts";
import {useRoute} from "vue-router";
import {pageNote} from "../api/NoteApi.ts";
import {NotePageDTO} from "../interfaces/entity/dto/NotePageDTO.ts";
import {debounce} from "../utils/debounce/debounce.ts";

const searchText = ref({
  title: '',
  content: '',
  keywords: '',
})


watch(searchText.value, () => {
  loading.value = true
  debounceSearchNote()
})

const loading = ref(false)

function getRouterParam() {
  const title = useRoute().query.title as string
  const keywords = useRoute().query.keywords as string
  const content = useRoute().query.content as string
  searchText.value.title = title ? title : ''
  searchText.value.content = content ? content : ''
  searchText.value.keywords = keywords ? keywords : ''
}

const debounceSearchNote = debounce(searchNote, 1.5)
async function searchNote() {
  loading.value = true
  const notePageDTO: NotePageDTO = {
    searchContent: searchText.value.content,
    searchKeyword: searchText.value.keywords,
    searchTitle: searchText.value.title,
    current: page.value.current,
    size: page.value.size,
  }
  await pageNote(notePageDTO,
      (result: Result<NotePageDTO>) => {
        page.value.total = result.data.total
        page.value.list = result.data.list
      }
  )
  loading.value = false
}

onMounted(() => {
  getRouterParam()
  searchNote()
})

/**
 * 预览笔记
 * @param noteId 笔记id
 */
function preview(noteId: number) {
  window.open(`/preview/${noteId}`, '_blank')
}

/**
 * 分页
 */
const page = ref({
  total: 0,
  current: 1,
  size: 10,
  list: [],
  layout: computed(() => {
    const type = {
      phone: 'total, sizes, prev, next',
      computer: 'total, sizes, prev, pager, next, jumper'
    }
    if (window.innerWidth > 450) return type.computer
    return type.phone
  }),
  sizes: computed(() => {
    const numberArray = [10]
    let maxPageSize = numberArray[0]
    while (maxPageSize < page.value.total) {
      maxPageSize += 10
      numberArray.push(maxPageSize)
    }
    return numberArray
  }),
  handleSizeChange: (value: number) => {
    page.value.size = value
    searchNote()
  },
  handleCurrentChange: (value: number) => {
    page.value.current = value
    searchNote()
  },
})

const tableHeight = computed(() => {
  return  window.innerHeight - 210
})
</script>

<template>
  <div class="container">
    <div class="search-part">
      <el-input v-model="searchText.title" placeholder="搜索标题" @keyup.enter="searchNote"/>
      <el-input v-model="searchText.keywords" placeholder="搜索关键词" @keyup.enter="searchNote"/>
      <el-input v-model="searchText.content" placeholder="搜索笔记内容" @keyup.enter="searchNote"/>
      <el-button type="primary" @click="searchNote">搜索</el-button>
    </div>
    <div class="table-data" v-loading="loading">
      <el-table :data="page.list" :height="tableHeight">
        <el-table-column prop="title" label="笔记">
          <template #default="scope">
            <div class="note-list-item" @click="preview(scope.row.id)">{{ scope.row.title }}</div>
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

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .search-part {
    display: flex;
    text-align: center;
    margin: 10px 0;
    
    .el-input {
      margin-right: 10px;
    }
  }
  
  .table-data {
    display: block;
  }
  
  .page {
    margin-top: auto;
  }
}
</style>