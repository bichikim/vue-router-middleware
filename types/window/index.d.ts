/* tslint:disable:interface-name */
import Vue from 'vue'
declare global {
  declare interface Window {
    __vue: Vue
  }
}

declare interface URL {
  createObjectURL: (object: any) => string
}
