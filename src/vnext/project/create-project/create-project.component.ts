
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ProjectStoreService, IPartnerObject } from '../project-store.service';
import { ProjectService } from '../project.service';
import { ProjectRestService } from '../project-rest.service';
import { ActivatedRoute } from '@angular/router';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaStoreService } from 'ea/ea-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { AssignSmartAccountComponent } from 'vnext/modals/assign-smart-account/assign-smart-account.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit,OnDestroy {

  partnerObject : IPartnerObject  = { header: this.localizationService.getLocalizedString('common.PARTNER_TEAM_MEMBERS'), team: this.localizationService.getLocalizedString('create-project.PARTNER_OBJ_TEAM'),
  memeberType: this.localizationService.getLocalizedString('common.TEAM'),searchType : this.localizationService.getLocalizedString('create-project.PARTNER_OBJ_SEARCH_TYPE')};
  projectName = '';
  isProjectComplete = false;
  isShowEditMessage = true; // to show edit mode message when project edited
  isChangeSubFlow = false;
  isNewEaIdCreatedForProject = false; // set if new eaid created for a RC project
  isBpIdSwitchComplete = false; // set if user switched to existing bpid from the list
  isDistiLoggedInSfdcDeal = false; // set if disti accessing sfdc deal
  isPartnerAccessingSfdcDeal = false;  // set if partner accessing sfdc deal
  localizationKeys = [LocalizationEnum.select_more_bu, LocalizationEnum.renewal, LocalizationEnum.create_project, LocalizationEnum.view_sites]


  constructor(public projectService: ProjectService, private projectRestService: ProjectRestService, private proposalStoreService: ProposalStoreService,
    public projectStoreService: ProjectStoreService, private messageService: MessageService, private activatedRoute: ActivatedRoute, 
    public vnextStoreService:VnextStoreService, private constantsService: ConstantsService, private blockUiService: BlockUiService,
    private vnextService: VnextService, private eaPermissionsService: EaPermissionsService, private eaStoreService: EaStoreService, private eaRestService: EaRestService,
    public localizationService:LocalizationService, public eaService: EaService, public modalVar: NgbModal, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService
    ) { }

  ngOnInit() {
    this.eaService.getLocalizedString(this.localizationKeys, true); 
    if(this.eaStoreService.isValidationUI){
      this.eaService.navigateToVui();
    }
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.CREATE_PROJECT;
    this.proposalStoreService.proposalData = {};
    this.eaStoreService.editName = false;
    this.vnextStoreService.currentPageContext = this.vnextStoreService.applicationPageContextObject.PROJECT_CONTEXT; //This context we need for subheader
    if(this.vnextService.isValidResponseWithData(this.activatedRoute.snapshot.data.projectData)) {  
      this.projectStoreService.projectData = this.activatedRoute.snapshot.data.projectData.data
      //this.eaService.updateUserEvent(this.projectStoreService.projectData, this.constantsService.PROJECT, this.constantsService.ACTION_UPSERT);
      this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
      if (this.activatedRoute.snapshot.data.projectData.data.loccDetail){
        this.vnextStoreService.loccDetail = this.activatedRoute.snapshot.data.projectData.data.loccDetail;
      } else {
        this.vnextStoreService.loccDetail = {};
      }
      this.loadProject();
    } else {
      this.messageService.pessistErrorOnUi = true;
    }
    this.vnextService.isRoadmapShown = false;
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === LocalizationEnum.create_project || key === LocalizationEnum.all ){
        this.setPartnerObj();
      }
    });

  }

  setPartnerObj(){
    this.partnerObject= { header: this.localizationService.getLocalizedString('common.PARTNER_TEAM_MEMBERS'), team: this.localizationService.getLocalizedString('create-project.PARTNER_OBJ_TEAM'),
  memeberType: this.localizationService.getLocalizedString('common.TEAM'),searchType : this.localizationService.getLocalizedString('create-project.PARTNER_OBJ_SEARCH_TYPE')};
  }

  loadProject(){
    this.projectName = this.projectStoreService.projectData.name;
    this.checkProjectStatus();  // to check and lock project depending on status
    this.checkToShowLocc(); // to check and show locc for partnerlogin
    this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
    //if (this.eaService.features.CHANGE_SUB_FLOW){
      this.eaStoreService.changeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
      this.eaService.isSpnaFlow = (this.projectStoreService.projectData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
      this.isChangeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
    //}
    //check and set if new eaid created for a RC project
    this.projectService.isNewEaIdCreatedForProject = this.projectService.newEaIdCreatedProject(this.projectStoreService.projectData);
    // check and set if disti accessing sfdc deal
    this.isPartnerAccessingSfdcDeal = this.projectService.checkPartnerLogInSfdcDeal();
    if(this.isPartnerAccessingSfdcDeal && this.eaStoreService.userInfo?.distiUser){
      this.isDistiLoggedInSfdcDeal = true;
    }
  }

  reloadProject(event, swithcBpId?){
    // to call project api or reload project page
    const url = this.vnextService.getAppDomainWithContext + 'project/'+this.projectStoreService.projectData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) {
        this.projectStoreService.projectData = response.data
        this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
        if (response.data.loccDetail){
          this.vnextStoreService.loccDetail = response.data.loccDetail;
        } else {
          this.vnextStoreService.loccDetail = {};
        }
        this.loadProject();
        this.projectStoreService.refreshSubsidiariesSubject.next(true); // set if user switched to existing or creating a new bpid
        // user switched to existing bpid from the list, set to true
        if(swithcBpId){
          this.isBpIdSwitchComplete = true;
        }
      } else {
        this.messageService.pessistErrorOnUi = true;
      }
    })
  }

  updateProjectName() {//api for changing projectName
    this.projectName = this.projectName.trim();
    if (this.projectStoreService.projectData.name !== this.projectName) {
      const requestObj = { data: this.projectName }
      this.blockUiService.spinnerConfig.noProgressBar();
      this.projectRestService.updateProjectName(requestObj).subscribe((response: any) => {
        if (response && !response.error) {
          this.projectStoreService.projectData.name = this.projectName;
        } else {
          this.messageService.displayMessagesFromResponse(response);
          this.projectName = this.projectStoreService.projectData.name;
        }
      });
    }
  }

  // method to check and show locc for partner login
  checkToShowLocc(){
    //<!--Start Disti flow for sept release-->
    
      if ((this.projectStoreService.projectData.dealInfo.distiDeal ||  this.projectStoreService.projectData.dealInfo.partnerDeal) && !this.projectStoreService.lockProject) {
        this.projectService.toShowLocc(this.projectStoreService.projectData);
      } else {
        this.projectService.showLocc = false;
        this.projectStoreService.isShowProject = true;
      }
    //<!--End Disti flow for sept release-->
  }

  // check and lock project if project completed
  checkProjectStatus(){
    if (this.projectStoreService.projectData.status === this.constantsService.PROJECT_COMPLETE){
      this.isProjectComplete = true;
      this.projectStoreService.lockProject = true;
      this.projectService.showLocc = false;
    } else {
      this.isProjectComplete = false;
      this.projectStoreService.lockProject = false;
    }
    this.projectService.setProjectPermissions(this.activatedRoute.snapshot.data.projectData.data.permissions);
  }

  ngOnDestroy(){
    this.vnextStoreService.currentPageContext = ''; //This context we need for subheader
    this.eaStoreService.pageContext = '';
    this.projectStoreService.isEMSMsgDisplayed = false;
    this.messageService.pessistErrorOnUi = false;
    this.eaStoreService.editName = false;
    this.projectService.isNewEaIdCreatedForProject = false;
    this.isBpIdSwitchComplete = false;
  }

  // to remove edit message
  closeEditModeMsg(){
    this.isShowEditMessage = false;
  }
  // setProjectPermissions(){
  //   this.projectStoreService.projectReadOnlyMode = false;
  //   this.eaPermissionsService.proposalPermissionsMap.clear();
  //   this.eaPermissionsService.projectPermissionsMap.clear();
  //   if( permissions && this.activatedRoute.snapshot.data.projectData.data.permissions.featureAccess){
  //     this.eaPermissionsService.projectPermissionsMap = new Map(this.activatedRoute.snapshot.data.projectData.data.permissions.featureAccess.map(permission => [permission.name, permission]));
  //     if(!this.eaPermissionsService.projectPermissionsMap.has(EaPermissionEnum.ProjectEdit) && !this.eaStoreService.rwSuperUser){
  //       this.projectStoreService.projectReadOnlyMode = true;
  //     }
  //   }

  //   if(this.projectStoreService.projectReadOnlyMode){
  //     this.projectStoreService.lockProject = true;
  //   }
  // }

  openAssignModal() {
    const modal =  this.modalVar.open(AssignSmartAccountComponent, {windowClass: 'assign-smart-account-modal lg'});
      modal.result.then((result) => { 
      });
    }
}
