import Vue, {ComponentOptions} from 'vue'
import Router from 'vue-router'
import {Store} from 'vuex'

export interface Context<A, S, V extends Vue = Vue> {
  app: ComponentOptions<V> & A
  store: Store<S>
  router: Router
}
