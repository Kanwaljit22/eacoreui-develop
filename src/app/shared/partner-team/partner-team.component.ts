import { Component, OnInit, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { PermissionService } from '@app/permission.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-partner-team',
  templateUrl: './partner-team.component.html',
  styleUrls: ['./partner-team.component.scss']
})
export class PartnerTeamComponent implements OnInit, OnChanges {
  @Input() dataFlow;
  @Input() partnerDeal: any;
  @Input() type: any;
  @Input() proposalId = 0;
  @Input() filterPartnersTeam = false;
  @Input() partnerId = 0;

  partnersTeam: string;
  partnerLedFlow = false;
  addMember = false;

  ptNotifyEmail = false;
  ptNotifyWebex = false;
  ptNotifyAllEmail = true;
  ptNotifyAllWebex = true;
  ptMasterCheckDisabled: boolean;
  ptAccessType = this.constansService.RW;
  ptNotifyWalkme = true;
  ptNotifyAllWalkme = false;

  disableForDisti = false;
  searching = false;
  searchFailed = false;

  constructor(public localeService: LocaleService, private http: HttpClient, public appDataService: AppDataService,
    public qualService: QualificationsService, public involvedService: WhoInvolvedService, public permissionService: PermissionService,
    public messageService: MessageService, private renderer: Renderer2, public constansService: ConstantsService) { }

  ngOnInit() {
    if(this.filterPartnersTeam){
      this.qualService.qualification.partnerTeam = this.qualService.qualification.partnerTeam.filter(data => data.beGeoId == this.partnerId);
    }
    this.partnersTeam = '';
    if (this.appDataService.isPatnerLedFlow) {
      this.partnerLedFlow = true;
    }
    if (this.qualService.qualification.partnerTeam) {
      this.addMember = true;
    }

    // If not disti intiated
    if (this.appDataService.isDistiNotIntiated(this.qualService.qualification.distiInitiated)) {
        this.ptAccessType = this.constansService.RO;
        this.disableForDisti =  true;
    }else {
        this.ptAccessType = this.constansService.RW;
        this.disableForDisti =  false;
    }




    this.checkboxSelectors(); // to check and set header level check boxes
  }
  ngOnChanges(changes: SimpleChanges) {
    this.checkboxSelectors();
  }
  onClickedOutsidePartnerBox(e: Event) {
    // this.partnersTeam = '';
  }

  // method to check parnter name and enable checkboxes by default
  onChangePartnerInputValue(selectedValue) {
    
    if (selectedValue.length > 0) {

      if (this.disableForDisti || !this.partnerDeal) {
          this.ptNotifyWebex = false;
          this.ptNotifyEmail = false;
      }else {
          this.ptNotifyEmail = true;
          this.ptNotifyWebex = true;
      }
    } else {
      this.ptNotifyWebex = false;
      this.ptNotifyEmail = false;
    }
  }


