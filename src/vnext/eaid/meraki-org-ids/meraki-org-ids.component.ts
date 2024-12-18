import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextService } from 'vnext/vnext.service';
import { EaidStoreService } from '../eaid-store.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-meraki-org-ids',
  templateUrl: './meraki-org-ids.component.html',
  styleUrls: ['./meraki-org-ids.component.scss']
})
export class MerakiOrgIdsComponent {
  constructor(private eaRestService: EaRestService, public eaService: EaService, private vnextService: VnextService, public localizationService:LocalizationService, public eaIdStoreService: EaidStoreService,
    private utilitiesService: UtilitiesService, private constantsService: ConstantsService, private messageService: MessageService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }
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
 @Output() cancelOrgIdEdit = new EventEmitter();
 ngOnInit(): void {
    this.getOrdIdsManageBp();
    if(this.eaIdStoreService.viewOnlyScopeMode){
      this.isReadOnly = true;
    }
 }

 getOrdIdsManageBp() {
  this.originalOrgIdArr = [];
  this.orgIdsArr = [];
  this.orgIds = '';
//   const response = {
//     "error": false,
//     "data": {
//         "orgIds": [
//             "11245",
//             "12345",
//             "23123"
//         ]
//     }
// }
  const url = this.vnextService.getAppDomainWithContext + 'project/org-ids?eaid=' + this.eaIdStoreService.encryptedEaId;
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
      this.checkForUpdatedValues(this.orgIds, this.constantsService.INITIAL); // check to disable save button
    } else {
      this.messageService.displayMessagesFromResponse(response);
     }
  })
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
       "eaid": this.eaIdStoreService.encryptedEaId,
       "orgIds" : orgIdsArray
     }
   }
   console.log(reqjson)
   const url = this.vnextService.getAppDomainWithContext + 'project/org-ids';
   this.eaRestService.putApiCall(url, reqjson).subscribe((response: any) => {
     this.messageService.clear();
     if (this.vnextService.isValidResponseWithoutData(response)){
       this.orgIdsArr = orgIdsArray;
       this.originalOrgIdArr = orgIdsArray;
       this.disableSave = true;
     } else {
      this.messageService.displayMessagesFromResponse(response);
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
   const url = this.vnextService.getAppDomainWithContext +  'project/org-info?eaid=' + this.eaIdStoreService.encryptedEaId;
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

 cancel() {
  this.orgIdsArr = [];
  this.orgIds = '';
  this.isMaxLimitReached = false;
  this.showInvalidOrgIdsMsg = false;
  this.cancelOrgIdEdit.emit();
 }
}
