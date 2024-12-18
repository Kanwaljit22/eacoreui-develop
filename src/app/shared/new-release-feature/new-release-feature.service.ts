import { Injectable, OnInit } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class NewReleaseFeatureService implements OnInit {

  allReleaseData = [];
  versions = [];
  latestRelease: any;

  constructor(private http: HttpClient, private appDataService: AppDataService, public localeService: LocaleService) { }

  ngOnInit() {
  }

  getAllRelease() {
    return this.http.get(this.appDataService.getAppDomain + 'api/release-note/all')
      .pipe(map(res => res));
  }

  getAllVersions() {
    for (let i = 0; i < this.allReleaseData.length; i++) {
      this.versions.push({ 'releaseName': this.allReleaseData[i].pageHeader, 'title': this.allReleaseData[i].title });
      if (this.allReleaseData[i].latest) {
        this.latestRelease = this.allReleaseData[i];
      }
    }
    return this.versions;
  }

  getRelease() {
    return this.http.get(this.appDataService.getAppDomain + 'api/release-note/all')
      .pipe(map(res => res));
  }

  changeRelease(version) {
    return this.allReleaseData.find(release => release.pageHeader === version.releaseName);
  }

  hideReleaseNote() {
    return this.http.get(this.appDataService.getAppDomain + 'api/release-note/hide')
      .pipe(map(res => res));
  }
}
