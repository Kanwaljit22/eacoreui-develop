import { EaService } from './../../ea/ea.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from './project-rest.service';
import { ProjectStoreService } from './project-store.service';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaPermissionEnum } from 'ea/ea-permissions/ea-permissions';
import { EaStoreService } from 'ea/ea-store.service';


@Injectable({
  providedIn: VnextResolversModule
})
export class ProjectService {
  showSitesAssociated = false;
  loccSuccess = false;
  showLocc = false; //This flag is set to show locc
  updateNextBestOptionsSubject = new Subject() // new subject for showing next best options
  selectMoreBuId = false;
  updateProjectstatusSubject = new Subject() // subject for setting project locked or not to show actions
  closeLoccModalSubject = new Subject() // suject for closing locc moda when locc initiated/uploaded from modal
  manageTeams = new Subject();
  enableSubsidiariesMeraki = '';
  clearSearchInput = new Subject();
  createBPId = false;
  showBpIdDetails = false;
  isNewEaIdCreatedForProject = false; // set if new eaid created for a RC project
  isModifyScopeSelection = new Subject();
  constructor(private vNextStoreService: VnextStoreService, private projectStoreService: ProjectStoreService, private projectRestService: ProjectRestService, private vnextService: VnextService, private vnextStoreService: VnextStoreService
    ,private eaPermissionsService: EaPermissionsService, private eaStoreService: EaStoreService, private eaService: EaService) { }

    
    updateAllTeamMember(teamArray, isSeletced,notificationType){
    
     if(teamArray) {
      teamArray.forEach(element => {
      element[notificationType] = isSeletced;
       });
      return {data: teamArray};
     } 
  }

  // method to check and show locc for partner led flow
  toShowLocc(data){
    if (data.loccDetail && (data.loccDetail.loccNotRequired || data.loccDetail.loccSigned || data.deferLocc || data.loccDetail.loccInitiated)){
      this.showLocc = false;
      this.projectStoreService.isShowProject = true;
      this.projectStoreService.nextBestActionsStatusObj.isLoccDone = true;
    } else if (data.loccDetail && (!data.loccDetail.loccInitiated || !data.loccDetail.loccSigned)){
      this.showLocc = true;
    } else {
      this.showLocc = false;
      this.projectStoreService.isShowProject = true;
    }
    return;
  }

  // method to check and show project
  isToShowProject(){
      if ( (this.projectStoreService.projectData.dealInfo.distiDeal || this.projectStoreService.projectData.dealInfo.partnerDeal) && !this.projectStoreService.isShowProject){
        return false;
      } else {
        return true;
      }
  }

  // method to check partner login
  isPartnerUserLoggedIn(){
    if (this.eaStoreService.userInfo.accessLevel === 3){
      return true;
    } else {
      return false;
    }
  }

    isAllNotificationSelected(teamMember) {
      if(teamMember) {
         return teamMember.every((member) => {
      return member.notification ? true : false;
    });
    }  
  }

    isAllWebExSelected(teamMember) {
      if(teamMember) {
         return teamMember.every((member) => {
      return member.webexNotification ? true : false;
    });
    }
    return true
  }

  isAllWlecomeKitSelected(teamMember) {
    if(teamMember) {
        return teamMember.every((member) => {
      return member.notifyByWelcomeKit ? true : false;
    });
    }
    return true
  }
  
  // method to check and disable continue button if custoemRep name, email and title are not present
  checkLoccCustomerRepInfo(){
    this.projectStoreService.isLoccCustomerContactDetailInconsistent = false;
    if (this.vNextStoreService.loccDetail && this.vNextStoreService.loccDetail.customerContact){
      if (!this.vNextStoreService.loccDetail.customerContact.repName || !this.vNextStoreService.loccDetail.customerContact.repTitle || !this.vNextStoreService.loccDetail.customerContact.repEmail || !this.vNextStoreService.loccDetail.customerContact.phoneNumber){
        this.projectStoreService.isLoccCustomerContactDetailInconsistent = true;
      }
    } else {
      this.projectStoreService.isLoccCustomerContactDetailInconsistent = true;
    }
    return;
  }

