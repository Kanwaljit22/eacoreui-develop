
import {map} from 'rxjs/operators';

import {distinctUntilChanged} from 'rxjs/operators';

import {debounceTime} from 'rxjs/operators';
import { ConstantsService } from '@app/shared/services/constants.service';
import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { WhoInvolvedService } from './who-involved.service';
import { Observable } from 'rxjs';



import { AddSpecialistComponent } from '@app/modal/add-specialist/add-specialist.component';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
// import { QualificationsService } from '@app/qualifications/view-qualifications/qualifications.service';
import { EditWarningComponent } from '@app/modal/edit-warning/edit-warning.component';
import { MessageService } from '@app/shared/services/message.service';
import { HttpCancelService } from '@app/shared/services/http.cancel.service';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { QualificationsService, ICam } from '@app/qualifications/qualifications.service';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocaleService } from '@app/shared/services/locale.service';
import { Message, MessageType } from '@app/shared/services/message';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ReOpenComponent } from '@app/modal/re-open/re-open.component';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { IPhoneNumber } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-who-involved',
  templateUrl: './who-involved.component.html',
  styleUrls: ['./who-involved.component.scss']
})
export class WhoInvolvedComponent implements OnInit, OnDestroy {
  roadMap: IRoadMap;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  isCustomerScopeVisible = true;
  customerName = '';
  customerEmail = '';
  // addSpecialistData = [];
  salesData = [];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneNumber: IPhoneNumber = {};
  displayList = false;
  selectedSales = [];
  selectedSpecialist = [];
  addMember = false;
  searchSalesTeam: string;
  displayExtendedTeamList = false;
  searchSpecialist: any;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  fileName = '';
  fileFormatError = false;
  pendingRequest: any;
  dealId: string;
  searching = false;
  searchFailed = false;
  checkBoxSpecialist = true;
  customerPreferredName: any = '';
  custRepersentativeName: string;
  // custRepersentativeEmailId: string;
  custRepersentativeTitle: string;
  salesTeamName: string;
  salesTeamEmailId: string;
  isDomainValid = true;
  emailValidationRegx = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$');
  invalidEmailErrorMessage = 'Invalid Email Id';
  requiredErrorMessage = 'This field is required';
  isEmailInvalid = false;
  form: FormGroup;
  customerRepersentativeName: FormControl;
  customerRepersentativeTitle: FormControl;
  customerRepersentativeEmailId: FormControl;
  customerScope: FormControl;
  federal: FormControl;
  searchSpecialistFC: FormControl;
  federalValue: string;
  subscribers: any = {};
  searchArray = ['name', 'archName'];
  swssNotifyEmail = false;
  swssNotifyWebex = false;
  estNotifyEmail = false;
  estNotifyWebex = false;
  swssNotifyAllEmail: boolean;
  swssNotifyAllWebex: boolean;
  estNotifyAllEmail: boolean;
  estNotifyAllWebex: boolean;
  countryOfTransactions = [];
  stateList = [];

