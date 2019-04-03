import Router, { Route } from 'vue-router';
import { Next } from 'vue-router/next';
import { Store } from 'vuex';
export declare type RouterHook = (to: Route, from: Route, next?: Next) => any;
export declare type RouterAfterHook = (to: Route, from: Route) => any;
export interface AfterMiddlewareContext<S = any, A = any> {
    to: Route;
    from: Route;
    next?: Next;
    app: A;
    store?: Store<S>;
}
export interface MiddlewareContext<S = any, A = any> extends AfterMiddlewareContext {
    next: Next;
}
export declare type Middleware<S, A> = (context: AfterMiddlewareContext<S, A>) => any;
export interface MiddlewarePack<S, A> {
    name: string;
    middleware: Middleware<S, A>;
}
export interface MiddlewarePackList<S, A> {
    beforeEach: Array<MiddlewarePack<S, A>>;
    beforeResolve: Array<MiddlewarePack<S, A>>;
    afterEach: Array<MiddlewarePack<S, A>>;
}
export interface ModulePack {
    name: string;
    module: any;
}
export interface Options<A> {
    always?: string[];
    app?: A;
}
declare const _default: <S, A = any>(router: Router, store: Store<S>, options?: Options<A>) => void;
export default _default;
