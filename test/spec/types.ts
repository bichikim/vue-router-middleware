import {AfterMiddlewareContext, MiddlewareContext} from '@/index'

export interface TestApp {
  returnBfCtx: (ctx: MiddlewareContext<any, any>, name?: string) => void
  returnBfrCtx: (ctx: MiddlewareContext<any, any>, name?: string) => void
  returnAfCtx: (ctx: AfterMiddlewareContext<any, any>, name?: string) => void
}
