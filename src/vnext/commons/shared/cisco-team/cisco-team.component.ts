import { ManageTeamComponent } from './../../../modals/manage-team/manage-team.component';
import {  NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormControl } from '@angular/forms';
import { ProjectStoreService, IContacts } from 'vnext/project/project-store.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CiscoTeamService } from './cisco-team.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';

import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VnextService } from 'vnext/vnext.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { ProjectService } from 'vnext/project/project.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-cisco-team',
  templateUrl: './cisco-team.component.html',
  styleUrls: ['./cisco-team.component.scss'],
  providers: [MessageService]
})
export class CiscoTeamComponent implements OnInit {



  allWebexCheck = false;
  allWelcomeKitCheck = false;
  expandCiscoTeam = true;
  ciscoTeamArray: IContacts[] = [];
  type = 'CISCO';
  searchMemberArray = []; 
  searchMember: FormControl = new FormControl()
  customerLookup$ = new Subject();
  selectedMembers = []
  welcomeAddCheck = true;
  webexAddCheck = true;
  searchFocus = false;
  @Input() enableManageTeamEdit = true;
  @Output() addRemove = new EventEmitter();
  @Input() isPartnerAccessingSfdcDeal = false;
  constructor(public projectStoreService: ProjectStoreService, private ciscoTeamService: CiscoTeamService, public dataIdConstantsService: DataIdConstantsService,
    private projectRestService: ProjectRestService, private messageService: MessageService,private vnextService: VnextService,
    private blockUiService: BlockUiService, private projectService: ProjectService,public localizationService:LocalizationService,private modalVar: NgbModal, public eaService: EaService, public elementIdConstantsService: ElementIdConstantsService
    ) { }

