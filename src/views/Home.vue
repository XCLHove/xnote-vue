<script setup lang="ts">
import { computed, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { Result } from "../interfaces/Result.ts";
import { useRoute } from "vue-router";
import { pageNote } from "../api/NoteApi.ts";
import { NotePageDTO } from "../interfaces/entity/dto/NotePageDTO.ts";
import { debounce } from "../utils/debounce/debounce.ts";
import lock from "../utils/lock.ts";
import { elPrompt } from "../utils/elPrompt.ts";
import NoteIsPublic from "../enums/NoteIsPublic.ts";
import { getSizes } from "../utils/getSizes.ts";
import { loginListener } from "../utils/loginListener.ts";

// 搜索文本
const searchText = ref({
    title: "",
    content: "",
    keywords: "",
});

watch(searchText.value, () => {
    searchRepeat.unlock();

    // 显示加载动画
    loading.value = true;

    debounceSearchNote();
});

const loading = ref(false);

function getRouterParam() {
    const title = useRoute().query.title as string;
    const keywords = useRoute().query.keywords as string;
    const content = useRoute().query.content as string;
    searchText.value.title = title ? title : "";
    searchText.value.content = content ? content : "";
    searchText.value.keywords = keywords ? keywords : "";
}

/**避免重复请求的锁*/
const searchRepeat = {
    locked: false,
    count: 0,
    lock: () => {
        searchRepeat.count++;
        searchRepeat.locked = true;
    },
    unlock: () => {
        searchRepeat.count = 0;
        searchRepeat.locked = false;
    },
};
async function searchNote() {
    if (searchRepeat.locked) {
        if (searchRepeat.count > 1) {
            elPrompt.warning("请勿重复请求！");
        }
        return;
    }
    searchRepeat.lock();

    // 显示加载动画
    loading.value = true;

    await pageNote(
        {
            searchContent: searchText.value.content,
            searchKeyword: searchText.value.keywords,
            searchTitle: searchText.value.title,
            current: page.value.current,
            size: page.value.size,
        },
        (result: Result<NotePageDTO>) => {
            page.value.total = result.data.total ? result.data.total : 0;
            page.value.list = result.data.list ? result.data.list : [];
        },
    );

    // 关闭加载动画
    loading.value = false;
}
/**搜索加锁防止频繁请求*/
const lockSearchNote = lock(searchNote, () => {
    elPrompt.warning("搜索中……");
});
/**搜索防抖*/
const debounceSearchNote = debounce(searchNote, 1.5);

onMounted(() => {
    getRouterParam();
    searchNote();
});

/**
 * 预览笔记
 * @param noteId 笔记id
 */
function preview(noteId: number) {
    window.open(`/preview/${noteId}`, "_blank");
}

/** 分页 */
const page: Ref<{
    total: number;
    current: number;
    size: number;
    list: any[];
    layout: string;
    sizes: number[];
    handleSizeChange: (value: number) => void;
    handleCurrentChange: (value: number) => void;
}> = ref({
    total: 0,
    current: 1,
    size: 10,
    list: [],
    layout: computed(() => {
        const type = {
            phone: "total, sizes, prev, next",
            computer: "total, sizes, prev, pager, next, jumper",
        };
        if (window.innerWidth > 450) return type.computer;
        return type.phone;
    }),
    sizes: computed(() => {
        return getSizes(page.value.total);
    }),
    handleSizeChange: (value: number) => {
        page.value.size = value;
    },
    handleCurrentChange: (value: number) => {
        page.value.current = value;
    },
});
watch([() => page.value.current, () => page.value.size], () => {
    searchRepeat.unlock();

    searchNote();
});

const tableHeight = computed(() => {
    return window.innerHeight - 210;
});

const removeLoginListener = loginListener(() => {
    searchRepeat.unlock();
    searchNote();
});
onUnmounted(() => {
    removeLoginListener();
});
</script>

<template>
    <div class="container">
        <!--搜索输入框-->
        <div class="search-part">
            <el-input
                v-model="searchText.title"
                placeholder="搜索标题"
                @keyup.enter="lockSearchNote"
            />
            <el-input
                v-model="searchText.keywords"
                placeholder="搜索关键词"
                @keyup.enter="lockSearchNote"
            />
            <el-input
                v-model="searchText.content"
                placeholder="搜索笔记内容"
                @keyup.enter="lockSearchNote"
            />
            <el-button type="primary" @click="lockSearchNote">搜索</el-button>
        </div>
        <!--数据展示-->
        <div class="table-data" v-loading="loading">
            <el-table :data="page.list" :height="tableHeight">
                <el-table-column prop="title" label="笔记">
                    <template #default="scope">
                        <div
                            class="note-list-item"
                            @click="preview(scope.row.id)"
                        >
                            {{ scope.row.title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="isPublic" label="是否公开" width="80">
                    <template #default="scope">
                        <el-tag
                            :type="
                                scope.row.isPublic === NoteIsPublic.YES
                                    ? 'success'
                                    : 'danger'
                            "
                            >{{ scope.row.isPublic }}</el-tag
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
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
        margin-top: 5px;
    }
}
</style>
