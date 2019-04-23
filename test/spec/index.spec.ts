/* tslint:disable:no-unused-expression */
/* eslint-disable no-new */
import middleware from '@/index'
import {expect} from 'chai'
import Vue from 'vue'
import VueRouter from 'vue-router'
import {TestApp} from './types'
const component = Vue.extend({
  template: '<div>hi</div>',
})

describe('middleware', () => {
  let bfCtxs: any[] = []
  let bfrCtxs: any[] = []
  let afCtxs: any[] = []
  before(() => {
    // check environment is for test
    expect(process.env.SRC_ALIAS).to.equal('@@/test')
    expect(process.env.MIDDLEWARE_PATH).to.equal('middleware')
  })
  afterEach(() => {
    bfCtxs = []
    bfrCtxs = []
    afCtxs = []
  })
  it('should register all middleware', () => {
    const router: any = new VueRouter({
      routes: [

      ],
    })
    middleware({
      app: {} as any,
      router,
      store: {} as any,
    })
    expect(router.beforeHooks).to.length(2)
    expect(router.resolveHooks).to.length(2)
    expect(router.afterHooks).to.length(2)
  })
  it('should register all middleware with app', () => {

    const router: any = new VueRouter({
      routes: [
        {
          path: '/',
          component,
        },
      ],
    })

    new Vue({
      router,
    })

    const app: TestApp = {
      returnBfCtx: (ctx) => (bfCtxs.push(ctx)),
      returnBfrCtx: (ctx) => (bfrCtxs.push(ctx)),
      returnAfCtx: (ctx) => (afCtxs.push(ctx)),
    }

    middleware({
      app: app as any,
      router,
      store: {} as any,
    }, {
      always: ['md1', 'md2'],
    })
    expect(router.beforeHooks.length).to.equal(2)
    expect(router.resolveHooks.length).to.equal(2)
    expect(router.afterHooks.length).to.equal(2)
    router.push('/')
    bfCtxs.forEach((bfCtx) => {
      expect(bfCtx).to.have.keys(['to', 'from', 'app', 'next', 'store'])
    })
    bfrCtxs.forEach((bfrCtx) => {
      expect(bfrCtx).to.have.keys(['to', 'from', 'app', 'next', 'store'])
    })
    afCtxs.forEach((afCtx) => {
      expect(afCtx).to.have.keys(['to', 'from', 'app', 'store'])
    })
  })

  it('should register all middleware but run only mentioned middleware', function test() {
    const app: TestApp = {
      returnBfCtx: (ctx, name) => (bfCtxs.push({...ctx, name})),
      returnBfrCtx: (ctx, name) => (bfrCtxs.push({...ctx, name})),
      returnAfCtx: (ctx, name) => (afCtxs.push({...ctx, name})),
    }
    const router: any = new VueRouter({
      routes: [
        {
          path: '/',
          component,
          meta: {
            middleware: 'md1',
          },
        },
      ],
    })

    new Vue({
      router,
    })

    middleware({
      app: app as any,
      router,
      store: {} as any,
    })
    expect(router.beforeHooks.length).to.equal(2)
    expect(router.resolveHooks.length).to.equal(2)
    expect(router.afterHooks.length).to.equal(2)
    router.push('/')
    expect(bfCtxs).to.length(1)
    expect(bfCtxs[0]).to.have.keys(['to', 'from', 'app', 'next', 'store', 'name'])
    expect(bfCtxs[0].name).to.equal('md1')
    expect(afCtxs).to.length(1)
    expect(bfrCtxs[0]).to.have.keys(['to', 'from', 'app', 'next', 'store', 'name'])
    expect(bfrCtxs[0].name).to.equal('md1')
    expect(afCtxs[0]).to.have.keys(['to', 'from', 'app', 'store', 'name'])
    expect(afCtxs[0].name).to.equal('md1')
  })
})
