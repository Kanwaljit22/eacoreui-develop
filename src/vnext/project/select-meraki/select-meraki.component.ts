import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-select-meraki',
  templateUrl: './select-meraki.component.html',
  styleUrls: ['./select-meraki.component.scss']
})
export class SelectMerakiComponent implements OnInit, OnDestroy {
  constructor(private eaRestService: EaRestService, public eaService: EaService, public projectStoreService: ProjectStoreService, private vnextService: VnextService, public localizationService:LocalizationService, private projectService: ProjectService,
     private utilitiesService: UtilitiesService, private constantsService: ConstantsService, private messageService: MessageService, public dataIdConstantsService: DataIdConstantsService) { }
  orgIds = '';
  orgIdsArr = [];
  originalOrgIdArr = [];
  isMaxLimitReached = false;
  disableOrgIds = false;
  isReadOnly = false;
  disableSave = false;
  showInvalidOrgIdsMsg = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  isPartnerUserLoggedIn = false;
  ngOnInit(): void {
    this.getOrdIds(); // to get orgids
    this.checkReadOnly(); // to set Ro mode for complete status
     if (this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerUserLoggedIn = true
    }
  }

  checkReadOnly(){
    this.isReadOnly = false;
    if(this.eaService.isPartnerUserLoggedIn() && !this.projectStoreService.projectData.dealInfo?.partnerDeal){
      if (this.projectStoreService.projectData.status === this.constantsService.PROJECT_COMPLETE || !this.projectStoreService.projectOrgIdEditAccess){
        this.isReadOnly = true;
      }
    } else {
      if (this.projectStoreService.projectData.status === this.constantsService.PROJECT_COMPLETE || !this.projectStoreService.projectEditAccess){
        this.isReadOnly = true;
      }
    }
  }

  // to check if returning customer and any ordId present in api
  checkForReturningCustomer(){
    this.disableOrgIds = false;
    if(this.projectService.isReturningCustomer(this.projectStoreService.projectData.scopeInfo) && this.orgIdsArr.length){
      this.disableOrgIds = true;
    }
  }
  // close flyout and clear map
  backToProject() {
    this.projectService.selectMoreBuId = false;
  }

  // event to check and allow numbers, comma, backspace, copy & paste actions
  isNumberEvent($event) {
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey ||
      $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 37 ||
      $event.keyCode === 39 || $event.keyCode === 188 || (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 67 || $event.keyCode === 65 || $event.keyCode === 86)))) {
      $event.preventDefault();
    }
  }

  // to remove any spaces / alphabtets addedin the text
  checkorgIds() {
    let text = this.orgIds;
    text = text.replace(/[^0-9,]/g, '');
    this.orgIds = text.trim();
    this.checkForUpdatedValues(this.orgIds);
  }

  // remove ordIds in text box
  remove(){
    this.orgIds = '';
    this.orgIdsArr = [];
    this.isMaxLimitReached = false;
    this.showInvalidOrgIdsMsg = false;
    this.checkForUpdatedValues(this.orgIds);
  }

  // to get ordIds from api
  getOrdIds(){
    this.originalOrgIdArr = [];
    this.orgIdsArr = [];
    this.orgIds = '';
    const url = 'project/'+ this.projectStoreService.projectData.objId + '/org-ids';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.orgIds){
          this.orgIdsArr = response.data.orgIds;
          this.originalOrgIdArr = response.data.orgIds;
          this.orgIds = this.orgIdsArr.join(', ');
        } else {
          this.originalOrgIdArr = [];
          this.orgIdsArr = [];
          this.orgIds = '';
        }
        this.checkForReturningCustomer(); // check if user is returning customer
        this.checkForUpdatedValues(this.orgIds, 'initial'); // check to disable save button
      }
    });
  }

  // to save newly added or updated orgId
  save(){
    let orgIdsArray = this.covertStringToArr(this.orgIds);
    for (let orgId of orgIdsArray){
      orgId = orgId.trim();
      if (orgIdsArray.length && !orgId){
        orgIdsArray = []
      }
    } 
    const reqjson = {
      data: {
        "orgIds" : orgIdsArray
      }
    }
    const url = 'project/'+ this.projectStoreService.projectData.objId + '/org-ids';
    this.eaRestService.putApiCall(url, reqjson).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response)){
        this.orgIdsArr = orgIdsArray;
        this.originalOrgIdArr = orgIdsArray;
        this.disableSave = true;
      }
    });
  }

  // to convert updated ordIds into comma seperated array
  covertStringToArr(orgIds){
    orgIds = orgIds.trim();
    if (orgIds.slice(-1) === ','){
      orgIds = orgIds.slice(0,-1).trim();
    }
    return orgIds.split(',');
  }

  // to download saved orgIds
  downoloadOrgId() {
    const url = 'project/'+ this.projectStoreService.projectData.objId + '/org-info';
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any)=>{
      this.utilitiesService.saveFile(response, this.downloadZipLink);
    });
  }

  // to check and disable save if not updated
  checkForUpdatedValues(orgIds, type?) {
    let orgIdsArray = [];
    this.disableSave = false;
    this.showInvalidOrgIdsMsg = false;
    this.isMaxLimitReached = false;
    if (type === this.localizationService.getLocalizedString('select-more-bu.INITIAL')) { // if initial load disablesave
      orgIdsArray = this.originalOrgIdArr;
      this.disableSave = true;
    } else {
      orgIds = orgIds.trim();
      orgIdsArray = this.covertStringToArr(orgIds);
      for (let orgId of orgIdsArray) {
        orgId = orgId.trim();
        if (orgIdsArray.length && !orgId) { // if only one ordId present set empty array
          orgIdsArray = []
          break;
        }
        // if each orgid is not between 8-15 chars, set to show error message and disable save
        if (orgId.trim().length < this.constantsService.number_4 || orgId.trim().length > this.constantsService.number_38) {
          this.showInvalidOrgIdsMsg = true;
          this.disableSave = true;
          return;
        }
      }
      if (orgIdsArray.length > 500){
        this.isMaxLimitReached = true;
        this.disableSave = true;
        return;
      }
      this.disableSave = JSON.stringify(orgIdsArray) == JSON.stringify(this.originalOrgIdArr) ? true : false;
    }
  }
  
  ngOnDestroy(){
    this.orgIdsArr = [];
    this.orgIds = '';
    this.isMaxLimitReached = false;
    this.showInvalidOrgIdsMsg = false;
  }
}