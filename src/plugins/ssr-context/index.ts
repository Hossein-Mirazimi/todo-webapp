import { App, inject, reactive } from "vue";

const SSR_PROVIDE_KEY = 'SSR_CONTEXT';
export const HYDRATED_KEY = '__SSR_CONTEXT__';

interface SSRContextData {
    install: (app: App) => void;
    toJS: () => string;
    [key: string]: unknown
}

export function createSSRContext () {
    return reactive<SSRContextData>(Object.create({
        install (app: App) {
            app.provide(SSR_PROVIDE_KEY, this);
            if(typeof window !== 'undefined' && window[HYDRATED_KEY as any]) {
                console.log('sync with state', this)
                Object.assign(this, window[HYDRATED_KEY as any]);
                delete window[HYDRATED_KEY as any];
            }
        },
        toString () {
            return JSON.stringify(this);
        },
        toJS () {
            return `<script>window.${HYDRATED_KEY} = ${this.toString()}</script>`
        }
    }))
}

export function injectSSRContext () {
    const ctx = inject<SSRContextData>(SSR_PROVIDE_KEY);
    if (!ctx) {
        throw new Error('Server Context not found, you might forgot install SSRContext plugin');
    }
    return ctx;
}