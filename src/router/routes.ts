import Home from "../views/Home.vue";
import Preview from "../views/note/View.vue";
import Edit from "../views/note/Edit.vue";
import Login from "../views/user/login.vue";
import UserNotes from "../views/note/UserNotes.vue";
import Layout from "../layout/user/Layout.vue";
import Register from "../views/user/Register.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '/', component: Home },
            { path: '/view/:noteId(\\d+)', component: Preview },
            { path: '/edit', component: Edit },
            { path: '/edit/:noteId(\\d+)', component: Edit },
            { path: '/login/:type(user|admin)', component: Login },
            { path: '/register', component: Register },
            { path: '/notes/user', component: UserNotes },
        ]
    }
]
export default routes