  ngOnInit() {
 
    this.getInitData();

    //for searching new member...
    this.searchMember.valueChanges.subscribe(() => {
      if (this.searchMember.value.length > 2) {
        this.customerLookup$.next(true);
      } else {
        this.searchMemberArray = [];
      }
    });

    this.customerLookup$
      .pipe(switchMap(() => {
        this.blockUiService.spinnerConfig.noProgressBar();
        return this.projectRestService.searchMember(this.searchMember.value);

      }))
      .subscribe((response: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithData(response, true)) {
          this.searchMemberArray = response.data;
        } else {
          this.searchMemberArray = [];
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  expandCiscoTeams() {
    this.expandCiscoTeam = !this.expandCiscoTeam
  }

  updateAllTeamMember(notificationType, event) {
    const requestObj = this.ciscoTeamService.updateAllTeamMember(this.ciscoTeamArray, event, notificationType);
    this.projectRestService.updateTeamMember(requestObj, this.type).subscribe((response: any) => {

      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.projectStoreService.projectData.ciscoTeam.contacts = [...this.ciscoTeamArray]; //update store value in case of success
        this.checkIsAddedRemove();
      } else {
        //in case of error show error, revert ciscoTeamArray chagnes and toggle header checkbox flag
        this.messageService.displayMessagesFromResponse(response);
        this.ciscoTeamArray = [...this.projectStoreService.projectData.ciscoTeam.contacts];
        if(notificationType === 'webexNotification'){
          this.allWebexCheck = !this.allWebexCheck;
        } else {
          this.allWelcomeKitCheck = !this.allWelcomeKitCheck;
        }
      }
    });
  }


  updateTeamMember(member, notificationType) {
    const requestObj = this.ciscoTeamService.updateTeamMember(member,notificationType);

    this.projectRestService.updateTeamMember(requestObj, this.type).subscribe((response: any) => {

      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.projectStoreService.projectData.ciscoTeam.contacts = [...this.ciscoTeamArray]; //update store value in case of success
        this.checkIsAddedRemove();
        if (notificationType === 'webexNotification') {
          this.allWebexCheck = this.ciscoTeamService.isAllWebExSelected(this.ciscoTeamArray);
        } else {
          this.allWelcomeKitCheck = this.ciscoTeamService.isAllWlecomeKitSelected(this.ciscoTeamArray);
        }
      } else {
        //in case of error show error, revert ciscoTeamArray chagnes and toggle header checkbox flag
        this.messageService.displayMessagesFromResponse(response);
        if (notificationType === 'webexNotification') {
          member.webexNotification = !member.webexNotification
        } else {
          member.notifyByWelcomeKit = !member.notifyByWelcomeKit
        }
      }
    });
  }

  deleteTeamMember(member,index){
    this.projectRestService.deleteTeamMember(member, this.type).subscribe((response: any) => { 

      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.ciscoTeamArray.splice(index, 1);
        this.projectStoreService.projectData.ciscoTeam.contacts = [...this.ciscoTeamArray];
        this.allWebexCheck = this.ciscoTeamService.isAllWebExSelected(this.ciscoTeamArray)
        this.allWelcomeKitCheck = this.ciscoTeamService.isAllWlecomeKitSelected(this.ciscoTeamArray);
        this.checkIsAddedRemove();
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  addMember(){
    const requestObj = this.ciscoTeamService.addMember(this.selectedMembers,this.webexAddCheck,this.welcomeAddCheck);

    this.projectRestService.addTeamMember(requestObj, this.type).subscribe((response: any) => { 
      
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.ciscoTeamArray.push(...requestObj.data);
        this.checkIsAddedRemove();
        this.projectStoreService.projectData.ciscoTeam.contacts = [...this.ciscoTeamArray];
        this.allWebexCheck = this.ciscoTeamService.isAllWebExSelected(this.ciscoTeamArray)
        this.allWelcomeKitCheck = this.ciscoTeamService.isAllWlecomeKitSelected(this.ciscoTeamArray)
        this.selectedMembers = [];
        if(this.ciscoTeamArray.length){
          this.projectService.updateNextBestOptionsSubject.next({key: 'isCiscoTeamMemberAdded', value: true})
        }
      } else {
        this.selectedMembers = [];
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  selectMember(suggestion){
    if(!this.checkIfAlreadyAdded(suggestion)){
      this.selectedMembers.push(suggestion);
    }
    this.searchMember.setValue('');
  }

  checkIfAlreadyAdded(suggestion) {
    if (this.selectedMembers.map((member) => member.ccoId).includes(suggestion.ccoId) ||
      this.ciscoTeamArray.map((member) => member.userId).includes(suggestion.ccoId)
    ) {
      return true;
    }

    return false;
  }

  removeSelectedMember(index){
    this.selectedMembers.splice(index,1)
  }

  hideDropdown(){
    setTimeout(() => {
      this.searchMember.setValue('');
    }, 500);
    
  }

// Open manage team modal
  openManageTeam() {
    if(this.isPartnerAccessingSfdcDeal){
      // check for manage team access for partner login sfdc deal
      if (!this.projectStoreService.projectManageTeamAccess){
        return;
      }
    } else {
      if (!this.projectStoreService.projectEditAccess){
        return;
      }
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modal = this.modalVar.open(ManageTeamComponent, ngbModalOptions);
    modal.result.then(result => {
        if(result.continue && result.addRemove) {
          this.projectRestService.getProjectDetailsById(this.projectStoreService.projectData.objId).subscribe((response) => {
            // for updating header check box on manage teams
           this.getInitData();
           this.projectService.manageTeams.next(true);
          });
        }
    })
  }

  checkIsAddedRemove() {
    if(!this.enableManageTeamEdit) {
      this.addRemove.emit(true);
    }
  }

  getInitData() {
    if (this.projectStoreService.projectData.ciscoTeam.contacts) {
      this.ciscoTeamArray = [...this.projectStoreService.projectData.ciscoTeam.contacts];
    }
    this.allWebexCheck = this.ciscoTeamService.isAllWebExSelected(this.ciscoTeamArray)
    this.allWelcomeKitCheck = this.ciscoTeamService.isAllWlecomeKitSelected(this.ciscoTeamArray);
    
    //for updating next best options...
    if(this.ciscoTeamArray.length){
      this.projectService.updateNextBestOptionsSubject.next({key: 'isCiscoTeamMemberAdded', value: true})
    }
  }
}
