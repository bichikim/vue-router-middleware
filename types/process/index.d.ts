/* tslint:disable:interface-name no-namespace */

declare namespace NodeJS {

  export interface Process {
  }

  export interface ProcessEnv {
    readonly ENV: Project.ENV

    readonly PORT?: string

    /**
     * A path to router layout folder
     * @default 'layouts'
     */
    readonly LAYOUTS_PATH?: string

    /**
     * Middleware folder name
     * @default 'middleware'
     * @see ./src/utils/middleware
     */
    readonly MIDDLEWARE_PATH?: string

    /**
     * Running mode
     * @default 'production'
     * @see ./build/webpack.base.js
     */
    readonly NODE_ENV?: 'production' | 'development'

    /**
     * Router mode
     * @default 'history'
     * @see ./src/router.ts
     */
    readonly ROUTER_MODE?: 'history'

    /**
     * Webpack alias for the src
     * @default '@'
     * @see ./build/webpack.base.config.js
     */
    readonly SRC_ALIAS?: string

  }
}
