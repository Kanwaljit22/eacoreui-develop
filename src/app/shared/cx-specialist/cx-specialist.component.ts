
import {map} from 'rxjs/operators';

import {distinctUntilChanged} from 'rxjs/operators';

import {debounceTime} from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '@app/permission.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AppDataService } from '../services/app.data.service';
import { ConstantsService } from '../services/constants.service';
import { HttpCancelService } from '../services/http.cancel.service';
import { LocaleService } from '../services/locale.service';
import { MessageService } from '../services/message.service';
import { UtilitiesService } from '../services/utilities.service';
import { CxPriceEstimationService } from "@app/proposal/edit-proposal/cx-price-estimation/cx-price-estimation.service";

@Component({
  selector: 'app-cx-specialist',
  templateUrl: './cx-specialist.component.html',
  styleUrls: ['./cx-specialist.component.scss']
})
export class CxSpecialistComponent implements OnInit, OnChanges {

  selectedCxSpecialist = []; // set selected CX specialist data
  @Input() dataFlow;
  @Input() public cxSpTeamData: any; // set cxspteams data
  @Input() type: any;
  addMember = false;
  searching = false;
  searchFailed = false;
  searchCxSpecialist: any;
  salesData = [];
  cxSpNotifyEmail = false;
  cxSpNotifyWebex = false;
  cxSpNotifyWalkme = false;
  cxSpNotifyAllEmail: boolean;
  cxSpNotifyAllWebex: boolean;
  cxSpNotifyAllWalkme: boolean;
  cxSpMasterCheckDisabled: boolean;
  cxSpAccessType = this.constansService.RW; // This variable use for Cx SP access type
  cxSearchData = [];
  searchArray = ['name', 'archName'];
  displayList = false;

  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  
  constructor(public localeService: LocaleService, private modalVar: NgbModal, public involvedService: WhoInvolvedService, private router: Router, public permissionService: PermissionService,
    private renderer: Renderer2, public appDataService: AppDataService, public qualService: QualificationsService,
    public messageService: MessageService, private httpCancelService: HttpCancelService, public constansService: ConstantsService, public utilitiesService: UtilitiesService,public cxPriceEstimationService: CxPriceEstimationService) { }

  ngOnInit() {
    this.qualService.qualification.cxTeams = this.cxSpTeamData;
    this.searchCxSpecialist = '';
    this.selectedCxSpecialist = [];
    if (this.qualService.qualification.cxTeams) {
      this.addMember = true;
    }

    this.salesData = [];
    this.checkboxSelectors(); // to check and set header level check boxes
    this.getAllCxSpecialistList();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkboxSelectors();
  }

  onSuggestedItemsClick(selectedValue) {
    let alreadySelected = false;
    for (let i = 0; i < this.selectedCxSpecialist.length; i++) {
      if (this.selectedCxSpecialist[i].name === selectedValue.name) {
        this.searchCxSpecialist = '';
        alreadySelected = true;
        break;
      }
    }
    if (alreadySelected) {
      return;
    }
    this.selectedCxSpecialist.push(selectedValue);
    this.cxSpNotifyEmail = true;
    this.cxSpNotifyWebex = true;
    this.cxSpNotifyWalkme = true;
    this.searchCxSpecialist = '';
    this.involvedService.suggestionsArrFiltered = [];
    const element = this.renderer.selectRootElement('#searchCxSpecialist');
    element.focus();
  }

  showList() { 
    this.displayList = true;
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
  this.selectedCxSpecialist.push(c);
  const element = this.renderer.selectRootElement('#searchSalesTeam');
  element.focus();
  setTimeout(() => {
    this.searchCxSpecialist = '';
  }, 100);
}

