import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../shared/services/app.data.service';
import { DealListService } from './deal-list/deal-list.service';
import { map } from 'rxjs/operators'


@Injectable()
export class DashboardService {
  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  dashboardObject = { favorites: [], prospectsData: [], proposalCreatedByMeData: [], proposalSharedWithMeData: [], qualCreatedByMe: [] };
  toggleFav = false;
  toggleQualsShared = false;
  prospectsData: any;

  prospectLoader = false;
  qualificationLoader = false;
  proposalLoader = false;
  fullLoader = false;
  dealLoader = false;


  getDealData(showFullList, createdByMe, totalRecords, pageRequested, dealSearchCreteria = null) {
    const reqObj = {
      'userId': this.appDataService.userInfo.userId,
      'currentPageNumber': pageRequested,
      'numberOfRowsPerPage': totalRecords
    };
    if (!showFullList) {
      reqObj['numberOfRowsPerPage'] = 5;
      reqObj['currentPageNumber'] = 1;
    }
    if (dealSearchCreteria !== null) {
      reqObj['currentPageNumber'] = 1;
      reqObj['searchCriteriaList'] = [{ 'searchKey': dealSearchCreteria.searchId, 'searchValue': dealSearchCreteria.searchInput }];
    }

    return this.http.post(this.appDataService.getAppDomain + 'api/partner/myDealsService?createdByMe=' + createdByMe, reqObj)
      .pipe(map(res => res));

    //  return this.http.get('assets/data/dealdata.json')
    //    .pipe(map(res => res));
  }


  getProposalData(isCreatedByMeData: boolean) {

    let methodName = 'created-by-me';
    if (!isCreatedByMeData) {
      methodName = 'shared-with-me';
    }
    const url = this.appDataService.getAppDomain + 'api/dashboard/user/proposals/' + methodName;
    return this.http.get(url)
      .pipe(map(res => res));
    /*return this.http.get('assets/data/dashboardProposals.json')
      .pipe(map(res => res));*/
  }

  getQualData(isCreatedByMeData: boolean) {

    let methodName = 'created-by-me';
    if (!isCreatedByMeData) {
      methodName = 'shared-with-me'
    }
    // const url = this.appDataService.getAppDomain + 'api/dashboard/user/qualifications/' + methodName + '?u=' + this.appDataService.userId;

    const url = this.appDataService.getAppDomain + 'api/dashboard/user/qualifications/' + methodName;
    return this.http.get(url)
      .pipe(map(res => res));
    /*return this.http.get('assets/data/dashboardQualifications.json')
      .pipe(map(res => res));*/

  }

  // getProspectsData() {
  //   return this.http.get('assets/data/prospect.json')
  //     .pipe(map(res => res));
  // }


  getProspectsData(viewType = 'GLOBAL') {
    return this.http.get(this.appDataService.getAppDomain + 'api/dashboard/user/prospects?viewtype=' + viewType)
      .pipe(map(res => res));
  }

  getApprovalPendingProposalCount() {
    return this.http.get(this.appDataService.getAppDomain + 'api/dashboard/user/approvalPendingProposalCount')
      .pipe(map(res => res));
  }


  // getFavorites() {
  //   return this.http.get('assets/data/favoriteprospect.json')
  //     .pipe(map(res => res));
  // }


  getFavorites() {
    return this.http.get(this.appDataService.getAppDomain + 'api/dashboard/user/favorites')
      .pipe(map(res => res));
  }

  getViewProposalForQual(qual) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/users/qual?q=' + qual.id).pipe(map(res => res));
  }

}
