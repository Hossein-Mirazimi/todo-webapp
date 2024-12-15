import { onMounted, onServerPrefetch, Ref, ref, shallowRef, unref, watch, WatchSource } from "vue";
import { injectSSRContext } from ".";

type AsyncDataKey = string | (() => string);
type AsyncDataStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncDataOptions<DataT> {
    deep?: boolean;
    server?: boolean;
    watch?: WatchSource[];
    default?: () => DataT | Ref<DataT> | null;
}

export function useAsyncData<DataT, ErrorT>(
    key: AsyncDataKey,
    fn: () => Promise<DataT>,
    options: AsyncDataOptions<DataT> = {}
) {
    const ctx = injectSSRContext();
    const {
        deep = true,
        server = true,
        watch: watchSources,
        default: defaultData,
    } = options;

    const isSSR = import.meta.env.SSR;
    const onHook = isSSR && server ? onServerPrefetch : onMounted;
    const resolvedKey = typeof key === 'string' ? key : key();


    const refreshData = async (): Promise<DataT> => {
        state.status.value = 'pending';
        state.promise = fn()
            .then(response => {
                if (isSSR) {
                    ctx[resolvedKey] = response;
                }
                state.data.value = response;
                state.status.value = 'success';
                return response;
            })
            .catch(err => {
                state.error.value = err;
                state.status.value = 'error';
                throw err;
            });
        return await state.promise!;
    };

    const state = {
        status: ref<AsyncDataStatus>(ctx[resolvedKey] ? 'success' : 'idle'),
        data: (deep ? ref : shallowRef)<DataT | null>(ctx[resolvedKey] as DataT ?? unref(defaultData?.() ?? null)),
        promise: null as Promise<DataT> | null,
        refresh: refreshData,
        error: ref<ErrorT | null>(null),
        clear: () => {
            state.data.value = unref(defaultData?.() ?? null);
            state.error.value = null;
            state.status.value = 'idle';
        },
    };
    

    if (watchSources) {
        watch(watchSources, () => {
            state.clear();
            state.refresh();
        });
    }

    onHook(async () => {
        // Avoid re-fetching data during hydration if the data is already populated
        if (!isSSR && state.data.value !== null) {
            return;
        }
        await refreshData();
    });

    return state;
}
