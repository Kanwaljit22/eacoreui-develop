import { VnextService } from './../../vnext.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../project.service';
import { SubsidiariesStoreService, ICavDetails, ICustomerBU } from './subsidiaries.store.service';
import { IMasterAggreementDetails, ProjectStoreService } from '../project-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-subsidiaries',
  templateUrl: './subsidiaries.component.html',
  styleUrls: ['./subsidiaries.component.scss'],
  providers: [MessageService]
})
export class SubsidiariesComponent implements OnInit, OnDestroy {


 subsidiariesArr = [];
 showExpandAll: boolean;
 selectAllCustomerName = true;
 selectAllCustomerBu = true;
 cavDetails:Array<ICavDetails> = [];
 firstLevelCavDetails:ICavDetails;
 masterAggreementDetails: IMasterAggreementDetails = {}; // to set masterAggreeement details
 selectedBuCount = 0;
 bpIDList = [];
 allBpIDs = [];
 start = 0;
  start_max = 0;
 show = 3;
 viewIndex = 0;
 selectedBpID: any;
 @Input() isChangeSubFlow = false;
 @Output() onClose = new EventEmitter();
 isAllowCreateBpId = false;
 @Input() isBpIdSwitchComplete = false; // set to true if swithced to any existing bpid
 subscribers: any = {};
 isShowMessageForBuSelection = false; // set if no bus are selected for the cav
 @Input() isPartnerAccessingSfdcDeal = false; // set if partner accessing sfdc deal
 nextTfDate:string = "";
 alreadyPurchasedDetails:boolean = false;
 isExistingIdSelected = false;

  constructor(public projectService: ProjectService,
    private vnextService:VnextService,private subsidiariesStoreService:SubsidiariesStoreService, private messageService: MessageService, public projectStoreService: ProjectStoreService, private eaRestService: EaRestService,
    public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService, private constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.loadSubsidiaries();
    this.subscribers.refreshSubsidiariesSubject = this.projectStoreService.refreshSubsidiariesSubject.subscribe((action: any) => {
      this.loadSubsidiaries();
    });
    this.subscribers.isModifyScopeSelection = this.projectService.isModifyScopeSelection.subscribe((data: any) => {
      if (data) {
        this.isAllowCreateBpId = true;
        this.isExistingIdSelected = true;
        this.getBpIds();
      }
    })
  }

  loadSubsidiaries(){
    this.projectStoreService.blurSubsidiaries = false; 
    this.getCavDetails(); 
    if(this.eaService.features?.EAID_REL){
      this.checkToAllowCreateBpId();
    }
  }

  checkToAllowCreateBpId(){
    if(this.projectService.isReturningCustomer(this.projectStoreService.projectData?.scopeInfo) && !this.isChangeSubFlow && !this.projectStoreService.projectData?.scopeInfo?.eaidSelectionComplete){
      this.isAllowCreateBpId = true;
    } else {
      this.isAllowCreateBpId = false;
    }
  }

  ngOnDestroy() {
    this.projectStoreService.blurSubsidiaries = false;
    this.isBpIdSwitchComplete = false;
    if(this.subscribers.refreshSubsidiariesSubject){
      this.subscribers.refreshSubsidiariesSubject.unsubscribe();
    }
    if(this.subscribers.isModifyScopeSelection){
      this.subscribers.isModifyScopeSelection.unsubscribe();
    }
  }

