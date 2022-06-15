// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "https://localhost:7083/",
  apiAuthUrl: "https://localhost:7083/api/authmanagement/",
  apiItemsUrl: "https://localhost:7083/api/items/",
  apiMonthsUrl: "https://localhost:7083/api/months/",
  apiSetupUrl: "https://localhost:7083/api/setup/"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
