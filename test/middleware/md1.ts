import {AfterMiddlewareContext, MiddlewareContext} from '@/index'
import {TestApp} from '@@/test/spec/types'
const name: string = 'md1'
export function beforeEach(ctx: MiddlewareContext<TestApp, any>) {
  ctx.app.returnBfCtx(ctx, name)
  ctx.next()
}

export function beforeResolve(ctx: MiddlewareContext<TestApp, any>) {
  ctx.app.returnBfrCtx(ctx, name)
  ctx.next()
}

export function afterEach(ctx: AfterMiddlewareContext<TestApp, any>) {
  ctx.app.returnAfCtx(ctx, name)
}