  addMembers() {
    let access;
    let specialistToSave = [];
    if (this.cxSpAccessType === this.constansService.RW) {
      access = this.constansService.RW;
    } else {
      access = this.constansService.RO;
    }
    for (let i = 0; i < this.selectedCxSpecialist.length; i++) {
      this.selectedCxSpecialist[i].access = access;
      this.selectedCxSpecialist[i].notification = this.cxSpNotifyEmail ? 'Yes' : 'No';
      this.selectedCxSpecialist[i].webexNotification = this.cxSpNotifyWebex ? 'Y' : 'N';
      this.selectedCxSpecialist[i].notifyByWelcomeKit = this.cxSpNotifyWalkme ? 'Y' : 'N';
    }

    for (let i = 0; i < this.selectedCxSpecialist.length; i++) {
      let alreadyAdded = false;
      for (let j = 0; j < this.qualService.qualification.cxTeams.length; j++) {
        if (this.selectedCxSpecialist[i].name === this.qualService.qualification.cxTeams[j].name) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        specialistToSave.push(this.selectedCxSpecialist[i])
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
        WhoInvolvedService.TYPE_CXSP,
        this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (!res.error) {
            this.cxSpNotifyEmail = false;// set to false after the operation success
            this.cxSpNotifyWebex = false;
            this.cxSpNotifyWalkme = false;
            this.selectedCxSpecialist = [];
            this.qualService.qualification.cxTeams = res.data;
            this.qualService.updateSessionQualData();
            this.checkboxSelectors();
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
    } else {
      this.selectedCxSpecialist = [];
    }
  }

  updateNotifyAllCxSp(checkboxType) {

    // Array that will hold all the extended sales team members with their updated notification values
    const dataArray = new Array();

    if (checkboxType === 'email') {
      this.cxSpNotifyAllEmail = !this.cxSpNotifyAllEmail;
      let notify = this.cxSpNotifyAllEmail ? 'Yes' : 'No';

      for (let member of this.qualService.qualification.cxTeams) {
        member.notification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'webex') {
      this.cxSpNotifyAllWebex = !this.cxSpNotifyAllWebex;
      let notify = this.cxSpNotifyAllWebex ? 'Y' : 'N';

      for (let member of this.qualService.qualification.cxTeams) {
        member.webexNotification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'walkme') {
      this.cxSpNotifyAllWalkme = !this.cxSpNotifyAllWalkme;
      let notify = this.cxSpNotifyAllWalkme ? 'Y' : 'N';

      for (let member of this.qualService.qualification.cxTeams) {
        member.notifyByWelcomeKit = notify;
        dataArray.push(member);
      }
    }

    // Array of specialists is added to the request object
    const updateContactRequest = {
      'data': dataArray
    };
    this.involvedService.contactAPICall(WhoInvolvedService.METHOD_UPDATE_CONTACT, this.qualService.qualification.qualID,
      updateContactRequest, WhoInvolvedService.TYPE_CXSP, this.appDataService.userInfo.userId).subscribe((res: any) => {
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
      updateContactRequest, WhoInvolvedService.TYPE_CXSP, this.appDataService.userInfo.userId).subscribe((res: any) => {
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
          this.updateCxSpRowObject(obj, updateType);
        }
      }
    });
    this.checkboxSelectors();
  }


  private updateCxSpRowObject(obj, updateType) {
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

  getAllCxSpecialistList() {
    this.appDataService.getTeamMembers('CXSS').subscribe(res => {
      if (res && !res.error) {
        this.cxSearchData = res.data;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  checkNotifyCxSp(notifyType) {
    if (notifyType === this.constansService.CX_EMAIL) {
      this.cxSpNotifyEmail = !this.cxSpNotifyEmail;
    } else if (notifyType === this.constansService.CX_WEBEX) {
      this.cxSpNotifyWebex = !this.cxSpNotifyWebex;
    } else if (notifyType === this.constansService.CX_WALKME) {
      this.cxSpNotifyWalkme = !this.cxSpNotifyWalkme;
    }
  }

  removeSelectedCxSpecialist(a) {
    for (let i = 0; i < this.selectedCxSpecialist.length; i++) {
      if (this.selectedCxSpecialist[i] === a) {
        this.selectedCxSpecialist.splice(i, 1);
        if (this.selectedCxSpecialist.length === 0) { // Unchecks the email/webex notifaction checkboxes
          this.cxSpNotifyEmail = false;
          this.cxSpNotifyWebex = false;
          this.cxSpNotifyWalkme = false;
        }
      }
    }
  }

  removeCxSpMembers(c) {
    for (let i = 0; i < this.qualService.qualification.cxTeams.length; i++) {
      if (this.qualService.qualification.cxTeams[i] === c) {
        // this.selectedMembers.splice(i, 1);
        const salesRequest = new Array<any>();
        salesRequest.push(c);
        const removeContactRequest = {
          // 'qualId':this.qualService.qualID,
          // 'type':WhoInvolvedService.TYPE_EST,
          'data': salesRequest
        };
        this.involvedService.contactAPICall(WhoInvolvedService.METHOD_REMOVE_CONTACT, this.qualService.qualification.qualID, removeContactRequest,
          WhoInvolvedService.TYPE_CXSP, this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (res) {
            if (res.messages && res.messages.length > 0) {
              this.messageService.displayMessagesFromResponse(res);
            }
            if (!res.error) {
              if (res.data) { // When we have only one row and that got deleted then API is not going to data.
                this.qualService.qualification.cxTeams = res.data;
              } else {
                this.qualService.qualification.cxTeams = [];
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

  onClickedOutside(e: Event) {
    this.involvedService.suggestionsArrFiltered = [];
  }

  checkboxSelectors() { // Updates the table header checkboxes based on the notification selections 
    // made for the current specialists and sales team members 

    this.cxSpNotifyAllEmail = true;
    this.cxSpNotifyAllWebex = true;
    this.cxSpMasterCheckDisabled = false;
    this.cxSpNotifyAllWalkme = true;

    if (this.qualService.qualification.cxTeams.length === 0) {
      this.cxSpNotifyAllEmail = false;
      this.cxSpNotifyAllWebex = false;
      this.cxSpNotifyAllWalkme = false;
      this.cxSpMasterCheckDisabled = true;
    } else {
      for (let member of this.qualService.qualification.cxTeams) {
        if (member.notification === 'No') {
          this.cxSpNotifyAllEmail = false;
        }
        if (member.webexNotification === 'N') {
          this.cxSpNotifyAllWebex = false;
        } 
        if (member.notifyByWelcomeKit === 'N' || !member.hasOwnProperty('notifyByWelcomeKit')) {
          this.cxSpNotifyAllWalkme = false;
        }
      }
    }
  }

  focusSales(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }
}