  focusSales(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  // method to search and add partner 
  searchAndAddPartner(ccoId: string) {
    let access;
    let obj = {};
    if (this.ptAccessType === this.constansService.RW) {
      access = this.constansService.RW;
    } else {
      access = this.constansService.RO;
    }
    let alreadyAdded = false;
    for (let i = 0; i < this.qualService.qualification.partnerTeam.length; i++) {
      if (this.qualService.qualification.partnerTeam[i].ccoId === ccoId) {
        alreadyAdded = true;
        this.ptNotifyWebex = false;
        this.ptNotifyEmail = false;
        this.ptNotifyWalkme = true;
        this.partnersTeam = '';
        this.focusSales('partnersTeam');
        break;
      }
    }
    if (!alreadyAdded) {
      obj['ccoId'] = ccoId;
      obj['access'] = this.partnerDeal ? access : null;
      obj['notification'] = this.ptNotifyEmail ? 'Yes' : 'No';
      obj['webexNotification'] = this.ptNotifyWebex ? 'Y' : 'N';
      obj['notifyByWelcomeKit'] = this.ptNotifyWalkme ? 'Y' : 'N';
      const addPartnerRequest = {
        'data': obj
      }
      // console.log(addPartnerRequest, obj);
      this.involvedService.updatePartnerAPI(this.qualService.qualification.qualID, addPartnerRequest, this.proposalId).subscribe((res: any) => {
        if (res) {
          if (res.messages && res.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(res);
          }
          if (!res.error && res.data) {
            this.qualService.qualification.partnerTeam.push(res.data);
            this.ptNotifyEmail = false;
            this.ptNotifyWebex = false;
            this.ptNotifyWalkme = true;
            this.partnersTeam = '';
            this.focusSales('partnersTeam')
            this.checkboxSelectors();
          }
        }
      });
    }
  }

  // method to remove partner
  removePartnerMember(partner) {
    this.involvedService.removePartnerAPI(this.qualService.qualification.qualID, partner.ccoId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          for (let i = 0; i < this.qualService.qualification.partnerTeam.length; i++) {
            if (this.qualService.qualification.partnerTeam[i] === partner) {
              this.qualService.qualification.partnerTeam.splice(i, 1);
              if (this.qualService.qualification.partnerTeam.length === 0) { // Unchecks the email/webex notifaction checkboxes
                this.ptNotifyEmail = false;
                this.ptNotifyWebex = false;
                this.ptNotifyWalkme = true;
              }
            }
          }
          this.checkboxSelectors();
          this.qualService.updateSessionQualData(this.filterPartnersTeam, this.partnerId);
        }
      }
    });
  }

  // check partner team notify type and set the value
  checkNotifyPt(notifyType) {
    if (notifyType === this.constansService.EST_EMAIL) {
      this.ptNotifyEmail = !this.ptNotifyEmail;
    } else if (notifyType === this.constansService.EST_WEBEX) {
      this.ptNotifyWebex = !this.ptNotifyWebex;
    } else if (notifyType === this.constansService.EST_WALKME) {
      this.ptNotifyWalkme = !this.ptNotifyWalkme;
    }
  }

  updateNotifyAllPt(checkboxType) {

    // Array that will hold all the extended sales team members with their updated notification values
    const dataArray = new Array();

    if (checkboxType === 'email') {
      this.ptNotifyAllEmail = !this.ptNotifyAllEmail;
      let notify = this.ptNotifyAllEmail ? 'Yes' : 'No';

      for (let member of this.qualService.qualification.partnerTeam) {
        member.notification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'webex') {
      this.ptNotifyAllWebex = !this.ptNotifyAllWebex;
      let notify = this.ptNotifyAllWebex ? 'Y' : 'N';

      for (let member of this.qualService.qualification.partnerTeam) {
        member.webexNotification = notify;
        dataArray.push(member);
      }
    } else if (checkboxType === 'walkme') {
      this.ptNotifyAllWalkme = !this.ptNotifyAllWalkme;
      let notify = this.ptNotifyAllWalkme ? 'Y' : 'N';

      for (let member of this.qualService.qualification.partnerTeam) {
        member.notifyByWelcomeKit = notify;
        dataArray.push(member);
      }
    }

    // Array of specialists is added to the request object
    const updateContactRequest = {
      'data': dataArray
    };
    this.involvedService.updateAllPartnerAPI(this.qualService.qualification.qualID, this.ptNotifyAllEmail,
      this.ptNotifyAllWebex, this.ptNotifyAllWalkme).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {

          this.qualService.updateSessionQualData(this.filterPartnersTeam, this.partnerId);
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          //  this.updatePtRowObject(obj, updateType);
        }
      }
    });
  }
  updatePtRow(obj, updateType) {
    this.updatePtRowObject(obj, updateType);
    obj['archname'] = AppDataService.ARCH_NAME;
    // const dataArray = new Array(); // Creating array for preparing request.
    // dataArray.push(obj);
    // push object as request obj for api call
    const updateContactRequest = {
      'data': obj
    };
    this.involvedService.updatePartnerAPI(this.qualService.qualification.qualID, updateContactRequest).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          this.qualService.updateSessionQualData(this.filterPartnersTeam, this.partnerId);
          this.checkboxSelectors();
        }
        if (res.error) { // in case of error we need to revert the object to its initial state.
          this.updatePtRowObject(obj, updateType);
        }
      }
    });
  }


 public updatePtRowObject(obj, updateType) {
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

  checkboxSelectors() { // Updates the table header checkboxes based on the notification selections
    // made for the current specialists and sales team members

    this.ptNotifyAllEmail = true;
    this.ptNotifyAllWebex = true;
    this.ptNotifyAllWalkme = true;
    this.ptMasterCheckDisabled = false;

    if (this.qualService.qualification.partnerTeam.length === 0) {
      this.ptNotifyAllEmail = false;
      this.ptNotifyAllWebex = false;
      this.ptNotifyAllWalkme = false;
      this.ptMasterCheckDisabled = true;
    } else {
      for (let member of this.qualService.qualification.partnerTeam) {
        if (member.notification === 'No') {
          this.ptNotifyAllEmail = false;
        }
        if (member.webexNotification === 'N') {
          this.ptNotifyAllWebex = false;
        }
        if (member.notifyByWelcomeKit === 'N' || !member.hasOwnProperty('notifyByWelcomeKit')) {
          this.ptNotifyAllWalkme = false;
        }
      }
    }
  }
}
