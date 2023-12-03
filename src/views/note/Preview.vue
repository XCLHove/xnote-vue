<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {Note} from "../../interfaces/entity/Note.ts";
import {getONoteById} from "../../api/NoteApi.ts";
import {Result} from "../../interfaces/Result.ts";
import ResultStatus from "../../enums/ResultStatus.ts";
import Keyword from "../../classes/Keyword.ts";
import {elPrompt} from "../../utils/elPrompt.ts";

const note:Ref<Note> = ref({
  content: "",
  keywords: [],
  title: ""
})
onMounted(() => {
  const noteId = parseInt(<string>useRoute().params.noteId)
  getONoteById(noteId, (result: Result<Note>) => {
    note.value = result.data
  })
})

function handleCopyCodeSuccess(code: string) {
  elPrompt("复制成功！", "success")
}
</script>

<template>
  <div class="title">
    <h1>{{ note.title }}</h1>
  </div>
  <div class="keywords">
    <el-tag
        v-for="keyword in note.keywords"
        :key="keyword.id"
        :closable="false"
        type="success"
    >
      {{ keyword.name }}
    </el-tag>
  </div>
  <div class="note">
    <v-md-preview
        :text="note.content"
        @copy-code-success="handleCopyCodeSuccess"
    />
  </div>
</template>

<style scoped lang="less">
.margin {
  margin: 10px auto;
}

.border {
  border-radius: 5px;
  border: #becece solid 1px;
}

.width95 {
  width: 95%;
  .margin();
}

.title {
  .border();
  .width95();

  h1 {
    text-align: center;
  }
}

.keywords {
  .border();
  .width95();

  .el-tag {
    height: 32px;
    margin: 5px;
    font-size: 16px;
  }
}

.note {
  .border();
  .width95();
}
</style>