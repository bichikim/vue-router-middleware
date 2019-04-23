import Vue, {ComponentOptions} from 'vue'
import {Route} from 'vue-router'
import {Next} from 'vue-router/next'
import {Store} from 'vuex'
import {Context} from './types'

export type RouterHook = (to: Route, from: Route, next?: Next) => any
export type RouterAfterHook = (to: Route, from: Route) => any
export interface AfterMiddlewareContext<A, S, V extends Vue = Vue> {
  to: Route
  from: Route
  next?: Next
  app: ComponentOptions<V> & A
  store?: Store<S>
}

export interface MiddlewareContext<A, S, V extends Vue = Vue>
  extends AfterMiddlewareContext<A, S, V> {
  next: Next
}

export type Middleware<A, S, V extends Vue = Vue>
  = (context: AfterMiddlewareContext<A, S, V>) => any

export interface MiddlewarePack<A, S, V extends Vue = Vue> {
  name: string
  middleware: Middleware<A, S, V>
}
export interface MiddlewarePackList<A, S, V extends Vue = Vue> {
  beforeEach: Array<MiddlewarePack<A, S, V>>
  beforeResolve: Array<MiddlewarePack<A, S, V>>
  afterEach: Array<MiddlewarePack<A, S, V>>
}

export interface ModulePack {
  name: string
  module: any
}

const getFileName = (path: string): string => {
  const match = path.match(/\/.*\.ts$/)
  if(!match || match.length < 1){
    return path
  }
  return match[0].split('/')[1].split('.')[0]
}

const createPack =
  <A, S, V extends Vue = Vue>(
    name: string,
    middleware: Middleware<A, S, V>,
    ): MiddlewarePack<A, S, V> => {
    return {
      name: getFileName(name),
      middleware,
    }
  }

const getter = <A, S, V extends Vue = Vue>
(resources: __WebpackModuleApi.RequireContext): MiddlewarePackList<A, S, V> => {
  const afterEachList: Array<MiddlewarePack<A, S, V>> = []
  const beforeEachList: Array<MiddlewarePack<A, S, V>> = []
  const beforeResolveList: Array<MiddlewarePack<A, S, V>> = []
  const keys = resources.keys()
  const modules: ModulePack[] = keys.map((key) => ({
    name: key,
    module: resources(key),
  }))
  modules.forEach(({module, name}: ModulePack) => {
    if(!module){
      return
    }
    const {
      beforeEach,
      beforeResolve,
      afterEach,
    } = module
    if(beforeEach){
      beforeEachList.push(createPack(name, beforeEach))
    }
    if(beforeResolve){
      beforeResolveList.push(createPack(name, beforeResolve))
    }
    if(afterEach){
      afterEachList.push(createPack(name, afterEach))
    }
  })
  return {
    beforeEach: beforeEachList,
    beforeResolve: beforeResolveList,
    afterEach: afterEachList,
  }
}

export interface Options {
  always?: string[]
}

const capsule = <A, S, V extends Vue = Vue>(
  name: string,
  middleware: Middleware<A, S, V>,
  store: Store<S>,
  app: ComponentOptions<V> & A,
  options: Options = {},
): RouterHook | RouterAfterHook => {
  const {
    always = [],
  } = options
  return (to: Route, from: Route, next?: Next) => {
    const runMiddleware = () => {
      const ctx: any = {to, from, store, app}
      if(next){
        ctx.next = next
      }
      return middleware(ctx)
    }
    const alwaysSome = (requireName): boolean => (name === requireName)
    const recordSome = (record): boolean => {
      if(!record.meta || !record.meta.middleware){
        return false
      }
      const {middleware} = record.meta
      if(Array.isArray(middleware)){
        return middleware.some((mid: string) => (mid === name))
      }
      return middleware === name
    }
    if(always.some(alwaysSome)){
      return runMiddleware()
    }
    if(to.matched.some(recordSome)){
      return runMiddleware()
    }
    // skip
    if(next){
      next()
    }
  }
}

export default <A, S, V extends Vue = Vue>(context: Context<A, S, V>, options: Options = {}) => {
  const {router, store, app} = context
  if(!router){
    return console.warn('[middleware] no router')
  }
  const middlewareList: MiddlewarePackList<A, S, V> = getter<A, S, V>(require.context(
    `${process.env.SRC_ALIAS}/${process.env.MIDDLEWARE_PATH}/`,
    false,
    /\.ts$/,
  ))
  middlewareList.beforeEach.forEach(({name, middleware}: MiddlewarePack<A, S, V>) => {
    router.beforeEach(capsule(name, middleware, store, app, options))
  })
  middlewareList.beforeResolve.forEach(({name, middleware}: MiddlewarePack<A, S, V>) => {
    router.beforeResolve(capsule(name, middleware, store, app, options))
  })
  middlewareList.afterEach.forEach(({name, middleware}: MiddlewarePack<A, S, V>) => {
    router.afterEach(capsule(name, middleware, store, app, options))
  })
}
