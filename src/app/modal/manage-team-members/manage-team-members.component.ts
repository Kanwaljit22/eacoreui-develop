
import {map} from 'rxjs/operators';

import {distinctUntilChanged} from 'rxjs/operators';

import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { QualificationsService, ICam } from '@app/qualifications/qualifications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { HttpCancelService } from '../../shared/services/http.cancel.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-team-members',
  templateUrl: './manage-team-members.component.html',
  styleUrls: ['./manage-team-members.component.scss']
})
export class ManageTeamMembersComponent implements OnInit, OnDestroy {

  selectedSales = [];
  proposalId = 0;
  selectedSpecialist = [];
  salesData = [];
  searchSalesTeam: string;
  displayExtendedTeamList = false;
  searchPartnersTeam: string;
  salesSpecialist: string;
  estAccessType = this.constansService.RW; // This variable use for EST access type
  extentedSalesTeam = [];
  dedicatedSalesTeam = [];
  distributorTeam = [];
  cxTeamData= [];
  cxDealAssurerTeams = [];
  addMember = false;
  pendingRequest: any;
  searchFailed = false;
  searching = false;
  searchSpecialist: any;
  specialistData = [];
  swssAccessType = this.constansService.RW;
  swssNotifyEmail = false;
  swssNotifyWebex = false;
  swssNotifyWalkme = false;
  estNotifyEmail = false;
  estNotifyWebex = false;
  estNotifyWalkme = false;
  ciscoTeam = [];
  displayList = false;
  searchArray = ['name', 'archName'];
  partnerLedFlow = false;

  swssNotifyAllEmail: boolean;
  swssNotifyAllWebex: boolean;
  swssNotifyAllWalkme: boolean;
  estNotifyAllEmail: boolean;
  estNotifyAllWebex: boolean;
  estNotifyAllWalkme: boolean;

  swssMasterCheckDisabled: boolean;
  estMasterCheckDisabled: boolean;
  dataFlow = false;
  isPartnerDeal = false;
  type: string;