  getBpIds() {
    const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/master-agreement-detail?a=MULTIPLE_EAIDS';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      this.projectStoreService.blurSubsidiaries = true;
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.allBpIDs = response.data;
        if(this.allBpIDs?.length === 1 && (this.allBpIDs[0].eaId === this.projectStoreService.projectData?.scopeInfo?.masterAgreementId) ){
          this.selectedBpID = this.allBpIDs[0];
          this.selectBpId(this.selectedBpID);
        }
        this.show = this.show < this.allBpIDs.length ? this.show : this.allBpIDs.length;
        this.bpIDList = this.allBpIDs;
        if (this.allBpIDs.length < this.show || this.allBpIDs.length === this.show) {
          this.start_max = 0;
        } else {
          const floor = Math.floor(this.allBpIDs.length / 3);
          this.start_max = ((this.allBpIDs.length % this.show) === 0) ? floor - 1 : floor;
        }
      }
    })
  }

  selectedId($event) {
    if ($event.eaId) {
      this.selectBpId($event);
    } else {
      this.alreadyPurchasedDetails = false;
      this.selectedBpID = {};
    }
  }
  
  openBpIdDetail($event) {
    this.openBpIdDetails($event);
  }

  moveRight() {
    if (this.start === this.start_max) {
      return;
    }
    this.start++;
    this.viewIndex =  this.viewIndex + 2
    this.setPosition();
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    this.viewIndex =  this.viewIndex - 2
    this.setPosition();
  }

  setPosition() {
   let showOffers = this.allBpIDs;
   showOffers = showOffers.slice(this.viewIndex, this.viewIndex+3);
   this.bpIDList = showOffers;
  }

  expandAll() {
    this.showExpandAll = false;
    this.subsidiariesArr.forEach((row) =>  row.expand = true);
  }

  collapseAll() {
    this.showExpandAll = true;
    this.subsidiariesArr.forEach((row) => row.expand = false)
  }

  expandBu(val) {
    val.expand = !val.expand;
    this.showExpandAll = this.subsidiariesArr.every((row) => {
      return row.expand? false : true;
    });
  }

  selectAllCustomerNames() {
   this.selectAllCustomerName = !this.selectAllCustomerName ;
   this.subsidiariesArr.forEach((row) => row.customerNameChecked = this.selectAllCustomerName? true : false)
  }

  selectAllCustomerBus() {
    this.selectAllCustomerBu = !this.selectAllCustomerBu ;
    this.subsidiariesArr.forEach((row) => row.customerBuChecked = this.selectAllCustomerBu? true : false)
    for(let i =0; i < this.subsidiariesArr.length; i++) {
      this.subsidiariesArr[i].buArr.forEach((row) => row.checked = this.selectAllCustomerBu? true : false)
    }
  }

  selectCustomer(val) {
    val.customerNameChecked = !val.customerNameChecked;
    this.selectAllCustomerName = this.subsidiariesArr.every((row) => {
      return row.customerNameChecked ? true : false;
    });
  }

  selectBu(val, customer) {
    if(customer === this.localizationService.getLocalizedString('create-project.subsidiaries.BU')) {
      val.checked = !val.checked;
    } else {
      val.customerBuChecked = !val.customerBuChecked;
    }
    let customerBuSelected;
    let customerNameSelected;
    customerNameSelected = this.subsidiariesArr.every((row) => {
      return row.customerBuChecked ? true : false;
    });
    for(let i = 0; i < this.subsidiariesArr.length; i++) {
       customerBuSelected = this.subsidiariesArr[i].buArr.every((row) => {
        return row.checked ? true : false;
      });
    }
    this.selectAllCustomerBu = (customerNameSelected && customerBuSelected) ? true : false;
  }

  showAllSites(customerBu) {
    this.projectService.showSitesAssociated = true;
    this.subsidiariesStoreService.buId = customerBu.buId;
    this.subsidiariesStoreService.bu = customerBu;
    this.isShowMessageForBuSelection = false;
  }

  private getCavDetails(){ 
    const url  = this.vnextService.getAppDomainWithContext + 'project/'+ this.projectStoreService.projectData.objId +'/cav';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if(this.vnextService.isValidResponseWithData(response, true)) {
        try {
          this.cavDetails = response.data;
          this.getDealCrPartyBU();
          this.subsidiariesStoreService.subsidiariesData = response.data;
          if (this.cavDetails[0].cavName) {
            this.subsidiariesStoreService.cavName = this.cavDetails[0].cavName;
          }
          if (response.data[0].bus){
            this.setBusSelectedDefault(this.subsidiariesStoreService.subsidiariesData[0].bus);
          }
          // check if bus from cav selected and allow next best actions when neweaidcreated
          if(this.eaService.features.EAID_REL && this.projectService.isNewEaIdCreatedForProject) {
            if(this.selectedBuCount > 0){
              this.isShowMessageForBuSelection = false;
            } else {
              this.isShowMessageForBuSelection = true;
            }
            this.projectService.updateNextBestOptionsSubject.next({ key: 'isCavAdded', value: this.selectedBuCount > 0 ? true : false });
          } else {
            this.projectService.updateNextBestOptionsSubject.next({ key: 'isCavAdded', value: true });
          }
          // check if returning customer them get masterAggreement details and blur subsidiaries selection on UI
          if (this.projectStoreService.projectData.scopeInfo && this.projectStoreService.projectData.scopeInfo.returningCustomer && !this.projectStoreService.projectData.scopeInfo?.newEaidCreated && !this.projectStoreService.isEMSMsgDisplayed) {
            this.projectStoreService.lockProject = true;
            if(this.eaService.features.EAID_REL){
              if(this.isAllowCreateBpId){
                this.getBpIds();
              } else {
                this.getMasterAggreementDetails();
              }
            } else {
              this.getMasterAggreementDetails();
            }
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response)
      }
    });
}

