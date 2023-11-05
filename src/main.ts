import {createApp} from 'vue'
import App from './App.vue'

//css
import './assets/styles/main.less'

//router
import router from "./router/router.ts";

//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//VMdPreview
import VMdPreview from '@kangc/v-md-editor/lib/preview.js';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
VMdPreview.use(githubTheme, {Hljs: hljs,});

//VMdEditor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor.js';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';
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
VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {Hljs: hljs,});

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(VMdPreview)
app.use(VMdEditor)
app.mount('#app')