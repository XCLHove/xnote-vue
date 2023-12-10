<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {Note} from "../../interfaces/entity/Note.ts";
import {addNote, getONoteById, updateNote} from "../../api/NoteApi.ts";
import {Result} from "../../interfaces/Result.ts";
import ResultStatus from "../../enums/ResultStatus.ts";
import {elPrompt} from "../../utils/elPrompt.ts";
import Keyword from "../../classes/Keyword.ts";
import {uploadImage} from "../../api/ImageApi.ts";
import {Config} from "../../interfaces/Config.ts";
import getConfig from "../../utils/config.ts";
import {Image} from "../../interfaces/entity/Image.ts";

const note:Ref<Note> = ref({
  content: '',
  title: '',
  keywords: [],
})
const keywords: Ref<Keyword[]> = ref([])
const keywordInput = ref('')
onMounted(() => {
  const noteIdStr = <string>useRoute().params.noteId
  if (!noteIdStr) return
  const noteId = parseInt(noteIdStr)
  getONoteById(noteId, (result: Result<Note>) => {
    if (result.status === ResultStatus.ERROR) return
    note.value = result.data
  })
})

/** 保存锁 */
let saveLocked = false
/** 保存笔记 */
async function save() {
  //检测保存锁是否开启
  if (saveLocked) return elPrompt('正在保存中……', "warning", 1.5)
  
  //开启保存锁
  saveLocked = true
  
  //10秒后自动关闭保存锁，避免出现异常时保存锁无法关闭
  const timerId = setTimeout(() => {
    if (saveLocked) saveLocked = false;
    clearTimeout(timerId)
    }, 10 * 1000)
  
  //开始保存笔记
  if (note.value.id) {
    await updateNote(note.value, (result: Result<Note>) => {
      elPrompt('保存成功！', "success")
    })
  } else {
    await addNote(note.value, (result: Result<Note>) => {
      note.value = result.data
      elPrompt('保存成功！', "success")
    })
  }
  
  //关闭保存锁
  saveLocked = false
}

/**
 * 添加关键词
 */
function addKeyword() {
  const keywordValue = keywordInput.value
  if (!keywordValue) return
  const id = note.value.keywords.length
  if (keywordValue.length > 30) return elPrompt('关键词不能超过30个字符！', "warning")
  if (id >= 30) return elPrompt('关键词数据不能超过30个！', "warning")
  const newKeyword = new Keyword(id, keywordValue);
  note.value.keywords.push(newKeyword);
  cleanKeywordName()
}

/**
 * 清空关键词输入框
 */
function cleanKeywordName() {
  keywordInput.value = ''
}

/**
 * 移除关键词
 * @param removeKeyword 要移除的keyword的对象
 */
function removeKeyword(removeKeyword: Keyword) {
  note.value.keywords = note.value.keywords.filter(keyword => {
    if (keyword.id !== removeKeyword.id) return keyword;
  })
  note.value.keywords.forEach((item, index) => {
    item.id = index
    keywords.value[index] = item
  })
}

/**
 * 处理上传图片
 * @param event
 * @param insertImage
 * @param files
 */
async function handleUploadImage(event: any, insertImage: any, files: File[]) {
  const imageFile = files[0]
  if (imageFile.size > (Math.pow(1024, 2) * 10)) return elPrompt('图片不能超过10MB', "warning")
  let image: Image = {} as Image
  await uploadImage(imageFile, (result: Result<Image>) => {
    image = result.data
  })
  let serverUrl = ''
  await getConfig((config: Config) => {
    serverUrl = config.serverUrl
  })
  insertImage({
    url: `${serverUrl}/image/downloadByName/${image.name}`,
    desc: image.alias,
    width: 'auto',
    height: 'auto',
  });
}

/**
 * 复制代码成功
 * @param code 代码
 */
function handleCopyCodeSuccess(code: string) {
  elPrompt("复制成功！", "success")
}
</script>

<template>
  <div class="edit">
    <div class="title-input">
      <el-input v-model="note.title" inline="true" placeholder="标题"/>
    </div>
    <div class="keyword-input">
      <el-input placeholder="关键词" v-model="keywordInput" @keydown.enter="addKeyword"></el-input>
      <el-button type="primary" @click="addKeyword">添加关键词</el-button>
    </div>
    <div class="show-keywords"><el-tag
        v-for="keyword in note.keywords"
        :key="keyword.id"
        closable
        type="success"
        @close="removeKeyword(keyword)"
    >
      {{ keyword.name }}
    </el-tag></div>
    <div class="markdown">
      <v-md-editor
          left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code |   tip  todo-list emoji | save"
          v-model="note.content"
          @save="save"
          :disabled-menus="[]"
          @upload-image="handleUploadImage"
          @copy-code-success="handleCopyCodeSuccess"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.edit {
  .title-input {
    margin: 10px 0;
  }
  
  .keyword-input {
    display: flex;
    margin: 10px 0;
    
    .el-input {
      margin-right: 10px;
    }
  }
  
  .show-keywords {
    margin: 10px 0;
    
    .el-tag {
      height: 32px;
      margin-right: 10px;
      font-size: 16px;
    }
  }
  
  .markdown {
    .v-md-editor {
      height: calc(100vh - 250px);
    }
  }
}
</style>