  // method to complete/reopen project
  modifyProject(type) {
    const req = {
      data: type
    }

    this.projectRestService.updateProject(this.projectStoreService.projectData.objId, req).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.projectStoreService.projectData.status = response.data.project.status;
        if (type === 'COMPLETE') {
          this.updateProjectstatusSubject.next(true);
          this.projectStoreService.lockProject = true;
          this.projectStoreService.isClickedEditProject = false;
          if(response.data.project.scopeInfo){
            this.projectStoreService.projectData.scopeInfo = response.data.project.scopeInfo;
          }
          this.vnextStoreService.toastMsgObject.lockProject = true;
          setTimeout(() => {
            this.vnextStoreService.cleanToastMsgObject(); // after 3 sec clear the message
          }, 3000);
        } else {
          this.selectMoreBuId = false;
          this.updateProjectstatusSubject.next(false);
          this.projectStoreService.lockProject = false;
          this.projectStoreService.isClickedEditProject = true;
          if (this.vnextStoreService.loccDetail && !this.projectStoreService.nextBestActionsStatusObj.isLoccDone){
            this.checkAndSetLoccDone(); // after editing project, check for loccDone and set based on loccDetails
          }
        }
        this.setProjectPermissions(response.data.project.permissions)
      }
    });
  }

  setProjectPermissions(permissions){
    this.projectStoreService.projectReadOnlyMode = false;
    this.projectStoreService.projectEditAccess = true;
    this.projectStoreService.projectReopenAccess = false;
    this.projectStoreService.projectManageTeamAccess = false;
    this.projectStoreService.projectOrgIdEditAccess = false;
    this.projectStoreService.projectSmartAccountEditAccess = false;
    this.projectStoreService.projectCreateBpIdAccess = false;
    this.projectStoreService.proposalCreateAccess = false;
    this.eaPermissionsService.proposalPermissionsMap.clear();
    this.eaPermissionsService.projectPermissionsMap.clear();
    if(permissions &&permissions.featureAccess){
      this.eaPermissionsService.projectPermissionsMap = new Map(permissions.featureAccess.map(permission => [permission.name, permission]));
      if(!this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectEdit) && !this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectReopen) && !this.eaStoreService.isUserRwSuperUser){
        this.projectStoreService.projectReadOnlyMode = true;
        this.projectStoreService.projectEditAccess = false;
      }
    }

    if(this.projectStoreService.projectReadOnlyMode){
      this.projectStoreService.lockProject = true;
    }

    if (this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectReopen)){
      this.projectStoreService.projectReopenAccess = true;
    }

    if(this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectManageTeam)){
      this.projectStoreService.projectManageTeamAccess = true;
    }
    if(this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectSmartAccountEditAccess)){
      this.projectStoreService.projectSmartAccountEditAccess = true;
    }
    if(this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectOrgIdEditAccess)){
      this.projectStoreService.projectOrgIdEditAccess = true;
    }

    if(this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectCreateBpIdAccess)){
      this.projectStoreService.projectCreateBpIdAccess = true;
    }

    if(this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProposalCreate)){
      this.projectStoreService.proposalCreateAccess = true;
    }
  }

  // method to enable locc in next best actions after editing project based on locc details
  checkAndSetLoccDone(){
    if (this.vnextStoreService.loccDetail.loccSigned || this.vnextStoreService.loccDetail.loccInitiated || this.projectStoreService.projectData.deferLocc){
      this.projectStoreService.nextBestActionsStatusObj.isLoccDone = true
      this.updateNextBestOptionsSubject.next({key: 'isLoccDone', value: true});
    }
  }


  // to set complete address for parties
  public getCompleteAddressforParty(partyObj){
    let completeAddress = '';
     let COMMA_WITH_SPACE = ', '
    if(partyObj.ADDRESS1){
      completeAddress = completeAddress + partyObj.ADDRESS1 + COMMA_WITH_SPACE;
    }
    if(partyObj.ADDRESS2){
      completeAddress = completeAddress + partyObj.ADDRESS2 + COMMA_WITH_SPACE;
    }
    if(partyObj.CITY){
      completeAddress = completeAddress + partyObj.CITY + COMMA_WITH_SPACE;
    }
    if(partyObj.STATE){
      completeAddress = completeAddress + partyObj.STATE + COMMA_WITH_SPACE;
    }
    if(partyObj.POSTAL_CODE){
      completeAddress = completeAddress + partyObj.POSTAL_CODE + COMMA_WITH_SPACE;
    }
    if(partyObj.COUNTRY){
      completeAddress = completeAddress + partyObj.COUNTRY;
    }    
    return completeAddress;
    
  }

  // to check if returning customer
  isReturningCustomer(scopeInfo){
    if(this.eaService.features.EAID_REL){
      if (scopeInfo && scopeInfo.returningCustomer && !scopeInfo?.newEaidCreated){
        return true;
      } 
      return false;
    } else {
      if (scopeInfo && scopeInfo.returningCustomer){
        return true;
      } 
      return false;
    }
  }

  // method to check and set parties selected from seletced Bu
  setSiteSelction(subsidiary, sitesArr, sitesData){
    if (subsidiary.selected === 'F'){ // if full selection, make default selection to all parties
      for (let data of sitesArr){
        data.selected = true;
      }
    } else if (subsidiary.selected === 'P' && sitesData.selectedParties){ // if partial selection, check selectedParties and make selection to parties 
      for (let data of sitesArr){
        if (sitesData.selectedParties.includes(data.CR_PARTY_ID)){
          data.selected = true;
        }
      } 
    }
  }

  // check and select crparty from deal default and disable it
  checkAndSetSelectedCrPartyFromDeal(bu, party){
    if(this.eaService.features.EAID_REL){
      // remove defaulting for dealcrpartybu if neweaidcreated - allow user to deselct
      if (bu.dealCrPartyBU && this.projectStoreService.projectData.dealInfo.crPartyId && (party.CR_PARTY_ID === this.projectStoreService.projectData.dealInfo.crPartyId) && !this.isNewEaIdCreatedForProject){
        return true;
      }
    } else {
      if (bu.dealCrPartyBU && this.projectStoreService.projectData.dealInfo.crPartyId && (party.CR_PARTY_ID === this.projectStoreService.projectData.dealInfo.crPartyId)){
        return true;
      } 
    }
    return false;
  }

  //check and set if new eaid created for a RC project
  newEaIdCreatedProject(project){
    if(this.eaService.features.EAID_REL){
      if(project.scopeInfo?.eaidSelectionComplete && project.scopeInfo?.newEaidCreated){
        return true;
      }
      return false;
    }
    return false;
  }

  // set if partner/disti accessing sfdc deal proposal
  checkPartnerLogInSfdcDeal() {
    if ( !this.projectStoreService.projectData.dealInfo?.partnerDeal && this.eaService.isPartnerUserLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }
}
