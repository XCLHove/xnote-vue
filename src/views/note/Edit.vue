<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {Note} from "../../interfaces/entity/Note.ts";
import {addNote, getOneNote, updateNote} from "../../api/NoteApi.ts";
import {Result} from "../../interfaces/Result.ts";
import ResultStatus from "../../enums/ResultStatus.ts";
import {elPrompt} from "../../utils/elPrompt.ts";
import Keyword from "../../classes/Keyword.ts";
import {uploadImage} from "../../api/ImageApi.ts";

const note = ref({content: ''}) as Ref<Note>
const keywords: Ref<Keyword[]> = ref([])
const keywordName = ref('')
onMounted(() => {
  if (!useRoute().params.noteId) return;
  const noteIdStr = useRoute().params.noteId as string
  const noteId = Number.parseInt(noteIdStr)
  getOneNote(noteId, (result: Result<Note>) => {
    if (result.status === ResultStatus.ERROR) return
    note.value = result.data ? result.data : note.value
    if (note.value.keywords) keywords.value = JSON.parse(note.value.keywords)
  })
})

/**
 * 保存笔记
 */
function save() {
  note.value.keywords = JSON.stringify(keywords.value)
  if (note.value.id) {
    updateNote(note.value, (result: Result<number>) => {
      if (result.status !== ResultStatus.SUCCESS) return
      elPrompt('保存成功！', "success")
    })
    return
  }
  addNote(note.value, (result: Result<number>) => {
    if (result.status !== ResultStatus.SUCCESS) return
    elPrompt('保存成功！', "success")
    getOneNote(result.data, (result2: Result<Note>) => {
      if (result.status !== ResultStatus.SUCCESS) return
      note.value = result2.data
    })
  })
}

/**
 * 添加关键词
 * @param keywordName 关键词名字
 */
function addKeyword(keywordName: string) {
  if (keywordName.length > 10) {
    elPrompt('关键词不能超过10个字符！', "warning")
    return;
  }
  if (keywords.value.length > 30) {
    elPrompt('关键词数据不能超过30个！', "warning")
    return;
  }
  const id = keywords.value.length
  const keyword = new Keyword(id, keywordName);
  keywords.value.push(keyword);
  cleanKeywordName()
}

/**
 * 清空关键词输入框
 */
function cleanKeywordName() {
  keywordName.value = ''
}

/**
 * 移除关键词
 * @param removeKeyword 要移除的keyword的对象
 */
function removeKeyword(removeKeyword: Keyword) {
  keywords.value = keywords.value.filter(keyword => {
    if (keyword.id !== removeKeyword.id) return keyword;
  })
  keywords.value.forEach((item, index) => {
    item = item
    keywords.value[index].id = index
  })
}

async function handleUploadImage(event: any, insertImage: any, files: File[]) {
  const imageFile = files[0]
  let fileName = ''
  await uploadImage(imageFile, (result:Result<string>) => {
    fileName = result.data
  })
  const serverUrl = 'http://localhost:8080'
  insertImage({
    url: `${serverUrl}/image/${fileName}`,
    desc: imageFile.name,
    // width: 'auto',
    // height: 'auto',
  });
}
</script>

<template>
  <div class="edit">
    <div class="title">
      <el-input v-model="note.title" inline="true" placeholder="标题"/>
    </div>
    <div class="keywords">
      <el-input placeholder="关键词" v-model="keywordName"></el-input>
      <el-button type="primary" @click="addKeyword(keywordName)">添加关键词</el-button>
      <el-tag
          v-for="keyword in keywords"
          :key="keyword.id"
          closable
          type="success"
          @close="removeKeyword(keyword)"
      >
        {{ keyword.name }}
      </el-tag>
    </div>
    <v-md-editor
        v-model="note.content"
        @save="save"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
    />
  </div>
</template>

<style scoped lang="less">
.title {
  .text {

  }

  .el-input {
    display: inline;
    width: 100%;
  }
}

.keywords {
  margin: 5px 0;

  .el-input {
    display: inline;
  }

  .el-button {
    margin-left: 5px;
  }

  .el-tag {
    height: 32px;
    margin: 5px;
    font-size: 16px;
  }
}

.v-md-editor {
  height: calc(100vh - 74px);
}
</style>