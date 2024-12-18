import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  env: any;
  apiDomain: any;
}

export const APP_DI_CONFIG: AppConfig = {
  'env': 0,
  'apiDomain': [
    '',
    'http://private-2469c-ce21.apiary-mock.com',
    'http://localhost:8080',
    'https://crleadership-dev.cloudapps.cisco.com/CEREWARD_API',
    'https://crleadership-stg.cloudapps.cisco.com/CEREWARD_API',
    'https://crleadership.cloudapps.cisco.com/CEREWARD_API',
    'https://crleadership-lt.cloudapps.cisco.com/CEREWARD_API',
    'http://celeadership.cloudapps.cisco.com/CEREWARD_API',
    'https://crsfdc-stg.cloudapps.cisco.com/CEREWARD_API'
  ],
};

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})

export class AppConfigModule { }
