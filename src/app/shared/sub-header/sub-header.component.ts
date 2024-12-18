import { PermissionEnum } from './../../permissions';
import { PermissionService } from './../../permission.service';
import { Component, OnInit, Input, AfterViewInit, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { HeaderService } from '../../header/header.service';
// import { ProspectsComponent } from '../../../app/pr';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditQualificationComponent } from '../../modal/edit-qualification/edit-qualification.component';
import { AppDataService, SessionData } from '../services/app.data.service';
import { ProductSummaryService } from '../../dashboard/product-summary/product-summary.service';
import { MessageService } from '../services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { EditProposalHeaderComponent } from '../../modal/edit-proposal-header/edit-proposal-header.component';
// import { SubHeaderService } from '../services/sub-header.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { LinkSmartAccountComponent } from '@app/modal/link-smart-account/link-smart-account.component';
import { DeleteSmartAccountComponent } from '@app/modal/delete-smart-account/delete-smart-account.component';
import { MessageType } from '@app/shared/services/message';


@Component({
  moduleId: module.id,
  selector: 'app-sub-header',
  templateUrl: 'sub-header.component.html',
  styleUrls: ['sub-header.component.scss']
})

export class SubHeaderComponent implements OnInit, OnDestroy {
  static readonly IB_SUMMARY = 'IB_SUMMARY';
  static readonly PROSPECT_DETAILS = 'PROSPECT_DETAILS';
  static readonly QUALIFICATION = 'QUALIFICATION';
  static readonly EDIT_QUALIFICATION = 'EDIT_QUALIFICATION';
  static readonly PROPOSAL_CREATION = 'PROPOSAL_CREATION';
  static readonly LIST_PROPOSAL = 'LIST_PROPOSAL';
  static readonly BOM_CREATION = 'BOM_CREATION';
  static readonly DOCUMENT_CENTER = 'DOCUMENT_CENTER';
  static readonly SALES_READINESS = 'SALES_READINESS';
  showArchitectureDrop = false;
  showSmartAccountDrop = false;
  showSmartAccountLinkPermission = false;
  placeholder = 'Search with Account Name, Id, Domain...';
  searchText = '';
  searchArray = ['smartAccountName', 'smartAccountId', 'smartAccountDomainId'];
  @Input() public screenName: '';

  @Input() subHeaderData: SubHeaderData;
  @Input() creditOverviewPage = false;
  name = '';
  showFinancial = false;
  public movePageSubTitleText = false;
  smartAccountChangePerimission = false;
  linkedSmartAccount = 'Not Assigned';

  options = {
    width: 160,
    height: 12,
    offsetWidth: 20
  };
  public subscribers: any = {};
  is2tPartner = false;
  smartAccountPresent = false;


  constructor(public localeService: LocaleService, public headerService: HeaderService,
    private modalVar: NgbModal, public appDataService: AppDataService,
    private productSummaryService: ProductSummaryService, public qualService: QualificationsService,
    public priceEstimateService: PriceEstimationService, public proposalSummaryService: ProposalSummaryService, private renderer: Renderer2,
    private messageService: MessageService, public constantsService: ConstantsService,
    public utilitiesService: UtilitiesService, config: NgbCarouselConfig, public proposalDataService: ProposalDataService,
    private permissionService: PermissionService) {
    config.interval = 0;
  }

  ngOnInit() {
    
    // Move the sub title text upwards
    this.appDataService.currentBreadCrumbMovingStatus.subscribe(data => this.movePageSubTitleText = data);
    // check for pagecontext is sales readiness or bom or doc center and group not selected
    if (( this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.salesReadiness ||
      (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.documentCenter ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.previewQuote)
      && !this.appDataService.isGroupSelected ) && this.appDataService.subHeaderData.moduleName !== "EDIT_QUALIFICATION") {
      this.showFinancial = true;
      } else {
      this.showFinancial = false;
      }
    if (this.permissionService.permissions.has(PermissionEnum.CHANGE_SMART_ACCOUNT)) {
      this.showSmartAccountLinkPermission = true;
    }
    this.appDataService.agreementCntEmitter.subscribe( (numberOfAgreements) =>{
      this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = numberOfAgreements;  
     });

     
     this.is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti); // set 2tpartner flag to hide financial summary icon

     // subscribe to header emitter after header loads
     this.subscribers.headerLoaded = this.appDataService.headerDataLoaded.subscribe(() => {
      this.is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti); // set 2tpartner flag to hide financial summary icon
     });

     // Subscribe to User Info emmiter after user info loads
     this.subscribers.userInfoLoaded = this.appDataService.userInfoObjectEmitter.subscribe(() => {
      if (this.permissionService.permissions.has(PermissionEnum.CHANGE_SMART_ACCOUNT)) {
        this.showSmartAccountLinkPermission = true;
      }
     });
  }

  ngOnDestroy(){
    if (this.subscribers.headerLoaded){
      this.subscribers.headerLoaded.unsubscribe();
    }
    if(this.subscribers.userInfoLoaded){
      this.subscribers.userInfoLoaded.unsubscribe();
    }
  }

  editQual() {
    this.appDataService.editModal = this.constantsService.QUALIFICATIONS;
    const modalRef = this.modalVar.open(EditQualificationComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      // this.name = result.updateData;
      this.appDataService.subHeaderData.custName = result.updatedQualName;
      if (result.updatedQualName) {
        // qualObj.name = result.updatedQualName;
        this.qualService.qualification.name = result.updatedQualName;
        // this.qualService.updateSessionQualData();
      }
      if (result.updatedQualDesc) {
        // qualObj.description = result.updatedQualDesc;
        this.qualService.qualification.eaQualDescription = result.updatedQualDesc;
        // this.qualService.updateSessionQualData();
      }
    });
  }

  getSearchText(value) {
    this.searchText = value;
  }

  editProposal() {
     // if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep) {
    //   this.proposalDataService.saveSuiteEmitter.emit();
    // } else {
    const modalRef = this.modalVar.open(EditProposalHeaderComponent, { windowClass: 'edit-proposal-header edit-proposal-co-term' });
    modalRef.result.then((result) => {
      this.appDataService.subHeaderData.custName = result.updateData.name;
      this.appDataService.subHeaderData.subHeaderVal[0] = result.updateData.eaStartDateDdMmmYyyyStr;
      this.appDataService.subHeaderData.subHeaderVal[1] = result.updateData.eaTermInMonths;
      this.appDataService.subHeaderData.subHeaderVal[2] = result.updateData.priceList;
      this.appDataService.subHeaderData.subHeaderVal[3] = result.updateData.billingModel;
      this.appDataService.subHeaderData.subHeaderVal[4] = result.updateData.status;
    });
  // }
  }

  selectException() {
    const modalRef = this.modalVar.open(EditProposalHeaderComponent, { windowClass: 'edit-proposal-header' });
    // modalRef.result.then((result) => {
    //   this.appDataService.subHeaderData.custName = result.updateData.name;
    //   this.appDataService.subHeaderData.subHeaderVal[0] = result.updateData.eaStartDateDdMmmYyyyStr;
    //   this.appDataService.subHeaderData.subHeaderVal[1] = result.updateData.eaTermInMonths;
    //   this.appDataService.subHeaderData.subHeaderVal[2] = result.updateData.priceList;
    //   this.appDataService.subHeaderData.subHeaderVal[3] = result.updateData.billingModel;
    //   this.appDataService.subHeaderData.subHeaderVal[4] = result.updateData.status;
    // });
  }

  addFavorite() {
    this.productSummaryService
      .addFavorite(this.appDataService.customerID)
      .subscribe((res: any) => {
        if (!res.error) {
          try {
            this.appDataService.isFavorite = 1;
            const sessionObj: SessionData = this.appDataService.getSessionObject();
            sessionObj.isFavoriteUpdated = !sessionObj.isFavoriteUpdated;
            this.appDataService.setSessionObject(sessionObj);
          } catch (error) {
            // console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
  }

  removeFavorite() {
    this.productSummaryService
      .removeFavorite(this.appDataService.customerID, this.appDataService.archName)
      .subscribe((res: any) => {
        if (!res.error) {
          try {
            this.appDataService.isFavorite = 0;
            const sessionObj: SessionData = this.appDataService.getSessionObject();
            sessionObj.isFavoriteUpdated = !sessionObj.isFavoriteUpdated;
            this.appDataService.setSessionObject(sessionObj);
          } catch (error) {
            // console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
  }

  financialSummary() {
    // to set showFinancialsummary depending upon pagecontext
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep) {
      this.proposalSummaryService.showFinancialSummary = true;
    } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalCXPriceEstimateStep) {
      this.priceEstimateService.showFinancialSummary = true;
    } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.documentCenter ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.previewQuote ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.salesReadiness) {
      this.proposalDataService.showFinancialSummary = true;
      // check for pagecontext is sales readiness or bom or doc center and group not selected to show financia summary
    }
  }

  getCombinedArchitectureNameForLinkedProposal(): string {

    let str = '';

    if (this.appDataService.subHeaderData.subHeaderVal[8]) {

      this.appDataService.subHeaderData.subHeaderVal[8].forEach((_archName, index) => {

        if (index === 0) {
          str = _archName.architecture;
        } else {
          str = str + ' ' + 'and' + ' ' + _archName.architecture;
        }
      });
    }

    return str;
  }

  showDropArch() {
    this.showArchitectureDrop = true;
  }

  activeArchitecture(arch, allArch) {

    this.appDataService.isGroupSelected = false;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.isGroupSelected = false;

    for (let i = 0; i < allArch.length; i++) {
      if (allArch[i].architecture === arch.architecture) {
        arch.active = true;

        if (this.screenName) {
          this.proposalDataService.proposalDataObject.proposalId = arch.id;
          this.proposalDataService.proposalDataObject.proposalData.status = arch.status;
          // const sessionObject: SessionData = this.appDataService.getSessionObject();
          sessionObject.proposalDataObj.proposalId = arch.id;
          sessionObject.proposalDataObj.proposalData.status = arch.status;
          this.appDataService.setSessionObject(sessionObject);

          this.appDataService._router.navigate(['qualifications/proposal/' + arch.id + '/' + this.screenName]);
        } else {
          this.appDataService._router.navigate(['qualifications/proposal/' + arch.id]);
        }
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        allArch[i].active = false;
      }
    }
    this.showArchitectureDrop = false;
  }

  onClickedOutside(event) {
    this.showArchitectureDrop = false;
  }

  showAllProposal() {
    this.appDataService.isGroupSelected = true;
    this.showArchitectureDrop = false;
    this.proposalDataService.proposalDataObject.proposalId = this.proposalDataService.proposalDataObject.proposalData.groupId;

    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.proposalDataObj.proposalId = this.proposalDataService.proposalDataObject.proposalId;
    sessionObject.isGroupSelected = true;

    this.appDataService.setSessionObject(sessionObject);
    this.appDataService._router.navigate(['qualifications/proposal/'
      + this.proposalDataService.proposalDataObject.proposalData.groupId + '/' + this.screenName + '/' + 'group']);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  openActivityLog() {
    this.appDataService.openActivityLog = true;
    this.renderer.addClass(document.body, 'position-fixed');
  }


  // LoCC pending check
  loccSignaturePending() {

    return this.qualService.loccSignaturePending();

  }

  openLinkModal() {
    const modalRef = this.modalVar.open(LinkSmartAccountComponent, { windowClass: 'smart-account-modal' });
  }

  /*editQualificationName()
  {
    const modalRef = this.modalVar.open(EditQualificationComponent, { windowClass: 'searchLocate-modal' });
    modalRef.componentInstance.qualifiactionName = this.qualService.qualification.name;
    modalRef.componentInstance.eaQualDescription = this.qualService.qualification.eaQualDescription;
    modalRef.result.then(result => {
     try {
      this.qualService.qualification.name = result.updatedQualName;
      this.qualService.qualification.eaQualDescription = result.updatedQualDesc;
       // If qualification name and qualification description are same as previous then we don't need to make ajax call.
        this.qualService.updateQual().subscribe((response : any) => {
            if(response) {
                if(response.messages && response.messages.length > 0){//If any message present in response need to display.
                    this.messageService.displayMessagesFromResponse(response);
                }
                if(!response.error){ // If no error in response, update qualification name and description in qual object.
                  this.qualService.qualification.name = response.qualName;
                  this.qualService.qualification.eaQualDescription = response.description;
                }
            }
        });
     } catch (error) {
        console.error(error.ERROR_MESSAGE);
        this.messageService.displayUiTechnicalError(error);
      }
    });
  }*/

  getSmartAccountName(smartAccount) {
    if (smartAccount.linked) {
      this.linkedSmartAccount = smartAccount.smartAccountName;
      this.appDataService.linkedSmartAccountObj.name = smartAccount.smartAccountName;
      this.appDataService.linkedSmartAccountObj.id = smartAccount.smartAccountId;
    }
    return smartAccount.smartAccountName;
  }


  getLinkedSmartAccountName() {
    for (let i = 0; i < this.appDataService.smartAccountData.length; i++) {
      const smartAccount = this.appDataService.smartAccountData[i];
      if (smartAccount.linked) {
        this.linkedSmartAccount = smartAccount.smartAccountName;
        this.appDataService.linkedSmartAccountObj.name = smartAccount.smartAccountName;
        this.appDataService.linkedSmartAccountObj.id = smartAccount.smartAccountId;
        break;
      }
    }
  }


  getAgreementDetails(smartAccount, isActive) {
    this.showSmartAccountDrop = false;
    smartAccount.active = isActive;
    for (let i = 0; i < this.appDataService.smartAccountData.length; i++) {
      const tempAcc = this.appDataService.smartAccountData[i];
      if (tempAcc.smartAccountId !== smartAccount.smartAccountId) {
        tempAcc.active = false;
      }
    }
    smartAccount.active = isActive;
    this.appDataService.agreementDataEmitter.emit(smartAccount);
  }


  deleteSmartAccount(smartAccount) {

    this.searchText = '';
    const modalRef = this.modalVar.open(DeleteSmartAccountComponent, { windowClass: 'delete-user-modal' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.productSummaryService.deleteSmartAccount(smartAccount.prospectKey, smartAccount.smartAccountId).subscribe((response: any) => {
          if (response && !response.error) {

            // Set not assigned if active account is  deleted
            if (smartAccount.active) {
              this.appDataService.deleteAgreementDataEmitter.emit();
            }
            const newArray = this.appDataService.smartAccountData.filter(tempSmartAccount => tempSmartAccount.smartAccountId !== smartAccount.smartAccountId);
            this.appDataService.smartAccountData = newArray;
          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        },
          error => {
            this.messageService.displayMessages(
              this.appDataService.setMessageObject(
                this.localeService.getLocalizedMessage('admin.DELETE_FEATURE_FAILED'), MessageType.Error));
          });
      }
    }).catch(error => {
      // console.log('error:', error);
    });
  }

  onClickedOutsideSmart(event) {
    this.showSmartAccountDrop = false;
  }

  openProposal(proposalId) {

    const index = window.location.href.lastIndexOf('/')
    const url = window.location.href.substring(0, index + 1)

    // Switch to proposal summary
    if (this.appDataService.pageContext === this.constantsService.PROPOSAL_SUMMARY_STEP) {
        window.open(url + proposalId , '_self');
    }else {
    // Switch to price estimate 
       window.open(url + proposalId + '/priceestimate','_self');
    }

   // window.location.reload();
  }

  isSmartAccountPresent(){    
    if(this.qualService.qualification.subscription['smartAccountName'] || this.proposalDataService.linkedRenewalSubscriptions.length > 0 ) {
      this.smartAccountPresent = true;
    }else{
      this.smartAccountPresent = false;
    }
    return this.smartAccountPresent;
  }


  getSmartAccountNameToDisplay(){
    let smartAccountName = this.qualService.qualification.subscription['smartAccountName'];
    if(!smartAccountName){
      smartAccountName = this.proposalDataService.linkedRenewalSubscriptions[0].smartAccountName;
    }
    return smartAccountName;
  }
  


}


export interface SubHeaderData {
  moduleName: string;
  custName: string;
  favFlag?: boolean;
  subHeaderVal: Array<any>;
  editIcon?: boolean;
}
