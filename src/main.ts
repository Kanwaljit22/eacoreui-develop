import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';

import { LicenseManager } from '@ag-grid-enterprise/core';
import { EaModule } from 'ea/ea.module';
// tslint:disable-next-line:max-line-length
// LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_for_Production_1Devs15_November_2017__MTUxMDcwNDAwMDAwMA==3c862d06679ff2da4f8d4ac677bff980');

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('Intelligaia_India_Connected_Experience_Single_Application_1_Devs__9_January_2021_[v2]_MTYxMDE1MDQwMDAwMA==f53d474701d7f08007da35bcd0db37ee');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(EaModule)
  .catch(err => console.log(err));
