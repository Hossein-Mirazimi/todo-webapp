import './style.css'
import { createApp } from './main';
(async () => {
    const { app, router } = createApp();
    
    await router.isReady();
    app.mount('#app')
})()
