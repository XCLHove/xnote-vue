<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Note } from "@/interfaces/entity/Note.ts";
import { addNote, getNoteById, updateNote } from "@/api/NoteApi.ts";
import { Result } from "@/interfaces/Result.ts";
import { elPrompt } from "@/utils/elPrompt.ts";
import { uploadImage } from "@/api/ImageApi.ts";
import { Image } from "@/interfaces/entity/Image.ts";
import NoteIsPublic from "@/enums/NoteIsPublic.ts";
import lock from "@/utils/lock.ts";
import { Config, getConfig } from "@/utils/config.ts";

/**当前正在编辑的笔记*/
const note: Ref<Note> = ref({
    title: "",
    keywords: [],
    content: "",
    isPublic: NoteIsPublic.NO,
    accessCode: "",
});

/**输入的关键词*/
const keywordInput = ref("");

/**获取笔记，发布新笔记时不会获取*/
const getNote = () => {
    // 从url获取笔记id
    const noteIdStr = <string>useRoute().params.noteId;
    if (!noteIdStr) {
        return;
    }
    note.value.id = parseInt(noteIdStr);

    // 通过笔记id获取笔记
    getNoteById({
        noteId: note.value.id,
        accessCode: note.value.accessCode,
    }).then((result: Result<Note>) => {
        note.value = result.data;
    });
};

onMounted(() => {
    getNote();
});

/**保存笔记*/
async function save() {
    // 检查访问码格式
    if (!validateAccessCode()) return;

    saveStatus.value = SaveStatus.saving;

    //开始保存笔记，id存在则为修改，不存在则为保存
    if (note.value.id) {
        await updateNote(note.value).then(() => {
            elPrompt.success("修改成功！");
            saveStatus.value = SaveStatus.saved;
        });
    } else {
        await addNote(note.value).then((result: Result<Note>) => {
            note.value.id = result.data.id;
            note.value.title ||= result.data.title;
            elPrompt.success("保存成功！");
            saveStatus.value = SaveStatus.saved;
        });
    }
}

/**保存笔记功能加锁，避免重复提交*/
const lockSave = lock(
    save,
    () => {
        elPrompt.warning("正在保存中……，若长时间未显示成功请重试");
    },
    () => {
        saveStatus.value = SaveStatus.failed;
    },
);

/**是否展示关键词*/
const showKeywords = computed(() => {
    return note.value.keywords?.length > 0;
});

/**添加关键词*/
function addKeyword() {
    const newKeyword = keywordInput.value.trim();
    if (!newKeyword) {
        elPrompt.warning("关键词不能为空！");
        return;
    }
    if (newKeyword.length > 30) {
        elPrompt.warning("关键词不能超过30个字符！");
        return;
    }
    if (note.value.keywords.length + 1 >= 30) {
        elPrompt.warning("关键词数据不能超过30个！");
        return;
    }
    note.value.keywords.push(newKeyword);

    // 对关键词去重
    note.value.keywords = [...new Set(note.value.keywords)];

    // 清空关键词输入框
    keywordInput.value = "";
}

/**
 * 移除关键词
 * @param removeKeyword 要移除的关键词
 */
function removeKeyword(removeKeyword: string) {
    note.value.keywords = note.value.keywords.filter((keyword: string) => {
        return removeKeyword != keyword;
    });
}

/**
 * 处理上传图片
 * @param event {Event}
 * @param insertImage
 * @param files {File[]}
 */
async function handleUploadImage(
    event: Event,
    insertImage: (options: {
        url: string;
        desc: string;
        width?: string;
        height?: string;
    }) => void,
    files: File[],
) {
    const { serverUrl } = await getConfig();
    for (const imageFile of files) {
        if (imageFile.size > Math.pow(1024, 2) * 10) {
            elPrompt.warning("图片不能超过10MB");
            continue;
        }

        await uploadImage(imageFile).then(({ data: image }) => {
            insertImage({
                url: `${serverUrl}/image/downloadByName/${image.name}`,
                desc: image.alias,
            });
        });
    }
}

/**
 * 复制代码成功
 * @param code 代码
 */
function handleCopyCodeSuccess(code: string) {
    elPrompt.success("复制成功！");
}

