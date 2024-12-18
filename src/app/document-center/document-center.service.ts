import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService } from '../shared/services/app.data.service';
// import { Observable } from 'rxjs/Observable';
import { ProposalDataService } from '../proposal/proposal.data.service';
import { Subject } from 'rxjs';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DocumentCenterService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    })
  };

  headers = new HttpHeaders();
  public fullName: string = '';
  public emailId: string = '';
  comingFromDocCenter: boolean = false;
  documentCenterData: any = [];
  editCustRepEdit$: Subject<boolean> = new Subject<boolean>();
  isLOAUploaded = false;
  loaDocumentTraceID = '';
  LoaSignatureValidDate = '-';
  loaData: any = [];

  // return this.http.get(url, { headers: headers, responseType: 'blob' });
  constructor(private http: HttpClient, private appDataService: AppDataService,
    public proposalDataService: ProposalDataService, public qualService: QualificationsService) { }



  // Set LOA document parameter
  setLOAParam(eachLOA) {

    this.isLOAUploaded = true;
    this.loaDocumentTraceID = eachLOA.documentId;
    this.LoaSignatureValidDate = eachLOA.createdAtStr;
    this.loaData.push(
      {
        'name': eachLOA.name,
        'createdOn': eachLOA.createdAtStr,
        'documentId': eachLOA.documentId
      }
    )
  }

  getDocumentCenterData() {
    return this.http
      .get('../../../assets/data/DocumentCenter/documentCenter.json');
  }

  downloadDoc(api) {
    const file = this.http.get(
      this.appDataService.getAppDomain + api,
      { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }

  getProposalDocsData() {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/document/proposal-documents-data?p=' +
      this.proposalDataService.proposalDataObject.proposalId);
  }

  getProgrammTermIncluded(condition) {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId  + '/force-attach-program-term/' + condition );
  }

  getCheckProgrammTermStatus(){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId  + '/check-program-term-status');
  }

  getLOAData() {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/document/proposal-loa-documents?p=' + this.proposalDataService.proposalDataObject.proposalId);
  }

  
  getIBAssessmentURL() {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + "/service-ib-assessment-punchout");
  }

  // api to get linked sw and services proposals
  getCxLinkedProposalList(proposalId, linkId){
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' + proposalId + "/link-proposals?linkId=" + linkId);
  }


  getTCOComparisonReport(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/tco-comparison', reqJSON);
  }

  getCustomerIBReport(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/ib-summary', reqJSON);
  }

  getCustomerBookingPackage(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/booking-report', reqJSON);
  }

  getProposalIBReport(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/proposal-ib', reqJSON);
  }

  getCustomerProposalReport(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/customer-proposal-package', reqJSON);
  }

  // api to check if program terms is signed or not
  getProgramTermsSignedOrNot() {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/document/program-term-2?proposalId=' +
      this.proposalDataService.proposalDataObject.proposalId).pipe(map(res => res));
  }

  downloadSignedCustomerPackage(api) {
    const file = this.http.get(
      this.appDataService.getAppDomain + api,
      { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }


  initiateDocusign() {

    return this.http.get(
      this.appDataService.getAppDomain + 'api/document/sign/customerPackage?p=' +
      this.proposalDataService.proposalDataObject.proposalId + '&f=1&fcg=1');
  }

  savePartnerDetail(partnerDetail) {

    const reqJSON = {
      // 'userId': this.appDataService.userId,
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
      'partnerName': partnerDetail[1].data,
      'partnerTitle': partnerDetail[2].data,
      'partnerEmail': partnerDetail[3].data,
      'phoneNumber': partnerDetail[4].data,
      'phoneCountryCode': partnerDetail[5].data,
      'dialFlagCode': partnerDetail[6].data,
    };
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/mspPartnerContact', reqJSON);
  }

  resetPartnerDetail() {

    const reqJSON = {
      // 'userId': this.appDataService.userId,
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
    };
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/mspPartnerContact', reqJSON);
  }


  uploadAdditionalDoc(file, json) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('isSigned', json.isSigned);

    // formdata.append('userId',json.userId);
    formdata.append('proposalId', json.proposalId);
    formdata.append('type', 'customerPackage');
    formdata.append('uploadType', json.uploadType);
    formdata.append('userName', json.userName);
    formdata.append('loaIncluded', json.loaIncluded);
    formdata.append('uploadLegalPackage', json.uploadLegalPackage);
    formdata.append('manualLegalPackageSignedDateStr', json.manualLegalPackageSignedDateStr);


    return this.http.post(this.appDataService.getAppDomain + 'api/document/upload/additional', formdata);
  }

  uploadLOADoc(file, json) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('isSigned', json.isSigned);

    // formdata.append('userId',json.userId);
    formdata.append('proposalId', json.proposalId);
    formdata.append('type', 'customerPackage');
    formdata.append('uploadType', json.uploadType);
    formdata.append('userName', json.userName);
    formdata.append('manualLoaSignedDateStr', json.manualLoaSignedDateStr);

    return this.http.post(this.appDataService.getAppDomain + 'api/document/upload/loa', formdata);
  }


  deleteDoc(documentId, dt) {
    return this.http.delete(
      this.appDataService.getAppDomain + 'api/document/additional/customerPackage?u=' +
      this.appDataService.userId + '&p=' + this.proposalDataService.proposalDataObject.proposalId + '&dt=' + dt + '&did=' + documentId);
  }


  deleteLOA(documentId) {
    return this.http.get(
      this.appDataService.getAppDomain + 'api/document/partner/delete?proposalId=' +
      this.proposalDataService.proposalDataObject.proposalId + '&documentId=' + documentId);
  }

  updateFromWhoInvolvedModal(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/document/custrep', reqJSON);
  }


  updateFromLOAWhoInvolvedModal(reqJSON) {
    return this.http.post(
      this.appDataService.getAppDomain + 'api/partner/loa-contact?' + 'partnerBeGeoId=' +
      this.qualService.loaData.partnerBeGeoId + '&customerGuId=' + this.qualService.loaData.customerGuId, reqJSON);
  }

  // api to call link/delink for loaCustomerQuestion selected
  loaCusotmerQuestion(selected) {
    let selection = 'LINK';
    if (!selected) {
      selection = 'DELINK';
    }
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId + '/special-loa-signing/' + selection);
  }

  getClarificationsData(clarificationMode){
    if(clarificationMode === 'clarificationsTab'){
      return this.http.get(
        this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/loa/language-clarifications');
    } else {
      return this.http.get(
        this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/loa/non-std-modifications');
    }  
  }

  saveClarification(clarificationMode,selectedIds){
    const response = { "data": selectedIds};
    if(clarificationMode === 'clarificationsTab'){
      return this.http.post(
        this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/loa/language-clarifications',response);
    } else {
      return this.http.post(
        this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/loa/non-std-modifications',response);
    }
  }

  noDocumentChangeNeeded(){
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId + '/noDocumentChangeNeeded');
  }

  alreadyObtainedLOA(){
    return this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId + '/negotiationCompleted');
  }

  addCustomerContact(reqJSON) {
    return this.http.post(
      this.appDataService.getAppDomain + 'api/qualification/' + 
      this.qualService.qualification.qualID + '/add-additional-customer-contact', reqJSON);
  }

  updateCustomerContact(reqJSON) {
    return this.http.post(
      this.appDataService.getAppDomain + 'api/qualification/' + 
      this.qualService.qualification.qualID + '/update-additional-customer-contact', reqJSON);
  }

  deleteCustomerContactInfo(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/document/delete-custrep', reqJSON);
  }

  deleteCustomerContact(reqJSON) {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: reqJSON
    };
    return this.http.delete(
      this.appDataService.getAppDomain + 'api/qualification/' + 
      this.qualService.qualification.qualID+ '/delete-additional-customer-contact', httpOptions);
  }
}
