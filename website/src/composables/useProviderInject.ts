import { hasInjectionContext, provide, inject } from "vue";

export function useProvideInject<T extends () => unknown>(
    key: string | symbol,
    composable: T,
    defaultValue: ReturnType<T> | null = null
  ) {
    
    function provideCtx(): ReturnType<T> {
        const ctx = composable() as ReturnType<T>;
        provide(key, ctx);
        return ctx;
      }
  
    function injectCtx() {
      const ctx = inject<ReturnType<T> | null>(key, defaultValue);
      if (!hasInjectionContext() || !ctx) throw new Error('Context not found, you might have forgotten to provide context');
      return ctx;
    }
  
    return {
      provideCtx,
      injectCtx,
    };
  }