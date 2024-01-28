import {createApp} from 'vue'
import App from './App.vue'

//css
import './assets/styles/main.less'

//router
import router from "./router/router.ts";

//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//Markdown plugins
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

//VMdPreview
import VMdPreview from '@kangc/v-md-editor/lib/preview.js';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

//VMdEditor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor.js';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import Codemirror from 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/lib/codemirror.css';

//VMdPreview
VMdPreview.use(githubTheme, {Hljs: hljs});
VMdPreview.use(createEmojiPlugin());
VMdPreview.use(createTodoListPlugin());
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createTipPlugin());
VMdPreview.use(createHighlightLinesPlugin());
VMdPreview.use(createAlignPlugin());

//VMdEditor
VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {Hljs: hljs,});
VMdEditor.use(createEmojiPlugin());
VMdEditor.use(createTodoListPlugin());
VMdEditor.use(createCopyCodePlugin());
VMdEditor.use(createTipPlugin());
VMdEditor.use(createHighlightLinesPlugin());
VMdEditor.use(createAlignPlugin());

const app = createApp(App)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(VMdPreview)
app.use(VMdEditor)
app.mount('#app')
