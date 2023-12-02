<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {Note} from "../../interfaces/entity/Note.ts";
import {getOneNote} from "../../api/NoteApi.ts";
import {Result} from "../../interfaces/Result.ts";
import ResultStatus from "../../enums/ResultStatus.ts";
import Keyword from "../../classes/Keyword.ts";

const note = ref({
  content: ''
}) as Ref<Note>
const keywords: Ref<Keyword[]> = ref([])
onMounted(() => {
  const route = useRoute()
  if (!route.params.noteId) return
  const noteIdStr = route.params.noteId as string
  const noteId = Number.parseInt(noteIdStr)
  getOneNote(noteId, (result: Result<Note>) => {
    if (result.status === ResultStatus.ERROR) return
    if (result.data) note.value = result.data
    keywords.value = JSON.parse(note.value.keywords)
  })
})
</script>

<template>
  <div class="title">
    <h1>{{ note.title }}</h1>
  </div>
  <div class="keywords">
    <el-tag
        v-for="keyword in keywords"
        :key="keyword.id"
        :closable="false"
        type="success"
    >
      {{ keyword.name }}
    </el-tag>
  </div>
  <div class="note">
    <v-md-preview :text="note.content"></v-md-preview>
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