const SaveStatus = {
    unSave: {
        type: "info",
        description: "未保存",
    },
    saving: {
        type: "warning",
        description: "保存中",
    },
    saved: {
        type: "success",
        description: "保存成功",
    },
    failed: {
        type: "danger",
        description: "保存失败",
    },
};
const saveStatus = ref(SaveStatus.unSave);
watch(note.value, (newNote: typeof note.value, oldNote: typeof note.value) => {
    saveStatus.value = SaveStatus.unSave;
});

/**
 * 验证访问码的格式
 * @return {boolean} 验证是否通过
 */
const validateAccessCode = () => {
    const reg = /^[a-zA-Z0-9]{0,20}$/;
    const validatePass = reg.test(<string>note.value.accessCode);
    if (!validatePass) {
        elPrompt.error("访问码仅支持不超过20位的数字和字母", 2);
    }
    return validatePass;
};
</script>

<template>
    <div class="edit">
        <!--标题输入框-->
        <div class="edit-item">
            <div class="edit">
                <el-input
                    v-model="note.title"
                    inline="true"
                    placeholder="标题"
                />
            </div>
            <div class="save-status">
                <el-tag
                    size="large"
                    :type="saveStatus.type"
                    @click="lockSave"
                    >{{ saveStatus.description }}</el-tag
                >
            </div>
        </div>
        <!--关键词输入框-->
        <div class="edit-item">
            <div class="edit">
                <el-input
                    placeholder="关键词"
                    v-model="keywordInput"
                    @keydown.enter="addKeyword"
                ></el-input>
            </div>
            <div class="operation">
                <el-button type="primary" @click="addKeyword"
                    >添加关键词</el-button
                >
            </div>
        </div>
        <!--是否公开笔记-->
        <div class="edit-item is-public">
            <div class="edit">
                <el-input
                    v-model="note.accessCode"
                    placeholder="访问码为空则不可被其他用户搜索"
                    :disabled="note.isPublic === NoteIsPublic.YES"
                    @blur="validateAccessCode"
                />
            </div>
            <div class="operation">
                <div class="switch">
                    <el-switch
                        v-model="note.isPublic"
                        inline-prompt
                        size="large"
                        :active-value="NoteIsPublic.YES"
                        :active-text="NoteIsPublic.YES"
                        :inactive-value="NoteIsPublic.NO"
                        :inactive-text="NoteIsPublic.NO"
                    />
                </div>
            </div>
        </div>
        <!--关键词展示-->
        <div v-show="showKeywords" class="show-keywords">
            <el-scrollbar height="32px">
                <el-tag
                    v-for="keyword in note.keywords"
                    :key="keyword"
                    closable
                    type="success"
                    @close="removeKeyword(keyword)"
                >
                    {{ keyword }}
                </el-tag>
            </el-scrollbar>
        </div>
        <!--没有关键词时的展示-->
        <div v-show="!showKeywords" class="show-keywords no-keywords">
            <el-text type="info">暂无关键词</el-text>
        </div>
        <!--笔记编辑区域-->
        <div class="markdown">
            <v-md-editor
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code |   tip  todo-list emoji | save"
                v-model="note.content"
                @save="lockSave"
                :disabled-menus="[]"
                @upload-image="handleUploadImage"
                @copy-code-success="handleCopyCodeSuccess"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
@import "../../assets/styles/flex";

.edit {
    width: 100%;

    .edit-item {
        .flex;
        margin: 10px 0;
        width: 100%;

        .edit {
            margin-right: 10px;
            width: calc(100% - 110px);
        }

        .save-status {
            .flex;
            justify-content: flex-end;
            width: 100px;
            overflow: hidden;

            .el-tag {
                width: 100%;

                &:hover {
                    color: var(--color-primary);
                    font-weight: bold;
                }
            }
        }

        .operation {
            width: 100px;
        }
    }

    .is-public {
        .switch {
            .flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            height: 100%;

            .el-switch {
                height: fit-content;
                --el-switch-on-color: var(--color-success);
                --el-switch-off-color: var(--color-danger);
            }
        }
    }

    .show-keywords {
        margin: 10px 0;
        height: 32px;

        .el-tag {
            height: 32px;
            margin-right: 10px;
            font-size: 16px;
        }
    }

    .no-keywords {
        .flex;
        align-items: center;
    }

    .markdown {
        .v-md-editor {
            height: calc(100vh - 310px);
        }
    }
}
</style>
