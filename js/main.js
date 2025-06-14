import routes from './routes.js';
import { fetchList } from './content.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

(async () => {
    // If the URL is bare or root, redirect to first level
    const hash = window.location.hash;
    if (hash === '' || hash === '#/') {
        const list = await fetchList();
        const firstLevelName = list?.[0]?.[0]?.name;
        if (firstLevelName) {
            const encoded = encodeURIComponent(firstLevelName);
            window.location.hash = `#/list/${encoded}`;
        }
    }

    // Init app only after checking or redirecting
    const app = Vue.createApp({
        data: () => ({ store }),
    });

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes,
    });

    app.use(router);
    app.mount('#app');
})();
