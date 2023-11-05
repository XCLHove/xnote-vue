import Home from "../views/Home.vue";
import Preview from "../views/View.vue";
import Edit from "../views/Edit.vue";
import Login from "../views/login.vue";
import UserNotes from "../views/UserNotes.vue";
import Layout from "../layout/Layout.vue";
import Register from "../views/Register.vue";

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