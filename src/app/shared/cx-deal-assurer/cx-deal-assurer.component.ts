
import {map} from 'rxjs/operators';

import {distinctUntilChanged} from 'rxjs/operators';

import {debounceTime} from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { PermissionService } from '@app/permission.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { Observable } from 'rxjs';
import { AppDataService } from '../services/app.data.service';
import { ConstantsService } from '../services/constants.service';
import { LocaleService } from '../services/locale.service';
import { MessageService } from '../services/message.service';
import { UtilitiesService } from '../services/utilities.service';
import { CxPriceEstimationService } from "@app/proposal/edit-proposal/cx-price-estimation/cx-price-estimation.service";

@Component({
  selector: 'app-cx-deal-assurer',
  templateUrl: './cx-deal-assurer.component.html',
  styleUrls: ['./cx-deal-assurer.component.scss']
})
export class CxDealAssurerComponent implements OnInit, OnChanges {

  selectedCxDealAssurer = []; // set selected CX DealAssurer data
  @Input() dataFlow;
  @Input() public cxDealAssurerTeams: any; // set cxspteams data
  @Input() type: any;
  addMember = false;
  searching = false;
  searchFailed = false;
  searchCxDealAssurer: any;
  salesData = [];
  daelAssurerNotifyEmail = false;
  daelAssurerNotifyWebex = false;
  daelAssurerNotifyAllEmail: boolean;
  daelAssurerNotifyAllWebex: boolean;
  dealAssurerMasterCheckDisabled: boolean;
  dealAssurerAccessType = this.constansService.RW; // This variable use for Cx SP access type
  cxSearchData = [];
  searchArray = ['name', 'email', 'ccoId'];
  displayList = false;

  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  
  constructor(public localeService: LocaleService, public involvedService: WhoInvolvedService, public permissionService: PermissionService,
    private renderer: Renderer2, public appDataService: AppDataService, public qualService: QualificationsService, 
    public messageService: MessageService, public constansService: ConstantsService, public utilitiesService: UtilitiesService,public cxPriceEstimationService: CxPriceEstimationService) { }

  ngOnInit() {
    this.qualService.qualification.cxDealAssurerTeams = this.cxDealAssurerTeams;
    this.searchCxDealAssurer = '';
    this.selectedCxDealAssurer = [];
    if (this.qualService.qualification.cxDealAssurerTeams) {
      this.addMember = true;
    }

    this.salesData = [];
    this.checkboxSelectors(); // to check and set header level check boxes
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkboxSelectors();
  }

  onSuggestedItemsClick(selectedValue) {
    let alreadySelected = false;
    for (let i = 0; i < this.selectedCxDealAssurer.length; i++) {
      if (this.selectedCxDealAssurer[i].fullName === selectedValue.fullName) {
        this.searchCxDealAssurer = '';
        alreadySelected = true;
        break;
      }
    }
    if (alreadySelected) {
      return;
    }
    this.selectedCxDealAssurer.push(selectedValue);
    this.daelAssurerNotifyEmail = true;
    this.daelAssurerNotifyWebex = true;
    this.searchCxDealAssurer = '';
    this.involvedService.suggestionsArrFiltered = [];
    const element = this.renderer.selectRootElement('#searchCxDealAssurer');
    element.focus();
    setTimeout(() => {
      this.displayList = true;
    }, 501);
  }

  showList() { 
    this.displayList = true;
    this.searchCxDealAssurer = '';
    this.involvedService.suggestionsArrFiltered = [];
  }