  swssMasterCheckDisabled: boolean;
  estMasterCheckDisabled: boolean;
  camData: ICam[];
  selectedCam: ICam;
  camName = 'Select CAM';
  isCamSelected = false;


  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  estAccessType = this.constansService.RW; // This variable use for EST access type
  swssAccessType = this.constansService.RW;
  specialistData = [];
  partnerLedFlow = false;
  dataFlow = true;
  isPartnerDeal = false;
  isPartnerDataLoaded = false;
  distributorTeam = [];
  cxTeamData = [];
  cxDealAssurerTeams = [];
  swssNotifyWalkme = false;
  estNotifyWalkme = false;
  swssNotifyAllWalkme: boolean;
  estNotifyAllWalkme: boolean;
  type: string;
  isChangeSubFlow = false;
  isUpdatedByUser = false;
  is2tPartner = false;
  disableFederalCustomer = false;

  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService, private modalVar: NgbModal, public involvedService: WhoInvolvedService, private router: Router, public permissionService: PermissionService,
    private renderer: Renderer2, public appDataService: AppDataService, public qualService: QualificationsService, private eaService: EaService,
    public messageService: MessageService, private httpCancelService: HttpCancelService, public constansService: ConstantsService, public utilitiesService: UtilitiesService) {
    // Add qualification creator automatically as a extended sales team member with Read-Write Access
    const sessionObject: SessionData = appDataService.getSessionObject();
    if (this.qualService.isQualCreated && this.qualService.qualification.extendedsalesTeam &&
      this.qualService.qualification.extendedsalesTeam.length === 0 && sessionObject !== undefined) {
      // const sessionObject: SessionData = appDataService.getSessionObject();
      qualService.qualification.extendedsalesTeam = sessionObject.qualificationData.extendedsalesTeam;
      qualService.qualification.distributorTeam = sessionObject.qualificationData.distributorTeam;

      if (this.appDataService.userInfo.accessLevel !== 3) {
        const qualCreator: any = {};
        qualCreator.fullName = this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName;
        qualCreator.ccoId = this.appDataService.userInfo.userId;
        qualCreator.email = this.appDataService.userInfo.emailId;
        qualCreator.access = this.constansService.RW;
        qualCreator.notification = 'Yes';
        qualCreator.webexNotification = 'Y';
        qualCreator.notifyByWelcomeKit = 'Y';
        this.selectedSales.push(qualCreator);
      }
      if (this.qualService.qualification.accountManager.userId &&
        this.qualService.qualification.accountManager.userId !== this.appDataService.userInfo.userId) {
        const managerData = {
          'fullName': this.qualService.qualification.accountManagerName,
          'email': this.qualService.qualification.accountManager.emailId,
          'ccoId': this.qualService.qualification.accountManager.userId,
          'access': this.constansService.RW,
          'notification': 'Yes',
          'webexNotification ': 'Y',
          'notifyByWelcomeKit': 'Y',
          'archname': AppDataService.ARCH_NAME
        };
        this.selectedSales.push(managerData);
      } else if (appDataService.isPatnerLedFlow &&
        this.qualService.qualification.accountManager.userId === '') { // if partner led flow and no Account Manager present call getQual Api to get partner & extended sales team data 
        this.addMember = true;
        this.qualService.updateSessionQualData();
      }
      // set the type of creation
      this.addMembers('createNew');
    }
    // Adding partner details
    /* if (this.appDataService.userInfo.accessLevel == 3 && this.qualService.isQualCreated && this.qualService.qualification.partnerTeam && this.qualService.qualification.partnerTeam.length === 0) {
       // const sessionObject: SessionData = appDataService.getSessionObject();
      // qualService.qualification.partnerTeam = sessionObject.qualificationData.extendedsalesTeam;
         this.partnerLedFlow = true;
         const qualCreatorPartner: any = {};
         qualCreatorPartner.fullName = this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName;
         qualCreatorPartner.ccoId = this.appDataService.userInfo.userId;
         qualCreatorPartner.email = this.appDataService.userInfo.emailId;
         qualCreatorPartner.access = this.constansService.RW;
         qualCreatorPartner.notification = 'Yes';
         qualCreatorPartner.webexNotification  = 'Y';
         qualService.qualification.partnerTeam.push(qualCreatorPartner);
         this.addMember = true;
       // set the type of creation
       //this.addMembers('createNew');
     }*/
  }

  ngOnInit() { 
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.type = 'whoInvolved';
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    if (!this.appDataService.architectureMetaDataObject) {
      this.appDataService.setMetaData().subscribe((response: any) => {
        sessionObject.architectureMetaDataObject = response.data;
        this.appDataService.architectureMetaDataObject = response.data;
        this.appDataService.setSessionObject(sessionObject);
        this.qualService.getQualGeographyColumn();
      });
    }

    this.qualService.showDealIDInHeader = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep;
    this.appDataService.showActivityLogIcon(true);
    this.searchSalesTeam = '';
    // this.appDataService.isProposalIconEditable = true;
    this.qualService.setQualPermissions();
    // enable edit icon only if qual edit is present
    if (this.permissionService.qualEdit) {
      this.appDataService.isProposalIconEditable = true;
    } else {
      this.appDataService.isProposalIconEditable = false;
    }
    // Get invalid email domain 
    this.appDataService.getInvalidEmail();
    
    this.isPartnerDeal = this.qualService.qualification.partnerDeal;
    this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    if ((this.appDataService.isPatnerLedFlow || this.isPartnerDeal) && !this.camData) {
      // this.partnerLedFlow = true;
      this.appDataService.userDashboardFLow = '';
      this.getCamData();
    }

    if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName !== '') {
      this.isCamSelected = true;
      this.selectedCam = this.qualService.qualification.cam;
    } else if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName === '') {
      this.isCamSelected = false;
    }

    // set change sub flow
    if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
      this.isChangeSubFlow = true;
    } else {
      this.isChangeSubFlow = false;
    }

    // isQualCreated will be true if user is creating a new qual. and in that case he must have RW access for that qual.
    if (this.qualService.isQualCreated || this.permissionService.qualEdit) {
      this.appDataService.isReadWriteAccess = true;
      this.permissionService.qualEdit = true;
    }
    this.appDataService.isEditDealIdAllowed = this.permissionService.qualPermissions.has(PermissionEnum.EditDealId);

    this.is2tPartner = this.qualService.buyMethodDisti; // set 2tpartner flag to hide distributor team 
 
    this.customerName = this.qualService.qualification.accountManagerName;
    this.customerEmail = this.qualService.emailID;
    this.salesData = [];
    this.salesTeamName = this.qualService.qualification.accountManagerName;
    // this.qualService.qualification.customerInfo.scope = 'Yes';
    // this.salesTeamEmailId = this.qualService.qualification.accountManager.emailId;
    // this.custRepersentativeName = this.qualService.qualification.customerInfo.repName;
    // this.custRepersentativeTitle = this.qualService.qualification.customerInfo.repTitle;

    // this.custRepersentativeEmailId = this.qualService.qualification.customerInfo.repEmail;
    // this.customerRepersentativeEmailId = new FormControl(this.qualService.qualification.customerInfo.repEmail,[Validators.pattern(this.appDataService.emailValidationRegx),Validators.required]);
    // this.customerRepersentativeName = new FormControl(this.qualService.qualification.customerInfo.repName,Validators.required);
    // this.customerRepersentativeTitle = new FormControl(this.qualService.qualification.customerInfo.repTitle,Validators.required);
    // this.form = new FormGroup({
    //   customerRepersentativeEmailId : this.customerRepersentativeEmailId,
    //   customerRepersentativeName: this.customerRepersentativeName,
    //   customerRepersentativeTitle: this.customerRepersentativeTitle
    // });

    this.messageService.clear();
    this.appDataService.custNameEmitter.emit({ 'text': this.appDataService.customerName,
    'context': AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep });
    if (this.qualService.qualification.customerInfo.scope === '1' ||
    this.qualService.qualification.customerInfo.scope === this.constansService.NONE) {
      this.qualService.qualification.customerInfo.scope = this.constansService.NONE;
    } else {
      this.qualService.qualification.customerInfo.scope = this.constansService.listedAffiliates;
    }
    if(this.qualService.isQualCreated){
      this.qualService.qualification.customerInfo.phoneCountryCode = '';
        this.qualService.qualification.customerInfo.phoneNumber = '';
        this.qualService.qualification.customerInfo.dialFlagCode = '';
    }
    this.preparePhoneValue();
    this.form = new FormGroup({
      customerScope: new FormControl(this.qualService.qualification.customerInfo.scope),
      federal: new FormControl(this.qualService.qualification.federal),
      searchSpecialistFC: new FormControl(''),
      custRep: new FormGroup({
        custRepEmailId: new FormControl(this.qualService.qualification.customerInfo.repEmail, [Validators.email]),
        custRepName: new FormControl(this.qualService.qualification.customerInfo.repName),
        custRepTitle: new FormControl(this.qualService.qualification.customerInfo.repTitle),
        federal: new FormControl(this.qualService.qualification.federal),
        phone: new FormControl(this.phoneNumber)
      }),

      custPreferredName: new FormControl(this.qualService.qualification.customerInfo.preferredLegalName, [Validators.required, this.noWhitespaceValidator]),
      addressLine1: new FormControl(this.qualService.qualification.legalInfo.addressLine1, [Validators.required, this.noWhitespaceValidator]),
      addressLine2: new FormControl(this.qualService.qualification.legalInfo.addressLine2),
      country: new FormControl(this.qualService.qualification.legalInfo.country, [Validators.required, this.noWhitespaceValidator]),
      state: new FormControl(this.qualService.qualification.legalInfo.state, [Validators.required, this.noWhitespaceValidator]),
      city: new FormControl(this.qualService.qualification.legalInfo.city, [Validators.required, this.noWhitespaceValidator]),
      zip: new FormControl(this.qualService.qualification.legalInfo.zip, [Validators.required, this.noWhitespaceValidator]),
      affiliateName: new FormControl(this.qualService.qualification.customerInfo.affiliateNames ?
        this.qualService.qualification.customerInfo.affiliateNames : ''),

    });
    this.subscribers.camEmitter = this.qualService.camEmitter.subscribe(() => {
      // load customer contactdetails from api if present
      if(this.qualService.isQualCreated && !this.isUpdatedByUser){
        this.email.setValue(this.qualService.qualification.customerInfo.repEmail);
        this.name.setValue(this.qualService.qualification.customerInfo.repName);
        this.title.setValue(this.qualService.qualification.customerInfo.repTitle);
        this.custPreferredName.setValue(this.qualService.qualification.customerInfo.preferredLegalName);
        this.phone.setValue(this.phoneNumber)
      }

      this.checkboxSelectors(); // method to check and set header level checboxes
      this.isPartnerDeal = this.qualService.qualification.partnerDeal;
      this.isPartnerDataLoaded = true;
      this.setCxTeamsData(this.qualService.qualification.cxTeams);
      this.setCxDealAssurerTeamsData(this.qualService.qualification.cxDealAssurerTeams);
      this.setPartnerTeamsData(this.qualService.qualification.partnerTeam);
      this.setDistributorTeamsData(this.qualService.qualification.distributorTeam);

      if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName !== '') {
        this.isCamSelected = true;
        this.selectedCam = this.qualService.qualification.cam;
      } else if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName === '') {
        this.isCamSelected = false;
      }

      // set change sub flow
      if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
        this.isChangeSubFlow = true;
      } else {
        this.isChangeSubFlow = false;
      }

      this.federalValue = this.qualService.qualification.federal;
      // Enable / disable federal customer

      this.is2tPartner = this.qualService.buyMethodDisti; // set 2tpartner flag to show/hide distributor team 
      this.setFederalCustomer();
    });

    this.federalValue = this.qualService.qualification.federal;
    // Enable / disable federal customer
    this.setFederalCustomer();

    this.qualService.isCustomerScopeVisible = this.qualService.qualification.customerInfo.scope === this.constansService.listedAffiliates ? true : false;
    this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
    if (this.qualService.qualification.customerInfo.preferredLegalName === '') {
      this.custPreferredName.setValue(this.qualService.qualification.accountName);
    } else {
      this.custPreferredName.setValue(this.qualService.qualification.customerInfo.preferredLegalName);
    }

    this.setCxTeamsData(this.qualService.qualification.cxTeams);
    this.setCxDealAssurerTeamsData(this.qualService.qualification.cxDealAssurerTeams);
    this.setPartnerTeamsData(this.qualService.qualification.partnerTeam);
    this.setDistributorTeamsData(this.qualService.qualification.distributorTeam);

    if (this.isPartnerDeal) {
      this.isPartnerDataLoaded = true;
    }

    // Below condition for restore scenario when user click on back button from Define Geography.
    if (this.qualService.qualification.extendedsalesTeam.length > 0) {
      this.addMember = true;
    }
    this.appDataService.getTeamMembers().subscribe(res => {
      if (!res.error) {
        if (!this.appDataService.ciscoTeamMembers) {
          this.appDataService.ciscoTeamMembers = res;
        }
        this.specialistData = res.data;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    this.subscribers.name = this.qualService.dealIdUpdateEmitter.subscribe((res) => {
      this.custPreferredName.setValue(this.qualService.qualification.customerInfo.preferredLegalName);
      this.addressLine1.setValue(this.qualService.qualification.address.addressLine1);
      this.addressLine2.setValue(this.qualService.qualification.address.addressLine2);
      this.country.setValue(this.qualService.qualification.address.country);
      this.state.setValue(this.qualService.qualification.address.state);
      this.city.setValue(this.qualService.qualification.address.city);
      this.zip.setValue(this.qualService.qualification.address.zip);
    }
    );
    if (!this.permissionService.qualEdit || this.appDataService.roadMapPath || this.appDataService.roSalesTeam ||
      (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess)) {
      this.checkRoSuperUser();
    } else {
      this.getCountryOfTransactions();
    }

    this.checkboxSelectors();
  }

  // method to validate if whitespaces present 
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = control.value && control.value.trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

setFederalCustomer() {

      // Disable federal flag when its yes
    if (this.federalValue === 'yes') {

         this.disableFederalCustomer = true;
    }else {
         this.disableFederalCustomer = false;
    }
}

  updatedByUser(){
    this.isUpdatedByUser = true;
  }
  // method to check and set partner team data
  setPartnerTeamsData(data) {
    if (!data) {
      this.qualService.qualification.partnerTeam = [];
    } 
  }


  // method to check and set distributor team data
  setDistributorTeamsData(data) {
    if (!data) {
      this.qualService.qualification.distributorTeam = [];
      this.distributorTeam = [];
    } else {
      this.distributorTeam = data;
    }
  }

  setCxTeamsData(data) {
    if (!data) {
      this.qualService.qualification.cxTeams = [];
      this.cxTeamData = [];
    } else {
      this.cxTeamData = data;
    }
  }

  setCxDealAssurerTeamsData(data) {
    if (!data) {
      this.qualService.qualification.cxDealAssurerTeams = [];
      this.cxDealAssurerTeams = [];
    } else {
      this.cxDealAssurerTeams = data;
    }
  }
  checkRoSuperUser() {
    this.name.disable();
    this.email.disable();
    this.title.disable();
    this.custPreferredName.disable();
    this.addressLine1.disable();
    this.addressLine2.disable();
    this.country.disable();
    this.state.disable();
    this.city.disable();
    this.zip.disable();
    this.phone.disable();
    this.affiliateName.disable();
    this.form.get('customerScope').disable();
    this.form.get('federal').disable();
    this.form.get('searchSpecialistFC').disable();
  }

  // enabling the form to be editable after reopened
  enableEditPage() {
    this.name.enable();
    this.email.enable();
    this.title.enable();
    this.custPreferredName.enable();
    this.addressLine1.enable();
    this.addressLine2.enable();
    this.country.enable();
    this.state.enable();
    this.city.enable();
    this.zip.enable();
    this.affiliateName.enable();
    this.form.get('customerScope').enable();
    this.form.get('federal').enable();
    this.form.get('searchSpecialistFC').enable();
  }

  openCAMLocator() {
    this.involvedService.getCamLocatorUrl().subscribe(res => {
      if (res && !res['error'] && res['data']) {
        window.open(res['data'], '_blank').focus();
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    this.appDataService.persistErrorOnUi = false;
    this.qualService.isQualCreated = false;
    if (this.subscribers.name) {
      this.subscribers.name.unsubscribe();
    }
    if (this.subscribers.camEmitter) {
      this.subscribers.camEmitter.unsubscribe();
    }
    // unsubscribe to roadmap emitter after reopening
    this.qualService.unSubscribe();
  }

  openSpecialist() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    const modalRef = this.modalVar.open(AddSpecialistComponent, { windowClass: 'add-specialist' });

    modalRef.result.then((result) => {
      this.qualService.qualification.softwareSalesSpecialist = result.locateData;

    });
  }

  getCamData() {
    // add changes to handel error msg from res.
    this.involvedService.getCamData().subscribe((res: any) => {

      if (res && res.data && !res.error) {
        this.camData = res.data;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });

  }

  onCamChange(event) {
    this.selectedCam = event;
    this.qualService.qualification.cam = this.selectedCam;
    this.isCamSelected = true;
    this.addMembers('createNew', this.selectedCam);
  }
  focusSales(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  editDeal() {
    const modalRef = this.modalVar.open(EditWarningComponent, { windowClass: 'infoDealID' });
  }

  get name() {
    return this.form.get('custRep.custRepName');
  }

  get phone() {
    return this.form.get('custRep.phone');
  }
  get email() {
    return this.form.get('custRep.custRepEmailId');
  }

  get custPreferredName() {
    return this.form.get('custPreferredName');
  }

  get title() {
    return this.form.get('custRep.custRepTitle');
  }

  get addressLine1() {
    return this.form.get('addressLine1');
  }

  get addressLine2() {
    return this.form.get('addressLine2');
  }

  get country() {
    return this.form.get('country');
  }
  get state() {
    return this.form.get('state')
  }
  get city() {
    return this.form.get('city');
  }
  get zip() {
    return this.form.get('zip');
  }

  get affiliateName() {
    return this.form.get('affiliateName');
  }

  /*search = (text$: Observable<string>) =>
  text$
    .debounceTime(300)
    .distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      this.involvedService.lookUpUser(term)
        .do(() => this.searchFailed = false)
        .catch(() => {
          this.searchFailed = true;
          return ([]);
        }))
    .do(() => this.searching = false)
    .merge(this.hideSearchingWhenUnsubscribed);*/



  formatter = (x: { value: string }) => x.value;


  searchUser() {

    if (this.searchSalesTeam.length >= 3) {
      this.httpCancelService.cancelPendingRequests();
      this.pendingRequest = this.involvedService.lookUpUser(this.searchSalesTeam).subscribe((res: any) => {
        this.salesData = res.data;
      });
    }
  }

  onChangeInputValue(value: string) {
    const val = value.toLowerCase();
    if (val.length < 3) {
      this.involvedService.suggestionsArrFiltered = [];
    }
    if (val.length >= 3) {
      this.involvedService.lookUpUser(val);
    }
  }

  // reopen qual at page level
  reopenQual() {
    this.qualService.reopenQual();
    // subscibe to emitter to get value of roadmappath 
    this.subscribers.roadMapEmitter = this.qualService.roadMapEmitter.subscribe((roadMapPath: any) => {
      // enable edit icon only if qual edit is present
      if (this.permissionService.qualEdit) {
        this.appDataService.isProposalIconEditable = true;
      } else {
        this.appDataService.isProposalIconEditable = false;
      }
      // if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        // enable the form to be editable
        this.enableEditPage();
      }
    });
  }


  onSuggestedItemsClick(selectedValue) {
    let alreadySelected = false;
    for (let i = 0; i < this.selectedSales.length; i++) {
      if (this.selectedSales[i].fullName === selectedValue.fullName) {
        this.searchSalesTeam = '';
        alreadySelected = true;
        break;
      }
    }
    if (alreadySelected) {
      return;
    }
    this.selectedSales.push(selectedValue);
    this.estNotifyEmail = true;
    this.estNotifyWebex = true;
    this.estNotifyWalkme = true;
    this.searchSalesTeam = '';
    this.involvedService.suggestionsArrFiltered = [];
    const element = this.renderer.selectRootElement('#searchSalesTeam');
    element.focus();
    setTimeout(() => {
      this.displayExtendedTeamList = true;
    }, 501);
  }

  onSuggestedSpecialistClick(selectedValue) {
    if (this.selectedSpecialist.includes(selectedValue)) {
      this.searchSpecialist = '';
      return;
    }
    this.selectedSpecialist.push(selectedValue);
    this.swssNotifyEmail = true;
    this.swssNotifyWebex = true;
    this.swssNotifyWalkme = true;
    this.searchSpecialist = '';
    const element = this.renderer.selectRootElement('#searchSpecialist');
    element.focus();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.salesData.filter(v => v.fullName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),)


  selectedItem(c) {
    this.selectedSales.push(c);
    const element = this.renderer.selectRootElement('#searchSalesTeam');
    element.focus();
    setTimeout(() => {
      this.searchSalesTeam = '';
    }, 100);
    // if (this.modelArr.length > 0) {
    //   let flag = false;
    //   for (let j = 0; j < this.modelArr.length; j++) {
    //     if (this.modelArr[j] === c.item.value) {
    //       flag = true;
    //     }
    //   }
    //   if (!flag) {
    //     this.modelArr.push(c.item.value);
    //   }
    // } else {
    //   this.modelArr.push(c.item.value);
    // }
  }

  removeSelected(a) {
    for (let i = 0; i < this.selectedSales.length; i++) {
      if (this.selectedSales[i] === a) {
        this.selectedSales.splice(i, 1);
        if (this.selectedSales.length === 0) { // Unchecks the email/webex notifaction checkboxes
          this.estNotifyEmail = false;
          this.estNotifyWebex = false;
          this.estNotifyWalkme = false;
        }
      }
    }
  }

  removeSelectedSpecialist(a) {
    for (let i = 0; i < this.selectedSpecialist.length; i++) {
      if (this.selectedSpecialist[i] === a) {
        this.selectedSpecialist.splice(i, 1);
        if (this.selectedSpecialist.length === 0) { // Unchecks the email/webex notifaction checkboxes
          this.swssNotifyEmail = false;
          this.swssNotifyWebex = false;
          this.swssNotifyWalkme = false;
        }
      }
    }
  }
  // check salesspecialist notify type and set the value
  checkNotifySwss(notifyType) {
    if (notifyType === this.constansService.SWSS_EMAIL) {
      this.swssNotifyEmail = !this.swssNotifyEmail;
    } else if (notifyType === this.constansService.SWSS_WEBEX) {
      this.swssNotifyWebex = !this.swssNotifyWebex;
    } if (notifyType === this.constansService.SWSS_WALKME) {
      this.swssNotifyWalkme = !this.swssNotifyWalkme;
    }
  }
  // check extended sales specialist notify type and set the value
  checkNotifyEst(notifyType) {
    if (notifyType === this.constansService.EST_EMAIL) {
      this.estNotifyEmail = !this.estNotifyEmail;
    } else if (notifyType === this.constansService.EST_WEBEX) {
      this.estNotifyWebex = !this.estNotifyWebex;
    } else if (notifyType === this.constansService.EST_WALKME) {
      this.estNotifyWalkme = !this.estNotifyWalkme;
    }
  }
  addSpecialist() {
    let access;
    let specialistToSave = [];
    if (this.swssAccessType === this.constansService.RW) {
      access = this.constansService.RW;
    } else {
      access = this.constansService.RO;
    }
    for (let i = 0; i < this.selectedSpecialist.length; i++) {
      this.selectedSpecialist[i].access = access;
      this.selectedSpecialist[i].notification = this.swssNotifyEmail ? 'Y' : 'N';
      this.selectedSpecialist[i].webexNotification = this.swssNotifyWebex ? 'Y' : 'N';
      this.selectedSpecialist[i].notifyByWelcomeKit = this.swssNotifyWalkme ? 'Y' : 'N';
    }

    for (let i = 0; i < this.selectedSpecialist.length; i++) {
      let alreadyAdded = false;
      for (let j = 0; j < this.qualService.qualification.softwareSalesSpecialist.length; j++) {
        if (this.selectedSpecialist[i].name === this.qualService.qualification.softwareSalesSpecialist[j].name) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        specialistToSave.push(this.selectedSpecialist[i])
      }
    }

    const addContactRequest = {
      'data': specialistToSave
    };
    if (specialistToSave.length > 0) {
      this.involvedService.contactAPICall(
        WhoInvolvedService.METHOD_ADD_CONTACT,
        this.qualService.qualification.qualID,
        addContactRequest,
        WhoInvolvedService.TYPE_SSP,
        this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (!res.error) {
            if (!this.partnerLedFlow) {
              this.appDataService.persistErrorOnUi = false;
            }
            this.swssNotifyEmail = false;// set to false after the operation success
            this.swssNotifyWebex = false;
            this.swssNotifyWalkme = false;
            this.selectedSpecialist = [];
            this.qualService.qualification.softwareSalesSpecialist = res.data;
            this.qualService.updateSessionQualData();
            this.checkboxSelectors();
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
    } else {
      this.selectedSpecialist = [];
    }
  }

  addMembers(type: string, camObject = null) {
    // console.log(type)
    let salesRequest: Array<any>;
    let urlType = WhoInvolvedService.TYPE_EST;
    if (this.qualService.qualification.extendedsalesTeam.length === 0) {
      salesRequest = this.selectedSales;
    } else {
      salesRequest = new Array<any>();
      if (camObject === null) {
        const sizeOfSelectedMembers = this.qualService.qualification.extendedsalesTeam.length;
        const sizeOfSelectedSales = this.selectedSales.length;
        // let isMemberAlreadyPresent = false;
        for (let i = 0; i < sizeOfSelectedSales; i++) {
          let isMemberAlreadyPresent = false;
          const inputObj = this.selectedSales[i];
          for (let j = 0; j < sizeOfSelectedMembers; j++) {
            const selectedObj = this.qualService.qualification.extendedsalesTeam[j];
            if (inputObj.fullName === selectedObj.name) {
              isMemberAlreadyPresent = true;
              break;
            }
          }
          if (!isMemberAlreadyPresent) {
            inputObj['cam'] = false;
            salesRequest.push(inputObj);
          }
        }
      } else {
        const camObj = {
          'fullName': camObject.firstName + ' ' + camObject.lastName,
          'firstName': camObject.firstName,
          'lastName': camObject.lastName,
          'email': camObject.camEmail,
          'ccoId': camObject.cecId,
          'cam': true
        };
        urlType = WhoInvolvedService.TYPE_CAM;
        salesRequest.push(camObj);
      }
    }
    // check the type of adding a new extended saled team and set the values
    if (type === 'createNew') {
      this.estNotifyEmail = true;
      this.estNotifyWebex = true;
      this.estNotifyWalkme = true;
    }
    const requestData = this.involvedService.prepareRequestData(
      salesRequest, this.estAccessType, this.estNotifyEmail, this.estNotifyWebex, this.estNotifyWalkme);
    if (requestData && requestData.length > 0) {
      const addContactRequest = {
        'data': requestData
      };
      this.involvedService.contactAPICall(
        WhoInvolvedService.METHOD_ADD_CONTACT,
        this.qualService.qualification.qualID,
        addContactRequest,
        urlType,
        this.appDataService.userInfo.userId).
        subscribe((res: any) => {
          if (res) {
            if (res.messages && res.messages.length > 0) {
              this.messageService.displayMessagesFromResponse(res);
            }
            if (!res.error && res.data) {
              this.estNotifyEmail = false; // set the values to false after response success
              this.estNotifyWebex = false;
              this.estNotifyWalkme = false;
              this.qualService.qualification.extendedsalesTeam = res.data;
              this.addMember = true;
              // update qualification object in session
              this.qualService.updateSessionQualData();
              // If status value is validated update it to In Progress
              // if (this.qualService.qualification.qualStatus !== 'In Progress') {
              //  this.qualService.updateQualStatus(); 
              //  }
              this.checkboxSelectors();
            }
          }

        });
    }
    this.selectedSales = [];
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // dropped(evt: any) {
  //   this.processFile(evt[0]);
  //   console.log(evt);
  //   (<HTMLInputElement>document.getElementById('file')).value = '';
  // }

  // onFileChange(evt: any) {
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   console.log(target);
  //   this.processFile(target.files[0]);
  //   (<HTMLInputElement>document.getElementById('file')).value = '';
  // }

  // processFile(file) {
  //   const fileName = file.name;
  //   const idxDot = fileName.lastIndexOf('.') + 1;
  //   const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  //   this.qualService.fileFormatError = false;
  //   if (['pdf'].indexOf(extFile) === -1) {
  //     this.uploader.queue.length = 0;
  //     this.qualService.fileFormatError = true;
  //     this.qualService.qualification.customerInfo.filename = file.name;
  //     //return;
  //   }
  //   else {//If uploaded file is pdf file then need to make ajax call and upload the file.
  //     const formData = new FormData();
  //     formData.append(fileName, file);
  //     const qualId = this.qualService.qualification.qualID;
  //     this.involvedService.uploadPdfFile(file, qualId).subscribe((response: any) => {
  //       if (!response.error && !response.messages) {
  //         //TODO : need to put success message.
  //         this.qualService.qualification.customerInfo.filename = fileName;
  //       }
  //     });
  //   }
  // }

  removeItem() {
    // item.remove();
    this.involvedService.removeFile().subscribe((res: any) => {
      if (!res.error) {
        this.uploader.queue.length = 0;
        this.qualService.fileFormatError = false;
        this.qualService.qualification.customerInfo.filename = '';
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }

    });
    // this.colHeaders = [];
  }

  showList() {
    this.displayList = true;
  }
  
  hideList() {
    setTimeout(() => {
      this.displayList = false;
    }, 500);

  }
  showExtendedTeamList(){
    this.displayExtendedTeamList = true;
    this.searchSalesTeam = '';
    this.involvedService.suggestionsArrFiltered = [];
  }

  hideExtendedTeamList(){
    setTimeout(() => {
      this.displayExtendedTeamList = false;
    }, 500);
  }


  removeSpecialist(specialist, event) {
    // remove specialist propery from specialist object as its not required in http request
    delete specialist.specialist;

    const salesRequest = new Array<any>();
    salesRequest.push(specialist);

    const addContactRequest = {
      'data': salesRequest
    }
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID, addContactRequest,
      WhoInvolvedService.TYPE_SSP, this.appDataService.userInfo.userId).subscribe((res: any) => {
      // this.addSpecialistData = res.data;
      if (!res.error) {
        for (let i = 0; i < this.qualService.qualification.softwareSalesSpecialist.length; i++) {
          if (this.qualService.qualification.softwareSalesSpecialist[i] === specialist) {
            this.qualService.qualification.softwareSalesSpecialist.splice(i, 1);
            this.involvedService.previouslySelectedSpecialist = this.qualService.qualification.softwareSalesSpecialist;
          }
        }
        this.qualService.updateSessionQualData();
        this.checkboxSelectors();
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // If status value is validated update it to In Progress
    // if (this.qualService.qualification.qualStatus !== 'In Progress') {
    // this.qualService.updateQualStatus();
    // }
  }

  removeMembers(c) {
    for (let i = 0; i < this.qualService.qualification.extendedsalesTeam.length; i++) {
      if (this.qualService.qualification.extendedsalesTeam[i] === c) {
        // this.selectedMembers.splice(i, 1);
        const salesRequest = new Array<any>();
        salesRequest.push(c);
        const removeContactRequest = {
          // 'qualId':this.qualService.qualID,
          // 'type':WhoInvolvedService.TYPE_EST,
          'data': salesRequest
        };
        this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID, removeContactRequest,
          WhoInvolvedService.TYPE_EST, this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (res) {
            if (res.messages && res.messages.length > 0) {
              this.messageService.displayMessagesFromResponse(res);
            }
            if (!res.error) {
              if (res.data) { // When we have only one row and that got deleted then API is not going to data.
                this.qualService.qualification.extendedsalesTeam = res.data;
              } else {
                this.qualService.qualification.extendedsalesTeam = [];
              }
              this.checkboxSelectors();
              // If status value is validated update it to In Progress
              // if (this.qualService.qualification.qualStatus !== 'In Progress') {
              // this.qualService.updateQualStatus();
              // }
              this.qualService.updateSessionQualData();
            }
          }
        });
      }
    }
  }

  continueToGeography() {
    if (this.qualService.qualification.softwareSalesSpecialist.length < 1 && !this.partnerLedFlow && !this.isChangeSubFlow) {
      // this.messageService.displayUiTechnicalError('SSS');
      this.appDataService.persistErrorOnUi = true;
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'qual.whoinvolved.SW_SALES_SPEC'), MessageType.Error));
    }  else if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName === '' &&
    (this.partnerLedFlow || this.isPartnerDeal) && !this.isChangeSubFlow) {
      this.appDataService.persistErrorOnUi = true;
      this.isCamSelected = false;
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'qual.whoinvolved.CAM_SELECTION'), MessageType.Error));
    } else if (this.form.invalid || !this.isDomainValid) {
      // this.messageService.displayUiTechnicalError('REQUIRED');
      this.appDataService.persistErrorOnUi = true;
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'qual.whoinvolved.REQUIRED_FIELDS'), MessageType.Error));
      // Add required error message using message service
    }  else if (!this.form.invalid && (this.form.dirty || this.form.touched)) {

      if((!this.name.value?.trim() && this.phone.value?.number) || (this.name.value && !this.phone.value?.number)){
        this.appDataService.persistErrorOnUi = true;
      this.messageService.displayMessages(this.appDataService.setMessageObject("Please provide both name and phone number to continue.", MessageType.Error));
        return;
      }
      
      // create an interface for reqObj
      this.qualService.qualification.legalInfo.addressLine1 = this.addressLine1.value;
      this.qualService.qualification.legalInfo.addressLine2 = this.addressLine2.value ? this.addressLine2.value.trim() : "";
      this.qualService.qualification.legalInfo.city = this.city.value;
      this.qualService.qualification.legalInfo.country = this.country.value;
      this.qualService.qualification.legalInfo.state = this.state.value;
      this.qualService.qualification.legalInfo.zip = this.zip.value;
      this.qualService.qualification.customerInfo.repName = this.name.value ? this.name.value.trim() : "";
      this.qualService.qualification.customerInfo.repTitle = this.title.value ? this.title.value.trim() : "";
      this.qualService.qualification.customerInfo.repEmail = this.email.value;
      this.qualService.qualification.customerInfo.preferredLegalName = this.custPreferredName.value;
      this.qualService.qualification.federal = this.federalValue;
      this.qualService.qualification.cam = this.selectedCam;
      if(this.phone.value?.number){
        this.qualService.qualification.customerInfo.phoneCountryCode = this.phone.value.dialCode
        this.qualService.qualification.customerInfo.phoneNumber = this.eaService.getPhoneNumber(this.phone.value.e164Number,this.phone.value.dialCode);
        this.qualService.qualification.customerInfo.dialFlagCode = this.phone.value.countryCode
      } else {
        this.qualService.qualification.customerInfo.phoneCountryCode = '';
        this.qualService.qualification.customerInfo.phoneNumber = '';
        this.qualService.qualification.customerInfo.dialFlagCode = '';
      }

      const reqObj = this.qualService.getQualInfo();

      // Not send affiliate name ,filename and scope as its hidden from who's involved
      delete reqObj['customerContact']['affiliateNames'];
      delete reqObj['customerContact']['filename'];
      delete reqObj['customerContact']['scope'];

      reqObj['customerContact']['preferredLegalAddress'] = this.qualService.qualification.legalInfo;
      this.qualService.updateQual(reqObj).subscribe((response: any) => {
        if (response) {
          if (response.messages && response.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(response);
          }
          if (!response.error) {
            this.qualService.qualification.qualStatus = response.qualStatus;
            this.qualService.updateSessionQualData();
            this.roadMap.eventWithHandlers.continue();
          }
        }
      });

    } else {
      this.roadMap.eventWithHandlers.continue();
    }
  }

  updateEstRow(obj, updateType) {
    this.updateEstRowObject(obj, updateType);
    obj['archname'] = AppDataService.ARCH_NAME;
    const dataArray = new Array(); // Creating array for preparing request.
    dataArray.push(obj);
    const updateContactRequest = {
      'data': dataArray
    }
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      updateContactRequest, WhoInvolvedService.TYPE_EST, this.appDataService.userInfo.userId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          this.qualService.updateSessionQualData();
          // If status value is validated update it to In Progress
          // if (this.qualService.qualification.qualStatus !== 'In Progress') {
          // this.qualService.updateQualStatus();
          // }
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          this.updateEstRowObject(obj, updateType);
        }
      }
    });
    this.checkboxSelectors();
  }


  private updateEstRowObject(obj, updateType) {
    if (updateType === 'notification') {
      if (obj.notification === 'Yes') {
        obj.notification = 'No';
      } else {
        obj.notification = 'Yes';
      }
    } else if (updateType === 'accessType') { // else condition will execute when user change access type for any row.
      if (obj.access === this.constansService.RO) {
        obj.access = this.constansService.RW;
      } else {
        obj.access = this.constansService.RO;
      }
    } else if (updateType === 'webexTeam') {
      if (obj.webexNotification === 'Y') {
        obj.webexNotification = 'N';
      }  else {
        obj.webexNotification = 'Y';
      }
    } else if (updateType === 'walkmeTeam') {
      if (obj.notifyByWelcomeKit === 'Y') {
        obj.notifyByWelcomeKit = 'N';
      }  else {
        obj.notifyByWelcomeKit = 'Y';
      }
    }
  }

  SspEditAccess(event, specialist) {
    specialist.access = event.target.value;
    console.log(event);
    if (event.target.value === this.constansService.RW) {
      specialist.access = this.constansService.RW;
    } else {
      specialist.access = this.constansService.RO;
    }
    console.log(specialist);
    const salesRequest = new Array<any>();
    salesRequest.push(specialist);
    const addContactRequest = {
      'data': salesRequest
    }
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      addContactRequest, WhoInvolvedService.TYPE_SSP, this.appDataService.userInfo.userId).subscribe((res: any) => {
      if (!res.error) {
        this.qualService.updateSessionQualData();
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });

    // If status value is validated update it to In Progress
    // if (this.qualService.qualification.qualStatus !== 'In Progress') {
    // this.qualService.updateQualStatus();
    // }
  }

  SspEditCheckbox(event, specialist, checkboxType) {
    // Add checked value to checkbox type(email/notification)
    if (checkboxType === 'email') {
      if (event === false) {
        specialist.notification = 'N';
      } else {
        specialist.notification = 'Y';
      }

    } else if (checkboxType === 'webexTeam') {
      if (event === false) {
        specialist.webexNotification = 'N';
      } else {
        specialist.webexNotification = 'Y';
      }
    } else if (checkboxType === 'walkmeTeam') {
      if (event === false) {
        specialist.notifyByWelcomeKit = 'N';
      } else {
        specialist.notifyByWelcomeKit = 'Y';
      }
    } else {
      specialist.access = event;
    }

    const salesRequest = new Array<any>();
    salesRequest.push(specialist);
    const addContactRequest = {
      'data': salesRequest
    };
    this.involvedService.contactAPICall(
      WhoInvolvedService.METHOD_UPDATE_CONTACT,
      this.qualService.qualification.qualID,
      addContactRequest,
      WhoInvolvedService.TYPE_SSP,
      this.appDataService.userInfo.userId).subscribe((res: any) => {
        if (!res.error) {
          let sspArr = this.qualService.qualification.softwareSalesSpecialist;
          this.qualService.qualification.softwareSalesSpecialist.forEach(function (SspObj) {
            if (specialist.ccoId === SspObj.ccoId) {
              SspObj = specialist;
            }
          });
          this.qualService.updateSessionQualData();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });

    // If status value is validated update it to In Progress
    // if (this.qualService.qualification.qualStatus !== 'In Progress') {
    // this.qualService.updateQualStatus();
    // }
    this.checkboxSelectors();
  }

  onClickedOutside(e: Event) {
    this.involvedService.suggestionsArrFiltered = [];
  }

  // validateName(){
  //   this.custRepersentativeName = this.appDataService.removeSpecialCharacters(this.custRepersentativeName);
  // }

  domainValidation() {
    if (this.email.invalid) {
      this.isDomainValid = true;
      return;
    }
    const domain = this.email.value.substring(this.email.value.indexOf('@') + 1, this.email.value.indexOf('.')); // get the domain name from the emailId.
    this.isDomainValid = this.appDataService.invalidDomains.indexOf(domain) !== -1 ? false : true;
  }


  toggleCustomerScope(value: boolean) {
    // this.form.touched = true;
    this.qualService.isCustomerScopeVisible = value;
    let x = value === true ? this.constansService.listedAffiliates : this.constansService.NONE;
    this.qualService.qualification.customerInfo.scope = x;
    if (x === this.constansService.NONE && this.qualService.qualification.customerInfo.filename !== '') {
      this.removeItem();
    }
  }

  viewQualification() {
    this.qualService.goToQualification();
  }

  focusCompanyName() {
    const element = this.renderer.selectRootElement('#customerPreferredName');
    element.focus();
  }

  federalCustomerSelected(val) {
    this.federalValue = val;
  }

  updateNotifyAllSWSS(checkboxType) {

    // Array that will hold all the software specialists with their updated notification values
    const salesRequest = new Array<any>();

    if (checkboxType === 'email') {
      this.swssNotifyAllEmail = !this.swssNotifyAllEmail;
      let notify = this.swssNotifyAllEmail ? 'Y' : 'N';

      for (let specialist of this.qualService.qualification.softwareSalesSpecialist) {
        specialist.notification = notify;
        salesRequest.push(specialist);
      }
    } else if (checkboxType === 'webex') {
      this.swssNotifyAllWebex = !this.swssNotifyAllWebex;
      let notify = this.swssNotifyAllWebex ? 'Y' : 'N';

      for (let specialist of this.qualService.qualification.softwareSalesSpecialist) {
        specialist.webexNotification = notify;
        salesRequest.push(specialist);
      }
    } else if (checkboxType === 'walkme') {
      this.swssNotifyAllWalkme = !this.swssNotifyAllWalkme;
      let notify = this.swssNotifyAllWalkme ? 'Y' : 'N';

      for (let specialist of this.qualService.qualification.softwareSalesSpecialist) {
        specialist.notifyByWelcomeKit = notify;
        salesRequest.push(specialist);
      }
    }
    // Array of specialists is added to the request object for API call
    const addContactRequest = {
      'data': salesRequest
    };

    this.involvedService.contactAPICall(
      WhoInvolvedService.METHOD_UPDATE_CONTACT,
      this.qualService.qualification.qualID,
      addContactRequest,
      WhoInvolvedService.TYPE_SSP,
      this.appDataService.userInfo.userId).subscribe((res: any) => {
        if (res && !res.error) {
          let sspArr = this.qualService.qualification.softwareSalesSpecialist;
          this.qualService.qualification.softwareSalesSpecialist.forEach(function (SspObj) {
          });
          this.qualService.updateSessionQualData();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });

  }

  updateNotifyAllEst(checkboxType) {

    // Array that will hold all the extended sales team members with their updated notification values
    const dataArray = new Array();

    if (checkboxType === 'email') {
      this.estNotifyAllEmail = !this.estNotifyAllEmail;
      let notify = this.estNotifyAllEmail ? 'Yes' : 'No';

      for (let member of this.qualService.qualification.extendedsalesTeam) {
        member.notification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'webex') {
      this.estNotifyAllWebex = !this.estNotifyAllWebex;
      let notify = this.estNotifyAllWebex ? 'Y' : 'N';

      for (let member of this.qualService.qualification.extendedsalesTeam) {
        member.webexNotification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'walkme') {
      this.estNotifyAllWalkme = !this.estNotifyAllWalkme;
      let notify = this.estNotifyAllWalkme ? 'Y' : 'N';

      for (let member of this.qualService.qualification.extendedsalesTeam) {
        member.notifyByWelcomeKit = notify;
        dataArray.push(member);
      }
    }

    // Array of specialists is added to the request object
    const updateContactRequest = {
      'data': dataArray
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      updateContactRequest, WhoInvolvedService.TYPE_EST, this.appDataService.userInfo.userId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          this.qualService.updateSessionQualData();
          // If status value is validated update it to In Progress
          // if (this.qualService.qualification.qualStatus !== 'In Progress') {
          // this.qualService.updateQualStatus();
          // }
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          // this.updateEstRowObject(obj, updateType);
        }
      }
    });

  }

  getCountryOfTransactions() {
    this.involvedService.getCountryOfTransactions(this.qualService.qualification.qualID).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          this.countryOfTransactions = response.countries;
          let countryCode = ''
          for (let i = 0; i < this.countryOfTransactions.length; i++) {
            if (this.countryOfTransactions[i].countryName === this.country.value) {
              countryCode = this.countryOfTransactions[i].isoCountryAlpha2;
              break;
            }
          }
          if (countryCode) {
            this.getStateList(countryCode);
          }

        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      }
      else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  onCOTChange(cot){
    this.country.setValue(cot.countryName);
    this.state.setValue('');
    this.form.markAsDirty(); 
    this.getStateList(cot.isoCountryAlpha2)
  } 

  getStateList(countryCode){
    this.involvedService.getStateList(countryCode).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          if(response.data){
            this.stateList = response.data
          } else {
            this.stateList = []
          }

        } catch (error) {
          this.stateList = []
          this.messageService.displayUiTechnicalError(error);
        }
      }
      else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  onStateChange(stateObj){
    this.state.setValue(stateObj.state);
    this.form.markAsDirty(); 
  }

  checkboxSelectors() { // Updates the table header checkboxes based on the notification selections 
    // made for the current specialists and sales team members 

    this.swssNotifyAllEmail = true;
    this.swssNotifyAllWebex = true;
    this.swssMasterCheckDisabled = false;
    this.estNotifyAllEmail = true;
    this.estNotifyAllWebex = true;
    this.estMasterCheckDisabled = false;

    this.swssNotifyAllWalkme = true;
    // this.swssNotifyWalkme = true;
    this.estNotifyAllWalkme = true;
    // this.estNotifyWalkme = true;

    if (this.qualService.qualification.extendedsalesTeam.length === 0) {
      this.estNotifyAllEmail = false;
      this.estNotifyAllWebex = false;
      this.estNotifyAllWalkme = false;
      this.estMasterCheckDisabled = true;
    } else {
      for (let member of this.qualService.qualification.extendedsalesTeam) {
        if (member.notification === 'No') {
          this.estNotifyAllEmail = false;
        }
        if (member.webexNotification === 'N') {
          this.estNotifyAllWebex = false;
        } if (member.notifyByWelcomeKit === 'N' || !member.hasOwnProperty('notifyByWelcomeKit')) {
          this.estNotifyAllWalkme = false;
        }
      }
    }

    if (this.qualService.qualification.softwareSalesSpecialist.length === 0) {
      this.swssNotifyAllEmail = false;
      this.swssNotifyAllWalkme = false;
      this.swssNotifyAllWebex = false;
      this.swssMasterCheckDisabled = true;
    } else {
      for (let specialist of this.qualService.qualification.softwareSalesSpecialist) {
        if (specialist.notification === 'N') {
          this.swssNotifyAllEmail = false;
        }
        if (specialist.webexNotification === 'N') {
          this.swssNotifyAllWebex = false;
        }
        if (specialist.notifyByWelcomeKit === 'N' || !specialist.hasOwnProperty('notifyByWelcomeKit')) {
          this.swssNotifyAllWalkme = false;
        }
      }
    }
  }
  preparePhoneValue(){
    // if(this.qualService.qualification.customerInfo.phoneNumber || 1===1){
    //   this.phoneNumber.number = '6137901111'//this.qualService.qualification.customerInfo.phoneNumber
    //   this.phoneNumber.dialCode = '+1'//this.qualService.qualification.customerInfo.phoneCountryCode
    //   this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
    //   this.phoneNumber.countryCode = 'CA'
    // }
    if(this.qualService.qualification.customerInfo.phoneNumber){
      this.phoneNumber.number = this.qualService.qualification.customerInfo.phoneNumber
      this.phoneNumber.dialCode = this.qualService.qualification.customerInfo.phoneCountryCode
      this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
      this.phoneNumber.countryCode = this.qualService.qualification.customerInfo.dialFlagCode;
    }
  }
}
