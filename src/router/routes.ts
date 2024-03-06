const routes = [
    {
        path: "/",
        component: () => import("@/layout/UserLayout.vue"),
        children: [
            { path: "/", component: () => import("@/views/Home.vue") },
            {
                path: "/preview/:noteId(\\d+)",
                component: () => import("@/views/note/Preview.vue"),
            },
            { path: "/edit", component: () => import("@/views/note/Edit.vue") },
            {
                path: "/edit/:noteId(\\d+)",
                component: () => import("@/views/note/Edit.vue"),
            },
            {
                path: "/notes/user",
                component: () => import("@/views/note/UserNotes.vue"),
            },
        ],
    },
];
export default routes;
