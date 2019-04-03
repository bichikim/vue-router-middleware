/* tslint:disable:no-namespace */
declare namespace Project {
  export interface ENVFirebase {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
  }

  export interface ENV {
    firebase: ENVFirebase
  }
}
