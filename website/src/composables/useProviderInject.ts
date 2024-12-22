import { hasInjectionContext, provide, inject } from "vue";

export function useProvideInject<T extends (...args: any[]) => any>(
  key: string | symbol,
  composable: T,
  defaultValue: ReturnType<T> | null = null
) {
  type Params = Parameters<T>;
  type Return = ReturnType<T>;

  function provideCtx(...args: Params): Return {
    const ctx = composable(...args);
    provide(key, ctx);
    return ctx;
  }

  function injectCtx(): Return {
    const ctx = inject<Return | null>(key, defaultValue);
    if (!hasInjectionContext() || !ctx) throw new Error('Context not found, you might have forgotten to provide context');
    return ctx as Return;
  }

  return {
    provideCtx,
    injectCtx,
  };
}