  camData: ICam[];
  selectedCam: ICam;
  camName = 'Select CAM';
  isCamSelected = false;
  is2tPartner = false;
  partnerId = 0; // to set selected PartnerId from proposal
  filterPartnersTeam = false;


  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService, public qualService: QualificationsService, public activeModal: NgbActiveModal,
    public constansService: ConstantsService,
    public involvedService: WhoInvolvedService, public renderer: Renderer2,
    public appDataService: AppDataService, private messageService: MessageService,
    private httpCancelService: HttpCancelService) { }
  ngOnDestroy() {
    this.qualService.qualification.extendedsalesTeam = [];
    this.qualService.qualification.softwareSalesSpecialist = [];
    this.qualService.qualification.partnerTeam = [];
    this.involvedService.suggestionsArrSpecialistFiltered = [];
    this.messageService.disaplyModalMsg = false;
    this.messageService.modalMessageClear();
  }

  ngOnInit() {


    this.is2tPartner = this.qualService.buyMethodDisti; // set 2tpartner flag to hide distributor team 

    this.messageService.disaplyModalMsg = true;
    this.type = 'manageTeam';
    if (!this.qualService.qualification.extendedsalesTeam) {
      this.qualService.qualification.extendedsalesTeam = [];
      this.extentedSalesTeam = [];
    } else {
      this.extentedSalesTeam = this.qualService.qualification.extendedsalesTeam;
    }
    if (!this.qualService.qualification.softwareSalesSpecialist) {
      this.qualService.qualification.softwareSalesSpecialist = [];
      this.dedicatedSalesTeam = [];
    } else {
      this.dedicatedSalesTeam = this.qualService.qualification.softwareSalesSpecialist;
    }
    if (!this.qualService.qualification.partnerTeam) {
      this.qualService.qualification.partnerTeam = [];
    }
    //  else {
    //   // filter the selecter partner team with partnerBeGeoId
    //   if(this.filterPartnersTeam){
    //     this.partnersTeam = this.qualService.qualification.partnerTeam.filter(data => data.beGeoId == this.partnerBeGeoId); 
    //   } else {
    //     this.partnersTeam = this.qualService.qualification.partnerTeam;
    //   }
    // }

    if (!this.qualService.qualification.distributorTeam) {
      this.qualService.qualification.distributorTeam = [];
      this.distributorTeam = [];
    } else {
      this.distributorTeam = this.qualService.qualification.distributorTeam;
    }

    // set cx teams data from api
    if (!this.qualService.qualification.cxTeams) {
      this.qualService.qualification.cxTeams = [];
      this.cxTeamData = [];
    } else {
      this.cxTeamData = this.qualService.qualification.cxTeams;
    }
    // set cx deal assurer data from api
    if (!this.qualService.qualification.cxDealAssurerTeams) {
      this.cxDealAssurerTeams = [];
    } else {
      this.cxDealAssurerTeams = this.qualService.qualification.cxDealAssurerTeams;
    }

    if (this.extentedSalesTeam.length > 0) {
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
    this.isPartnerDeal = this.qualService.qualification.partnerDeal;
    if (this.appDataService.isPatnerLedFlow || this.isPartnerDeal) {
      this.partnerLedFlow = true;
      if (!this.camData) {
        this.getCamData();
      }
    }
    if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName !== '') {
      this.isCamSelected = true;
      this.selectedCam = this.qualService.qualification.cam;
    } else if (this.qualService.qualification.cam && this.qualService.qualification.cam.firstName === '') {
      this.isCamSelected = false;
    }
    this.checkboxSelectors();

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
    this.addMembers(this.selectedCam);
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

  addSelected() {
    this.activeModal.close({
    });
  }
  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
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
  removeSelectedSpecialist(a) {
    for (let i = 0; i < this.selectedSpecialist.length; i++) {
      if (this.selectedSpecialist[i] === a) {
        this.selectedSpecialist.splice(i, 1);
        if (this.selectedSpecialist.length === 0) {
          this.swssNotifyEmail = false;
          this.swssNotifyWebex = false;
          this.swssNotifyWalkme = false;
        }
      }
    }
  }
  // check swss notify type and set the value
  checkNotifySwss(notifyType) {
    if (notifyType === this.constansService.SWSS_EMAIL) {
      this.swssNotifyEmail = !this.swssNotifyEmail;
    } else if (notifyType === this.constansService.SWSS_WEBEX) {
      this.swssNotifyWebex = !this.swssNotifyWebex;
    } else if (notifyType === this.constansService.SWSS_WALKME) {
      this.swssNotifyWalkme = !this.swssNotifyWalkme;
    }
  }
  // check est notify type and set the value
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
    const specialistToSave = [];
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
            this.swssNotifyEmail = false;// set to false after the operation success
            this.swssNotifyWebex = false;
            this.swssNotifyWalkme = false;
            this.swssAccessType = this.constansService.RW;
            this.selectedSpecialist = [];
            this.qualService.qualification.softwareSalesSpecialist = res.data;
            this.dedicatedSalesTeam = res.data;
            this.checkboxSelectors();
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
    } else {
      this.selectedSpecialist = [];
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
      } else {
        obj.webexNotification = 'Y';
      }
    } else if (updateType === 'walkmeTeam') {
      if (obj.notifyByWelcomeKit === 'Y') {
        obj.notifyByWelcomeKit = 'N';
      } else {
        obj.notifyByWelcomeKit = 'Y';
      }
    }
  }

  SspEditAccess(event, specialist) {
    specialist.access = event.target.value;
    if (event.target.value === this.constansService.RW) {
      specialist.access = this.constansService.RW;
    } else {
      specialist.access = this.constansService.RO;
    }
    const salesRequest = new Array<any>();
    salesRequest.push(specialist);
    const addContactRequest = {
      'data': salesRequest
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      addContactRequest, WhoInvolvedService.TYPE_SSP, this.appDataService.userInfo.userId).
      subscribe((res: any) => {
        if (res.error) {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
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
        if (res.error) {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    this.checkboxSelectors();
  }

  onChangeSalesInputValue(value) {
  }
  showList() {
    this.displayList = true;
  }

  hideList() {
    setTimeout(() => {
      this.displayList = false;
    }, 500);

  }

  onChangeInputValue(value) {
    const val = value.toLowerCase();
    if (val.length < 3) {
      this.involvedService.suggestionsArrSpecialistFiltered = [];
    }
    if (val.length >= 3) {
      this.involvedService.lookUpUser(val);
    }
  }

  onSuggestedItemsClick(selectedValue) {
    let alreadySelected = false;
    for (let i = 0; i < this.selectedSales.length; i++) {
      if (this.selectedSales[i].fullName === selectedValue.fullName) {
        this.searchSalesTeam = '';
        this.searchPartnersTeam = '';
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
    this.searchPartnersTeam = '';
    this.involvedService.suggestionsArrFiltered = [];
    const element = this.renderer.selectRootElement('#searchSalesTeam');
    element.focus();
    setTimeout(() => {
      this.displayExtendedTeamList = true;
    }, 501);
  }



  addMembers(camObject = null) {

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
        this.estNotifyEmail = true;
        this.estNotifyWebex = true;
        this.estNotifyWalkme = true;
        salesRequest.push(camObj);
      }
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
              this.estNotifyEmail = false;// set the values to false after response success
              this.estNotifyWebex = false;
              this.estNotifyWalkme = false;
              this.qualService.qualification.extendedsalesTeam = res.data;
              this.extentedSalesTeam = res.data;
              this.addMember = true;
              this.checkboxSelectors();
              //  }
            }
          }

        });
    }
    this.selectedSales = [];
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
        }
        this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID,
          removeContactRequest, WhoInvolvedService.TYPE_EST, this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (res) {
            if (res.messages && res.messages.length > 0) {
              this.messageService.displayMessagesFromResponse(res);
            }
            if (!res.error) {
              if (res.data) { // When we have only one row and that got deleted then API is not going to data.
                this.qualService.qualification.extendedsalesTeam = res.data;
                this.extentedSalesTeam = res.data;
              } else {
                this.qualService.qualification.extendedsalesTeam = [];
                this.extentedSalesTeam = [];
              }
              this.checkboxSelectors();
              // If status value is validated update it to In Progress
              // if (this.qualService.qualification.qualStatus !== 'In Progress') {
              // this.qualService.updateQualStatus();
              // }
            }
          }
        });
      }
    }
  }



  removeSpecialist(specialist, event) {
    // remove specialist propery from specialist object as its not required in http request
    delete specialist.specialist;

    const salesRequest = new Array<any>();
    salesRequest.push(specialist);

    const addContactRequest = {
      'data': salesRequest
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID,
      addContactRequest, WhoInvolvedService.TYPE_SSP, this.appDataService.userInfo.userId)
      .subscribe((res: any) => {
        // this.addSpecialistData = res.data;
        if (!res.error) {
          for (let i = 0; i < this.qualService.qualification.softwareSalesSpecialist.length; i++) {
            if (this.qualService.qualification.softwareSalesSpecialist[i] === specialist) {
              this.qualService.qualification.softwareSalesSpecialist.splice(i, 1);
            }
          }
          if (res.data) {
            this.dedicatedSalesTeam = res.data;
          } else {
            this.dedicatedSalesTeam = [];
          }
          this.checkboxSelectors();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
  }


  removeSelected(a) {
    for (let i = 0; i < this.selectedSales.length; i++) {
      if (this.selectedSales[i] === a) {
        this.selectedSales.splice(i, 1);
        if (this.selectedSales.length === 0) {
          this.estNotifyEmail = false;
          this.estNotifyWebex = false;
          this.estNotifyWalkme = false;
        }
      }
    }
  }


  onClickedOutside(e: Event) {
    this.involvedService.suggestionsArrFiltered = [];
  }


  searchUser() {

    if (this.searchSalesTeam.length >= 3) {
      this.httpCancelService.cancelPendingRequests();
      this.pendingRequest = this.involvedService.lookUpUser(this.searchSalesTeam).subscribe((res: any) => {
        this.salesData = res.data;
      });
    }
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
      this.searchPartnersTeam = '';
    }, 100);
  }

  close() {
    let name = [];
    for (let i = 0; i < this.dedicatedSalesTeam.length; i++) {
      name.push(this.dedicatedSalesTeam[i].name);
    }

    for (let i = 0; i < this.extentedSalesTeam.length; i++) {
      if (!name.includes(this.extentedSalesTeam[i].name)) {
        name.push(this.extentedSalesTeam[i].name);
      }
    }
    this.ciscoTeam = name;

    this.activeModal.close({
      ciscoTeam: this.ciscoTeam
    });
  }

  updateNotifyAllSWSS(checkboxType) {

    const salesRequest = new Array<any>();

    if (checkboxType === 'email') {
      this.swssNotifyAllEmail = !this.swssNotifyAllEmail;
      let notify = this.swssNotifyAllEmail ? 'Y' : 'N';

      for (let specialist of this.dedicatedSalesTeam) {
        specialist.notification = notify;
        salesRequest.push(specialist);
      }
    } else if (checkboxType === 'webex') {
      this.swssNotifyAllWebex = !this.swssNotifyAllWebex;
      let notify = this.swssNotifyAllWebex ? 'Y' : 'N';

      for (let specialist of this.dedicatedSalesTeam) {
        specialist.webexNotification = notify;
        salesRequest.push(specialist);
      }
    } else if (checkboxType === 'walkme') {
      this.swssNotifyAllWalkme = !this.swssNotifyAllWalkme;
      let notify = this.swssNotifyAllWalkme ? 'Y' : 'N';

      for (let specialist of this.dedicatedSalesTeam) {
        specialist.notifyByWelcomeKit = notify;
        salesRequest.push(specialist);
      }
    }


    const addContactRequest = {
      'data': salesRequest
    };
    console.log(addContactRequest.data);
    this.involvedService.contactAPICall(
      WhoInvolvedService.METHOD_UPDATE_CONTACT,
      this.qualService.qualification.qualID,
      addContactRequest,
      WhoInvolvedService.TYPE_SSP,
      this.appDataService.userInfo.userId).subscribe((res: any) => {
        if (!res.error) {
          const sspArr = this.qualService.qualification.softwareSalesSpecialist;
          this.qualService.qualification.softwareSalesSpecialist.forEach(function (SspObj) {
          });
          this.qualService.updateSessionQualData();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
  }

  updateNotifyAllEst(checkboxType) {

    const dataArray = new Array();

    if (checkboxType === 'email') {
      this.estNotifyAllEmail = !this.estNotifyAllEmail;
      let notify = this.estNotifyAllEmail ? 'Yes' : 'No';

      for (let member of this.extentedSalesTeam) {
        member.notification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'webex') {
      this.estNotifyAllWebex = !this.estNotifyAllWebex;
      let notify = this.estNotifyAllWebex ? 'Y' : 'N';

      for (let member of this.extentedSalesTeam) {
        member.webexNotification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'walkme') {
      this.estNotifyAllWalkme = !this.estNotifyAllWalkme;
      let notify = this.estNotifyAllWalkme ? 'Y' : 'N';

      for (let member of this.extentedSalesTeam) {
        member.notifyByWelcomeKit = notify;
        dataArray.push(member);
      }
    }

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
        }
        if (res.error) {
        }
      }
    });

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
  checkboxSelectors() {

    this.swssNotifyAllEmail = true;
    this.swssNotifyAllWebex = true;
    this.swssNotifyAllWalkme = true;
    this.swssMasterCheckDisabled = false;
    this.estNotifyAllEmail = true;
    this.estNotifyAllWebex = true;
    this.estNotifyAllWalkme = true;
    this.estMasterCheckDisabled = false;

    if (this.extentedSalesTeam.length === 0) {
      this.estNotifyAllEmail = false;
      this.estNotifyAllWebex = false;
      this.estNotifyAllWalkme = false;
      this.estMasterCheckDisabled = true;
    } else {
      for (let member of this.extentedSalesTeam) {
        if (member.notification === 'No') {
          this.estNotifyAllEmail = false;
        }
        if (member.webexNotification === 'N') {
          this.estNotifyAllWebex = false;
        }
        if (member.notifyByWelcomeKit === 'N' || !member.hasOwnProperty('notifyByWelcomeKit')) {
          this.estNotifyAllWalkme = false;
        }
      }
    }

    if (this.dedicatedSalesTeam.length === 0) {
      this.swssNotifyAllEmail = false;
      this.swssNotifyAllWebex = false;
      this.swssNotifyAllWalkme = false;
      this.swssMasterCheckDisabled = true;
    } else {
      for (let specialist of this.dedicatedSalesTeam) {
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

}
