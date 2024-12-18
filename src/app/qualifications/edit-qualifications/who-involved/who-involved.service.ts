import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { map } from 'rxjs/operators';

@Injectable()
export class WhoInvolvedService {

  static readonly METHOD_ADD_CONTACT = 'addContact';

  static readonly METHOD_REMOVE_CONTACT = 'removeContact';

  static readonly METHOD_UPDATE_CONTACT = 'updateContact';

  static readonly NOTHING_TO_UPDATE = 'No changes found in qualification name and description.';

  static readonly TYPE_EST = 'EST';

  static readonly TYPE_SSP = 'SSP';

static readonly TYPE_DISTI = 'DISTI';

static readonly TYPE_CXSP = 'CX_SP';
static readonly TYPE_CX_ASSURERS = 'ASSURERS_TEAMS';
  

  static readonly TYPE_CAM = 'CAM';

  static readonly TYPE_PT = 'PT';

  xhttp: XMLHttpRequest;

  isResponseReady = false;


  previouslySelectedSpecialist = [];
  checkedCategories = [];

  suggestionsArrFiltered = [];
  suggestionsArrSpecialistFiltered = [];
  partnerSuggestionsArrFiltered = [];



  constructor(private http: HttpClient, private appDataService: AppDataService, public qualService: QualificationsService) { }


  getSpecialistData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/lookup/contacts?t=SSP')
      .pipe(map(res => res));
  }

  getCamData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/cam?d=' + this.qualService.qualification.dealId)
      .pipe(map(res => res));
  }

  getCamLocatorUrl() {
    return this.http.get(this.appDataService.getAppDomain + 'api/qualification/camLocatorUrl')
      .pipe(map(res => res));
  }

  /*lookUpUser(term) {
    return this.http.get(this.appDataService.getAppDomain + 'api/lookup/user?s='+ term)
      .pipe(map(res => res));
  }*/
  getCountryOfTransactions(qualId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/countries?qualId='+ qualId)
        .pipe(map(res => res));
}
getStateList(country) {
  return this.http.get(this.appDataService.getAppDomain + 'api/proposal/getStateLov?country='+ country)
      .pipe(map(res => res));
}

  lookUpUser(term) {
    if (this.xhttp) {
      this.xhttp.abort();
    }
    this.xhttp = new XMLHttpRequest();
    const url = this.appDataService.getAppDomain + 'api/lookup/user?s=' + term;
    this.xhttp.open('GET', url, true);
    this.xhttp.overrideMimeType('application/json');
    this.xhttp.setRequestHeader('content-type', 'application/json');
    this.xhttp.responseType = 'json';
    let response;
    this.xhttp.onreadystatechange = () => {
      if (this.xhttp.readyState === 4 && this.xhttp.status === 200) {
        this.suggestionsArrFiltered = this.xhttp.response.data;
      }
    };

    this.xhttp.send();
    if (response) {
      return response;
    }
  }

  searchPartnerAPI(qualId, partnerString) {
    const url = this.appDataService.getAppDomain + 'api/partner/team/search-add?q=' + qualId + '&p=' + partnerString;
    return this.http.get(url)
      .pipe(map(res => res));
  }
  removePartnerAPI(qualId, removeVal) {
    const url = this.appDataService.getAppDomain + 'api/qualification/partner-team?q=' + qualId + '&p=' + removeVal;
    return this.http.delete(url)
      .pipe(map(res => res));
  }
  contactAPICall(methodName: string, qualId, requestObj, type, userId) {
    const url = this.appDataService.getAppDomain + 'api/qualification/' + methodName + '?qualId=' + qualId + '&type=' + type;
    return this.http.post(url, requestObj)
      .pipe(map(res => res));
  }
  // api to update partner to notify email/webex/accessType
  updatePartnerAPI(qualId, requestObj, proposalId?) {
    let url = ''
    if(proposalId){ 
      url = this.appDataService.getAppDomain + 'api/qualification/partner-team?qualId=' + qualId + '&proposalId=' + proposalId;
    } else {
      url = this.appDataService.getAppDomain + 'api/qualification/partner-team?qualId=' + qualId;
    }
    return this.http.post(url, requestObj)
      .pipe(map(res => res));
  }
  updateAllPartnerAPI(qualId, email, webex, walkme) {
    const url = this.appDataService.getAppDomain + 'api/qualification/partner-team/notification?q=' + qualId + '&e=' + email + '&w=' + webex + '&wm=' + walkme;
    return this.http.get(url)
      .pipe(map(res => res));
  }
  /*
  * This method will prepare a request data for add,remove and update contact call
  */
  prepareRequestData(salesRequest, estAccessType, notification, webexNotification, notifyByWelcomeKit) {
    const requestObj = [];
    if (salesRequest && salesRequest.length > 0) {
      const size = salesRequest.length;
      for (let i = 0; i < size; i++) {
        const salesObj = salesRequest[i];
        if (salesObj.cam) {
          const reqData = {
            'name': salesObj.fullName,
            'firstName': salesObj.firstName,
            'lastName': salesObj.lastName,
            'email': salesObj.email,
            'ccoId': salesObj.ccoId,
            'access': estAccessType,
            'notification': notification ? 'Yes' : 'No',
            'webexNotification': webexNotification ? 'Y' : 'N',
            'notifyByWelcomeKit': notifyByWelcomeKit ? 'Y' : 'N',
            'archname': AppDataService.ARCH_NAME,
            'cam': salesObj.cam
          };
          requestObj.push(reqData);
        } else {
          const reqData = {
            'name': salesObj.fullName,
            'email': salesObj.email,
            'ccoId': salesObj.ccoId,
            'access': estAccessType,
            'notification': notification ? 'Yes' : 'No',
            'webexNotification': webexNotification ? 'Y' : 'N',
            'notifyByWelcomeKit': notifyByWelcomeKit ? 'Y' : 'N',
            'archname': AppDataService.ARCH_NAME,
            'cam': salesObj.cam
          };
          requestObj.push(reqData);
        }
      }
    }
    return requestObj;

  }

  uploadPdfFile(file, qualId, affiliateNames) {
    const formdata: FormData = new FormData();

    if (file && file.name && file.name.length > 0) {
      formdata.append('file', file);
    }
    formdata.append('qualId', qualId);

    if (affiliateNames && affiliateNames.length > 0) {
      formdata.append('affiliateNames', affiliateNames);
    } else {
      formdata.append('affiliateNames', '');
    }

    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/saveAffiliate', formdata)
      .pipe(map(res => res));
  }

  removeFile() {
    return this.http.delete(this.appDataService.getAppDomain + 'api/qualification/deletefile?qualId=' + this.qualService.qualification.qualID)
      .pipe(map(res => res));
  }

}
