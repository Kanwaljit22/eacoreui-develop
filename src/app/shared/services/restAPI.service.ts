
import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config';

@Injectable()

export class RestApiService {
    public uriObj = {
        'summary-view': '/qual/summaryView',
        'user': '/user',
        'bookmark': '/bookmarks?bookmarkType=favorite&limit=5',
        'task-count': '/qual/taskCount',
        'save-task': '/qual/saveQualificationTask',
        'qual-summary': '/qual/details',
        'customer-list': '/qual/header',
        'line-detail': '/qual/lineDetails',
        'summary-view-global': '/qual/summaryView/global'
    };
    constructor(@Inject(APP_CONFIG) private config: AppConfig) {
        const env = this.config.env;
        const apiDomain = this.config.apiDomain;
    }

    getApiPath(path: string) {
        return this.config.apiDomain[this.config.env] + this.uriObj[path];
    }
}
