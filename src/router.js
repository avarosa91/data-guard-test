import Home from "@/views/Home.vue";

const routes = [
    {
        path: '/:tab?',
        name: 'Home',
        props: true,
        component: Home,
    },
];

export default routes;
