import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

// if (environment.production) {
//   enableProdMode();
// }

// Global navigation logging
// const originalNavigate = Router.prototype.navigate;
// Router.prototype.navigate = function (
//   commands: any[],
//   extras?: NavigationExtras
// ) {
//   console.log('Router.navigate called with:', commands, extras); // Log the route and parameters
//   debugger;
//   return originalNavigate.apply(this, [commands, extras]); // Call the original navigate method
// };


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
