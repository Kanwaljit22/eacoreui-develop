  import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ProjectService } from '../project.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProjectStoreService } from '../project-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-create-buying-program-id',
  templateUrl: './create-buying-program-id.component.html',
  styleUrls: ['./create-buying-program-id.component.scss']
})
export class CreateBuyingProgramIdComponent implements OnInit, OnDestroy {
  showReasons = false;
  reasonsList = [];
  selectedReasons = [];
  reasonDetail = '';
  enterOtherReason = false
  @Output() onClose = new EventEmitter();
  isCreateNewScope:boolean;
  isExistingIdSelected = false;
  allBpIDs = [];
  constructor(public projectService: ProjectService, public dataIdConstantsService: DataIdConstantsService, public localizationService: LocalizationService, private renderer: Renderer2, public projectStoreService: ProjectStoreService, private eaRestService: EaRestService, private vnextService: VnextService, private messageService: MessageService, public elementIdConstantsService: ElementIdConstantsService, public eaService: EaService, private constantsService: ConstantsService){

  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'position-fixed');
    this.getReasonCodes();
    this.getBpIds();
  }

  getBpIds() {
    const url = this.vnextService.getAppDomainWithContext + this.constantsService.URL_PROJECT + this.projectStoreService.projectData.objId + this.constantsService.URL_MULTIPLE_EAID;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.allBpIDs = response.data;
      }
    })
  }

  getReasonCodes(){
    this.reasonsList = [];
    const url = 'project/fetch-reason-codes';
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      this.messageService.modalMessageClear();
      if(this.vnextService.isValidResponseWithData(res, true)){
        if(res.data.reasonInfo){
          this.reasonsList = res.data.reasonInfo
          this.reasonsList.forEach(reason => {
            reason.selected = false;
          });
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'position-fixed')
  }

  close() {
  this.projectService.createBPId = false;
  this.messageService.disaplyModalMsg = false;
  }

  createNewBpId(){
    if(!this.selectedReasons.length || (this.selectedReasons.length && this.enterOtherReason && !this.reasonDetail.trim())){
      return;
    }
    const url = 'project/' + this.projectStoreService.projectData.objId + '/eaid';
   
    let request = {
      data: {
        reasonInfo: {
          reasonCodes: this.selectedReasons
        }
      }
    }
    if (this.eaService.features?.RENEWAL_SEPT_REL && this.isCreateNewScope) {
      let eaIds = [];
       const ids = this.allBpIDs.filter(id => id.selected);
       ids.forEach(bpid => eaIds.push(bpid.eaIdSystem));
       request.data[this.constantsService.EAIDSSYSTEM] = eaIds
    }
     

    if(this.enterOtherReason && this.reasonDetail.trim()){
      request.data.reasonInfo['reasonDetails'] = this.reasonDetail.trim();
    }

    this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if(this.vnextService.isValidResponseWithoutData(response, true)){
        // this.projectStoreService.isShowProject = false;
        this.create();
        this.onClose.emit();
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  create() {
    this.projectService.createBPId = false;
    this.messageService.disaplyModalMsg = false;
    // call api and reload project page with new data 
  }

  selectReason(reason) {
    if (reason.id === 'other') {
      this.selectedReasons = [reason];
      this.enterOtherReason = true;
      // this.selectedReasons.push({"name": "Others"});
      this.reasonsList.forEach(element => {
        if(element.id !== reason.id){
          element.selected = false;
        }
      });
    } else {
      this.selectedReasons.forEach(ele => {
        if(ele.id === 'other') {
          this.selectedReasons.splice(ele, 1)
        }
      });
      this.enterOtherReason = false;
      reason.selected = !reason.selected
      if (reason.selected) {
        this.selectedReasons.push(reason);
      } else {
        this.selectedReasons.splice(reason, 1);
      }
    }
    this.showReasons = false;
  }

  changeBpIDQues($event) {
    //this.selectedReasons = [];
    if ($event.target.id === this.constantsService.YES) {
      this.isCreateNewScope = true;
    } else {
      this.isCreateNewScope = false;
    }
  }

  selectedId($event) {
    this.allBpIDs.forEach((id) => {
      if(id.eaId === $event.eaId) {
        id.selected = $event.selected
      }
    })
    const selectedIds = this.allBpIDs.filter(id => id.selected);
    this.isExistingIdSelected = (selectedIds.length) ? true : false;
  }

  selectBpid(bpId) {
    bpId.selected = !bpId.selected;
  }

}