getDealCrPartyBU(){
  this.firstLevelCavDetails = {};
  this.firstLevelCavDetails.cavId = this.cavDetails[0].cavId;
  this.firstLevelCavDetails.cavName = this.cavDetails[0].cavName;
  this.firstLevelCavDetails.selected = true;
  for(let bu of this.cavDetails[0].bus){
    // check for new eaid project set dealcrparty bu if selected
    if(this.projectService.isNewEaIdCreatedForProject && this.eaService.features.EAID_REL){
      this.firstLevelCavDetails.bus = new Array<ICustomerBU>();
      const selectedbus = this.cavDetails[0].bus.filter(bu => (bu?.selected === 'F' || bu?.selected === 'P'))
      const defaultBU = selectedbus.find(bu => bu.dealCrPartyBU && (bu?.selected === 'F' || bu?.selected === 'P'));
      if(defaultBU){
        this.firstLevelCavDetails.bus.push(defaultBU);
      } else {
        this.firstLevelCavDetails.bus.push(selectedbus[0]);
      }
    } else {
      if(bu.dealCrPartyBU){
        this.firstLevelCavDetails.bus = new Array<ICustomerBU>();
        this.firstLevelCavDetails.bus.push(bu);
        break;
      }
    }
  }
  if(!this.firstLevelCavDetails.bus){
    this.firstLevelCavDetails.bus = new Array<ICustomerBU>();
    // check for new eaid project set dealcrparty bu if selected or check for first selected bu
    this.firstLevelCavDetails.bus.push(this.cavDetails[0].bus[0]);
  }
}


selectMoreBu(flag) {
  this.projectService.enableSubsidiariesMeraki = flag;
  this.projectService.selectMoreBuId = true;
}

// to set bu's checked
setBusSelectedDefault(data){
  this.selectedBuCount = 0;
  for(let bu of data){
    // check for new eaid project check dealcrparty bu if selected
    if (bu.selected === 'P'|| bu.selected === 'F' || ( (bu.dealCrPartyBU && !this.projectService.isNewEaIdCreatedForProject) || (bu.dealCrPartyBU && this.projectService.isNewEaIdCreatedForProject && (bu.selected === 'P'|| bu.selected === 'F')) )){
      bu.checked = true;
      this.selectedBuCount++
    }
    bu.showSites = false;
  }
}

// api to get masterAggreement details
getMasterAggreementDetails(){
  const url = 'project/' + this.projectStoreService.projectData.objId + '/master-agreement-detail';
  this.eaRestService.getApiCall(url).subscribe((response: any) => {
    this.messageService.clear();
    this.projectStoreService.blurSubsidiaries = true;
    if (this.vnextService.isValidResponseWithoutData(response, true)){
      if (response.data){
        this.masterAggreementDetails = response.data;
        this.projectStoreService.lockProject = true;
        this.selectedBpID = this.masterAggreementDetails;
        this.selectBpId(this.selectedBpID);
        // if user switched to exisitng bpid, show subsidiaries directly
        if(this.eaService.features.EAID_REL && this.isBpIdSwitchComplete && this.selectedBpID){
          this.showSubsidiaries();
        }
      }
    } else {
      this.messageService.displayMessagesFromResponse(response);
    }
  });
}

// to unblur and show subsidiaries
showSubsidiaries(){
  this.projectStoreService.blurSubsidiaries = false;
  this.projectStoreService.isEMSMsgDisplayed = true;
 if(this.projectStoreService.projectData.status !== this.localizationService.getLocalizedString('common.COMPLETE')){
  this.projectStoreService.lockProject = false;
 }
}

continuetoChangeEaidForProject() {
  if(!this.selectedBpID || !this.selectedBpID?.eaId){
    return;
  }
  if(this.isAllowCreateBpId){
    this.changeEaidForProject();
  } else {
    this.showSubsidiaries();
  }
}

changeEaidForProject(){
  const url = 'project/' + this.projectStoreService.projectData.objId + '?eaid=' + this.selectedBpID.eaIdSystem;
  this.eaRestService.getApiCall(url).subscribe((response: any) => {
    if(this.vnextService.isValidResponseWithoutData(response)){
      // this.projectStoreService.isShowProject = false;
      this.onClose.emit();
    } else {
      this.messageService.displayMessagesFromResponse(response);
    }
  })
}

openBpIdDetails(id) {
  this.projectService.showBpIdDetails = true;
  this.projectStoreService.currentBpId = id;
}

selectBpId(id) {
  id.selected = true;
  this.selectedBpID = id;
  const url = this.constantsService.EAID_TF_DATE_URL + this.selectedBpID.eaIdSystem;
  this.eaRestService.getApiCall(url).subscribe((response: any) => {
    if(this.vnextService.isValidResponseWithoutData(response)){
      this.alreadyPurchasedDetails = true;
      this.nextTfDate = response.data.nextTfDate;
    } else {
      this.messageService.displayMessagesFromResponse(response);
    }
  })
}

  goToSalesConnect() {
    const url = this.constantsService.SALES_CONNECT_URL;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        window.open(response.data);
      }
    })
  }

  goBackToSubsidiaries() {
    this.projectStoreService.blurSubsidiaries = false;
    this.isExistingIdSelected = false;
  }
}
