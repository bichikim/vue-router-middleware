/* tslint:disable:callable-types */
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $env: Project.ENV
  }
}

declare module 'vue/types/options' {
  // noinspection TsLint
  interface ComponentOptions<V extends Vue> {
    middleware?: string
    layout?: string
    env?: Project.ENV
  }
}
