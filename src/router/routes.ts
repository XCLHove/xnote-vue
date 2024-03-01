import Home from "../views/Home.vue";
import Preview from "../views/note/Preview.vue";
import Edit from "../views/note/Edit.vue";
import UserNotes from "../views/note/UserNotes.vue";
import UserLayout from "../layout/UserLayout.vue";

const routes = [
    {
        path: "/",
        component: UserLayout,
        children: [
            { path: "/", component: Home },
            { path: "/preview/:noteId(\\d+)", component: Preview },
            { path: "/edit", component: Edit },
            { path: "/edit/:noteId(\\d+)", component: Edit },
            { path: "/notes/user", component: UserNotes },
        ],
    },
];
export default routes;
