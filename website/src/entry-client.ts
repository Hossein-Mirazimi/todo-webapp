import './style.css'
import { createApp } from './main';
(async () => {
    const isSSRRendered = document.documentElement.getAttribute('data-ssr') === 'true';
    const { app, router } = createApp(isSSRRendered);
    await router.isReady();
    app.mount('#app')
})()
