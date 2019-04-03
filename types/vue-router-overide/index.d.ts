
declare module 'vue-router/next' {
  import {RawLocation} from 'vue-router'
  import Vue from 'vue`'

  export type Next<V extends Vue = Vue> =
    (to?: RawLocation | false | ((vm: V) => any) | undefined) => void
}