  hideList() {
    setTimeout(() => {
      this.displayList = false;
    }, 500);

  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map(term => term === '' ? []
      : this.salesData.filter(v => v.fullName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),)


selectedItem(c) {
  this.selectedCxDealAssurer.push(c);
  const element = this.renderer.selectRootElement('#searchSalesTeam');
  element.focus();
  setTimeout(() => {
    this.searchCxDealAssurer = '';
  }, 100);
}

  addMembers() {
    let access;
    let dealAssurerToSave = [];
    if (this.dealAssurerAccessType === this.constansService.RW) {
      access = this.constansService.RW;
    } else {
      access = this.constansService.RO;
    }
    for (let i = 0; i < this.selectedCxDealAssurer.length; i++) {
      this.selectedCxDealAssurer[i].access = access;
      this.selectedCxDealAssurer[i].webexNotification = this.daelAssurerNotifyWebex ? 'Y' : 'N';
      this.selectedCxDealAssurer[i].notification = this.daelAssurerNotifyEmail ? 'Yes' : 'No';
      let alreadyAdded = false;
      for (let j = 0; j < this.qualService.qualification.cxDealAssurerTeams.length; j++) {
        if (this.selectedCxDealAssurer[i].fullName === this.qualService.qualification.cxDealAssurerTeams[j].fullName) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        dealAssurerToSave.push(this.selectedCxDealAssurer[i])
      }
    }

    const addContactRequest = {
      'data': dealAssurerToSave
    };
    if (dealAssurerToSave.length > 0) {
      this.involvedService.contactAPICall(
        WhoInvolvedService.METHOD_ADD_CONTACT,
        this.qualService.qualification.qualID,
        addContactRequest,
        WhoInvolvedService.TYPE_CX_ASSURERS,
        this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (!res.error) {
            this.daelAssurerNotifyEmail = false;// set to false after the operation success
            this.daelAssurerNotifyWebex = false;
            this.selectedCxDealAssurer = [];
            this.qualService.qualification.cxDealAssurerTeams = res.data;
            this.qualService.updateSessionQualData();
            this.checkboxSelectors();
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
    } else {
      this.selectedCxDealAssurer = [];
    }
  }

  updateNotifyAllCxSp(checkboxType) {

    // Array that will hold all the extended sales team members with their updated notification values
    const dataArray = new Array();

    if (checkboxType === 'email') {
      this.daelAssurerNotifyAllEmail = !this.daelAssurerNotifyAllEmail;
      let notify = this.daelAssurerNotifyAllEmail ? 'Yes' : 'No';

      for (let member of this.qualService.qualification.cxDealAssurerTeams) {
        member.notification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'webex') {
      this.daelAssurerNotifyAllWebex = !this.daelAssurerNotifyAllWebex;
      let notify = this.daelAssurerNotifyAllWebex ? 'Y' : 'N';

      for (let member of this.qualService.qualification.cxDealAssurerTeams) {
        member.webexNotification = notify;
        dataArray.push(member);
      }
    } 
    if(!dataArray.length){
      return;
    }

    // Array of specialists is added to the request object
    const updateContactRequest = {
      'data': dataArray
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      updateContactRequest, WhoInvolvedService.TYPE_CX_ASSURERS, this.appDataService.userInfo.userId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          this.qualService.updateSessionQualData();
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          // this.updateCxSpRowObject(obj, updateType);
        }
      }
    });

  }

  updateCxSpRow(obj, updateType) {
    this.updateCxSpRowObject(obj, updateType);
    const dataArray = new Array(); // Creating array for preparing request.
    dataArray.push(obj);
    const updateContactRequest = {
      'data': dataArray
    }
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      updateContactRequest, WhoInvolvedService.TYPE_CX_ASSURERS, this.appDataService.userInfo.userId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          this.qualService.updateSessionQualData();
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          this.updateCxSpRowObject(obj, updateType);
        }
      }
    });
    this.checkboxSelectors();
  }


  public updateCxSpRowObject(obj, updateType) {
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
    } 
  }

  checkNotifyCxSp(notifyType) {
    if (notifyType === this.constansService.CX_EMAIL) {
      this.daelAssurerNotifyEmail = !this.daelAssurerNotifyEmail;
    } else if (notifyType === this.constansService.CX_WEBEX) {
      this.daelAssurerNotifyWebex = !this.daelAssurerNotifyWebex;
    } 
    // else if (notifyType === this.constansService.CX_WALKME) {
    //   this.cxSpNotifyWalkme = !this.cxSpNotifyWalkme;
    // }
  }

  removeSelectedCxDealAssurer(a) {
    for (let i = 0; i < this.selectedCxDealAssurer.length; i++) {
      if (this.selectedCxDealAssurer[i] === a) {
        this.selectedCxDealAssurer.splice(i, 1);
        if (this.selectedCxDealAssurer.length === 0) { // Unchecks the email/webex notifaction checkboxes
          this.daelAssurerNotifyEmail = false;
          this.daelAssurerNotifyWebex = false;
        }
      }
    }
  }

  removeAssurer(assurerToDelete) {
    const removeContactRequest = {
      'data': [assurerToDelete]
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID, removeContactRequest,
      WhoInvolvedService.TYPE_CX_ASSURERS, this.appDataService.userInfo.userId).subscribe((res: any) => {
        if (res) {
          if (res.messages && res.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(res);
          }
          if (!res.error) {
            if (res.data) { // When we have only one row and that got deleted then API is not going to data.
              this.qualService.qualification.cxDealAssurerTeams = res.data;
            } else {
              this.qualService.qualification.cxDealAssurerTeams = [];
            }
            this.checkboxSelectors();
            this.qualService.updateSessionQualData();
          }
        }
      });
  }

  onClickedOutside(e: Event) {
    this.involvedService.suggestionsArrFiltered = [];
  }

  checkboxSelectors() { // Updates the table header checkboxes based on the notification selections 
    // made for the current specialists and sales team members 

    this.daelAssurerNotifyAllEmail = true;
    this.daelAssurerNotifyAllWebex = true;
    this.dealAssurerMasterCheckDisabled = false;

    if (this.qualService.qualification.cxDealAssurerTeams?.length === 0) {
      this.daelAssurerNotifyAllEmail = false;
      this.daelAssurerNotifyAllWebex = false;
      this.dealAssurerMasterCheckDisabled = true;
    } else {
      for (let member of this.qualService.qualification.cxDealAssurerTeams) {
        if (member.notification === 'No') {
          this.daelAssurerNotifyAllEmail = false;
        }
        if (member.webexNotification === 'N') {
          this.daelAssurerNotifyAllWebex = false;
        } 
      }
    }

  }

  focusSales(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
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
}
