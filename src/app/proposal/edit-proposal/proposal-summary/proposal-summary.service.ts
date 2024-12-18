import { Injectable, EventEmitter } from '@angular/core';
import { AppDataService } from '../../../shared/services/app.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListProposalService } from '../../list-proposal/list-proposal.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ReOpenComponent } from '@app/modal/re-open/re-open.component';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { TcoDataService } from '@app/tco/tco.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ProposalSummaryService {

  reqJSON: any = {};
  suitesData: string = "";
  tcvSummaryData: any = [];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  roadMapEmitter = new EventEmitter<any>();
  subscribers: any = {};
  showFinancialSummary = false;
  purchaseOptionsEmitter = new EventEmitter<any>();
  showCiscoEaAuth = false;

  constructor(private http: HttpClient, private appDataService: AppDataService,
    private listProposalService: ListProposalService, private messageService: MessageService, public constantsService: ConstantsService, private modalVar: NgbModal,
    private proposalDataService: ProposalDataService, public permissionService: PermissionService,
    private tcoDataService: TcoDataService, public qualService: QualificationsService,
    private createProposalService: CreateProposalService) { }

  getSummary(proposalId) {

    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/summary?p=' + proposalId)
      .pipe(map(res => res));
  }


  checkBricCountryThreshold(selected){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+this.proposalDataService.proposalDataObject.proposalId+'/BRIC-country-threshold?s=' + selected)
      .pipe(map(res => res));
  }
  // unsubscribe after repopenoing qualification
  unSubscribe() {
    if (this.subscribers.roadMapEmitter) {
      this.subscribers.roadMapEmitter.unsubscribe();
    }
  }
  // for request approval api for sending approval request to the approver
  requestApproval() {
    return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/security-exception-notification-request")
      .pipe(map(res => res));
  }

  shareWithDistributor(share){
    if(share){
      return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/status-with-distributor/SHARED")
      .pipe(map(res => res));
    } else {
      return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/status-with-distributor/UNSHARED")
      .pipe(map(res => res));
    }
  }


  sendBillToId(billToId){   
      return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/create-hardware-quote?billto="+billToId)
      .pipe(map(res => res));
  }


  getPurchaseOptions() {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/purchase-authorization?d=' + this.qualService.qualification.dealId);
  }

  getPurchaseOptionsForSelectedPartner(selectedPartnerId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/'+selectedPartnerId+'/purchase-authorization?d=' + this.qualService.qualification.dealId);
  }

  getPurchaseOptionsDataForSelectedPartner(selectedPartnerId) {
    this.showCiscoEaAuth = false;
    if(selectedPartnerId){
      this.showCiscoEaAuth = true;
    }
    this.getPurchaseOptionsForSelectedPartner(selectedPartnerId).subscribe(
      (response: any) => {
        if (response && response.data && !response.error) {
          this.appDataService.isPurchaseOptionsLoaded = true;
          this.appDataService.purchaseOptiponsData = response.data;
          this.purchaseOptionsEmitter.emit(); // to emit after purchaseOptions api called and data is set
        } else {
          this.appDataService.purchaseOptiponsData = {};
          this.appDataService.isPurchaseOptionsLoaded = false;
          this.messageService.displayMessagesFromResponse(response);
        }        
      }
    );
  }

  getShowCiscoEaAuth(){
    //this.showCiscoEaAuth = false;
    this.createProposalService.partnerAPI(this.qualService.qualification.qualID).subscribe((res: any) => {
      if (res && !res.error && res.data) { 
        //if (this.primaryPartners.length === 1 && !this.isRenewalFlow) {
        if (res.data.length > 0){
            const selectedPartnerId = this.proposalDataService.proposalDataObject.proposalData.partner.partnerId;
            if (!this.appDataService.isPurchaseOptionsLoaded){ // check if already data loaded or not and call api
              this.getPurchaseOptionsDataForSelectedPartner(selectedPartnerId); 
            } 
        }
      }
    });
  }
 
  getPurchaseOptionsData() {
    this.getPurchaseOptions().subscribe(
      (response: any) => {
        if (response && response.data && !response.error) {
          this.appDataService.isPurchaseOptionsLoaded = true;
          this.appDataService.purchaseOptiponsData = response.data;
          this.purchaseOptionsEmitter.emit(); // to emit after purchaseOptions api called and data is set
        } else {
          this.appDataService.purchaseOptiponsData = {};
          this.appDataService.isPurchaseOptionsLoaded = false;
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }
  reopenProposal() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 're-open';
    const modalRef = this.modalVar.open(ReOpenComponent, ngbModalOptionsLocal);
    modalRef.result.then((result) => {
      if (result.continue === true) {
        // this.createProposalService.updateProposalStatus();
        this.updateProposalStatusOnReopen(this.constantsService.IN_PROGRESS_STATUS).subscribe((res: any) => {
          if (res && !res.error && res.data) {
            // if proposal data has permissions and not empty assign to the value else set to empty map
            if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
              this.permissionService.proposalPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
            } else {
              this.permissionService.proposalPermissions.clear();
            }

            // Set local permission for debugger
            this.permissionService.isProposalPermissionPage(true);

            // console.log(this.permissionService.proposalPermissions, this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit), this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen));
            //this.permissionService.proposalReOpen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
            this.permissionService.proposalEdit = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit);
            this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.proposalPermissions.has(PermissionEnum.PurchaseAdjustmentPermit);

            // set tco create access for tco 
            this.tcoDataService.tcoCreateAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) ||
            this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
            this.appDataService.roadMapPath = false;
            this.appDataService.subHeaderData.subHeaderVal[4] = res.data.status;
            this.proposalDataService.proposalDataObject.proposalData.status = res.data.status;
            this.proposalDataService.isProposalReopened = true;
            // set the value of roadMap in emitter for all other pages using subscribe
            this.roadMapEmitter.emit(this.appDataService.roadMapPath);
            if (this.appDataService.subHeaderData.subHeaderVal[6]) {//halinkedProposals
              this.appDataService.updateCrossArchitectureProposalStatusforHeader(res.data.status);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }
  updateProposalStatus(json) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/save', json)
      .pipe(map(res => res));
  }

  copyProposal() {
    let proposalId: any;

    this.listProposalService.copyProposal(proposalId).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          //  this.getProposalList();
          console.log('proposal copied');
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      }
    });
  }


  updateProposalStatusOnReopen(status) {
    //return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/'+ status).pipe(map(res => res));
    let url = this.appDataService.getAppDomain + 'api/proposal/';
    url += this.proposalDataService.proposalDataObject.proposalId + '/status?s=' + status;
    return this.http.post(url, {})
      .pipe(map(res => res));
  }

  // Added for save&confirm api to call completion/success page 
  saveAndConfirmProposal(complete) {
    let url = this.appDataService.getAppDomain + 'api/proposal/';
    url += this.proposalDataService.proposalDataObject.proposalId + '/complete';
    return this.http.post(url, {})
      .pipe(map(res => res));
  }

  splitProposal(proposalId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/split'
    ).pipe(map(res => res));
  }

  // http://localhost:8080/eaprospect/api/proposal/10064/initiate-exception-request
  // method to call initiate exception request api
  initiateExceptionRequest() {
    let url = this.appDataService.getAppDomain + 'api/proposal/';
    url += this.proposalDataService.proposalDataObject.proposalId + '/initiate-exception-request';
    return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/initiate-exception-request")
      .pipe(map(res => res));
  }

  // http://localhost:8080/eaprospect/api/proposal/submit-exception-request
  // method to call submit exception request api
  submitExceptionRequest(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + "api/proposal/submit-exception-request", requestObj)
      .pipe(map(res => res));
  }

  //http://localhost:8080/eaprospect/api/proposal/9711/withdrawRequest
  // method to call withdraw exception api
  withDrawException() {
    return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/withdrawRequest")
      .pipe(map(res => res));
  }

  approverHistory() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/approverHistory').pipe(map(res => res));
  }

  // api to get group level approval history data
  groupLevelApproverHistory() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/approver-history').pipe(map(res => res));
  }
}
