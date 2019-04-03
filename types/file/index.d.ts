// declare file extension should be here
declare module '*.json' {
  const value: {[name: string]: any}
  export default value
}

declare module '*.styl' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.vue' {
  import {VueConstructor} from 'vue'
  const vue: VueConstructor
  export default vue
}
