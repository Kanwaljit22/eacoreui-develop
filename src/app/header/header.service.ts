import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Injectable, Inject } from '@angular/core';
import { RestApiService } from '../shared/services/restAPI.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { map } from 'rxjs/operators';


@Injectable()

export class HeaderService {
    showReleaseIcon = true;
    constructor(private http: HttpClient, private restApi: RestApiService, private utilitiesService: UtilitiesService,
        private appDataService: AppDataService, private httpClient: HttpClient) {
    }

    fullScreen = false;
    fullScreenView() {
        this.fullScreen = true;
        // setTimeout(() => {
        //     this.utilitiesService.setTableHeight();
        // }, 0);
    }

    exitFullScreenView() {
        this.fullScreen = false;
        // setTimeout(() => {
        //     this.utilitiesService.setTableHeight();
        // }, 0);
    }

    toggleFullScreenView() {
        if (this.fullScreen === false) {
            this.fullScreen = true;
        } else {
            this.fullScreen = false;
        }
        // setTimeout(() => {
        //     this.utilitiesService.setTableHeight();
        // }, 0);
    }

    getFavoriteBookamrks() {

    }

    getAppDetails() {

    }

    getOauthToken() {
        const url = this.appDataService.getAppDomain + 'api/oauth/token';
        return this.http.get(url)
            .pipe(map(res => res));
    }


       getExternalLink() {
        const url = this.appDataService.getAppDomain + 'api/external/link';
        return this.http.get(url)
            .pipe(map(res => res));
    }

}
