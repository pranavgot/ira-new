// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
/*Allow CORS*/
// app.use(function(req, res, next) {
 
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization,X-Authorization'); 
// 	res.setHeader('Access-Control-Allow-Methods', '*');
// 	res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
// 	res.setHeader('Access-Control-Max-Age', '1000');
	  
// 	next();
// });
export const environment = {
  production: false,
  redirect_URL:'http://localhost:4200',
  Masters_URL: `https://devriaapi.ibridgets.com/RIA_CMN_MSTR/ria/`,
  devUrl: 'https://devriaapi.ibridgets.com/RIA_CMN_USER',
  solution_URL:'https://devriaapi.ibridgets.com/RIA_SOLUTION_BOARD',
  Power_URL:'https://devriaapi.ibridgets.com/POWER_BI',
  adUrl:'http://localhost:4200',
};
// Power_URL: 'http://10.40.230.248:9197',

// devUrl: 'http://10.40.230.112:9191',
// export const environment = {
//   production: false,
//   redirect_URL:'http://localhost:4200',
//   Masters_URL:`https://uatria.ibridgets.com/RIA_CMN_MSTR/ria/`,
//   devUrl:'https://uatria.ibridgets.com/RIA_CMN_USER',
//   solution_URL:'https://uatria.ibridgets.com/RIA_SOLUTION_BOARD',
//   Power_URL:'https://uatria.ibridgets.com/POWER_BI',
//   adUrl:'http://localhost:4200',


// };
  // Masters_URL:`http://3.6.47.176:8080/RIA_CMN_MSTR/ria/`,
  // devUrl:'http://3.6.47.176:8080/RIA_CMN_USER',
  // solution_URL:'http://3.6.47.176:8080/RIA_SOLUTION_BOARD/',
  // local_URL: 'http://10.40.230.123:9191/ria/',
  // solution_URL:'http://10.40.230.131:9193/'
    //  https://devriaapi.ibridgets.com/POWER_BI/pushdataset

  // solution_URL: 'http://10.40.230.65:9194/RIA_SOLUTION_BOARD',
  // devUrl: 'http://10.40.230.65:9191',
  // devUrl: 'http://10.40.230.123:9191',
  // Masters_URL: `http://10.40.230.204:9192/ria/`,
  // local_URL: 'http://10.40.230.123:9191/ria/',
// export const environment = {
//   production: false,
//   redirect_URL:'https://uatria.ibridgets.com',
//   Masters_URL:`https://uatriaapi.ibridgets.com/RIA_CMN_MSTR/ria/`,
//   devUrl:'https://uatriaapi.ibridgets.com/RIA_CMN_USER',
//   solution_URL:'https://uatriaapi.ibridgets.com/RIA_SOLUTION_BOARD',
//   Power_URL:'https://uatriaapi.ibridgets.com/POWER_BI',
//   adUrl:'https://uatria.ibridgets.com'

// };
// https://uatriaapi.ibridgets.com/RIA_CMN_MSTR/swagger-ui.html
// https://uatria.ibridgets.com/
// https://uatria.ibridgets.com/
// http://3.6.47.176:8080/RIA_CMN_MSTR/ria/ProcessMaster/getProcess
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
