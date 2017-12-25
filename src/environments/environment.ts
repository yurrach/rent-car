// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBb4IvTgj_szibI7EUtialQ0Xp2AKKSiUE',
    authDomain: 'rentcar-dev.firebaseapp.com',
    databaseURL: 'https://rentcar-dev.firebaseio.com',
    projectId: 'rentcar-dev',
    storageBucket: 'rentcar-dev.appspot.com',
    messagingSenderId: '638006894157'
  }
};
