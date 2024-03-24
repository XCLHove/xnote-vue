<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { Note } from "@/interfaces/entity/Note.ts";
import { getNoteById } from "@/api/NoteApi.ts";
import { Result } from "@/interfaces/Result.ts";
import { elPrompt } from "@/utils/elPrompt.ts";
import NoteIsPublic from "@/enums/NoteIsPublic.ts";
import { ElMessageBox } from "element-plus";
import ResultStatus from "@/enums/ResultStatus.ts";
import ImagePreview from "@/component/ImagePreview.vue";

const note: Ref<Note> = ref({
    content: "",
    keywords: [],
    title: "",
    isPublic: NoteIsPublic.NO,
    accessCode: "",
});

/**获取笔记*/
const getNote = () => {
    if (!note.value.id) {
        elPrompt.error("获取笔记id失败！");
        return;
    }
    getNoteById({
        noteId: note.value.id,
        accessCode: note.value.accessCode,
    }).then((result: Result<Note>) => {
        if (result.status === ResultStatus.NOTE_ACCESS_CODE_EXCEPTION) {
            // 访问码错误
            inputAccessCode();
            return;
        }
        note.value = result.data;
    });
};

/**
 * 输入访问码
 */
const inputAccessCode = () => {
    elPrompt.error("访问码错误！");
    ElMessageBox.prompt("请输入访问码", "需要输入访问码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[a-zA-Z0-9]{1,128}/,
        inputErrorMessage: "仅支持1-128位的数字字母",
    })
        .then(({ value }) => {
            // 确定
            note.value.accessCode = value;
            // 输入访问码后再次获取笔记
            getNote();
        })
        .catch(() => {
            // 取消
            elPrompt.warning("没有访问码，无法查看笔记！");
        });
};

onMounted(() => {
    note.value.id = parseInt(<string>useRoute().params["noteId"]);
    note.value.accessCode = <string>useRoute().query["accessCode"];
    getNote();
});

function handleCopyCodeSuccess(code: string) {
    elPrompt.success("复制成功！");
}

const imagePreview = ref({
    show: false,
    src: "",
    alt: "",
});
const previewListener = () => {
    const listener = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() !== "img") return;

        const imgEl = target as HTMLImageElement;
        imagePreview.value.src = imgEl.src;
        imagePreview.value.alt = imgEl.alt;
        imagePreview.value.show = true;
    };
    window.addEventListener("click", listener);

    return () => {
        window.removeEventListener("click", listener);
    };
};
const removePreviewListener = previewListener();
onUnmounted(() => {
    removePreviewListener();
});
</script>

<template>
    <div class="title">
        <h1>{{ note.title }}</h1>
    </div>
    <div class="keywords">
        <el-tag
            v-for="keyword in note.keywords"
            :key="keyword"
            :closable="false"
            type="success"
        >
            {{ keyword }}
        </el-tag>
    </div>
    <div class="note">
        <v-md-preview
            :text="note.content"
            @copy-code-success="handleCopyCodeSuccess"
        />
    </div>
    <!--图片预览-->
    <ImagePreview
        v-model:show="imagePreview.show"
        v-model:src="imagePreview.src"
        v-model:alt="imagePreview.alt"
    />
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
