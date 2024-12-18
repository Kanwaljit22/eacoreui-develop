import { BreadcrumbsService } from './../core/breadcrumbs/breadcrumbs.service';
import { Component, OnInit, ViewChild, ComponentRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicDirective } from '@app/shared';
import { ProposalCreateTutorialComponent } from './proposal-create-tutorial/proposal-create-tutorial.component';
import { ProposalListComponent } from './list-proposal/list-proposal.component';
import { ITitleWithButtons, ICustomButtons } from '@app/shared';
import { ListProposalService } from './list-proposal/list-proposal.service';
import { ProposalDataService } from './proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { Subscription } from 'rxjs';
import { PermissionService } from '@app/permission.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionEnum } from '@app/permissions';
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html'
})

export class ProposalComponent implements OnDestroy, OnInit {

  titleWithButton: ITitleWithButtons = this.getTitleWithButton();
  @ViewChild(DynamicDirective, { static: true }) dynamicDiretive: DynamicDirective;
  component: ComponentRef<any>;
  public subscribers: any = {};
  subscription: Subscription;
  sessionObject: SessionData;
  displayButton = false;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router: Router,
    private route: ActivatedRoute, public listProposalService: ListProposalService, public utilitiesService: UtilitiesService,
    public proposalDataService: ProposalDataService, public constantsService: ConstantsService, public blockUiService: BlockUiService,
    private qualService: QualificationsService, public appDataService: AppDataService, private breadcrumbsService: BreadcrumbsService,
    public permissionsService: PermissionService, public localeService: LocaleService) {

  }

  ngOnInit() {

    this.utilitiesService.adminSection = false;
    this.appDataService.isPurchaseOptionsLoaded = false; // to call the purchase options api and data when entering inside a proposal
    if(!this.permissionsService.permissions.size){
      this.appDataService.isReload = true;
    }
    this.sessionObject = this.appDataService.getSessionObject();

    if(this.sessionObject && this.appDataService.isReload){
      this.appDataService.pendingForMyApproval = this.sessionObject.pendingForMyApproval ;
      this.appDataService.pendingForTeamApproval = this.sessionObject.pendingForTeamApproval;
      this.appDataService.whereIAmApprover = this.sessionObject.whereIAmApprover;
    }
    
    // For partner remove pending exception and team approval
    if (this.appDataService.userInfo.isPartner) {
      this.listProposalService.arrDropDown = this.listProposalService.arrDropDown.slice(0, 2);
    }
    if (this.appDataService.pendingForMyApproval) {
      this.listProposalService.selectedDropdown = this.listProposalService.arrDropDown[2];
      this.proposalDataService.proposalDataObject.proposalData.groupName =
      this.localeService.getLocalizedString('dashboard.proposal.PENDING_MY_APPROVAL');
    } else if (this.appDataService.pendingForTeamApproval) {
      this.listProposalService.selectedDropdown = this.listProposalService.arrDropDown[3];
      this.proposalDataService.proposalDataObject.proposalData.groupName =
      this.localeService.getLocalizedString('dashboard.proposal.PENDING_TEAM_APPROVAL');
    } else if (this.appDataService.whereIAmApprover) {
      this.listProposalService.selectedDropdown = this.listProposalService.arrDropDown[4];
      this.proposalDataService.proposalDataObject.proposalData.groupName =
      this.localeService.getLocalizedString('dashboard.proposal.I_AM_APPROVER');
    } else if (this.proposalDataService.listProposalData.isCreatedByMe) {
      this.listProposalService.selectedDropdown = this.listProposalService.arrDropDown[0];
      this.proposalDataService.proposalDataObject.proposalData.groupName =
      this.localeService.getLocalizedString('dashboard.proposal.MY_PROPOSAL');
    } else {
      this.listProposalService.selectedDropdown = this.listProposalService.arrDropDown[1];
      this.proposalDataService.proposalDataObject.proposalData.groupName =
      this.localeService.getLocalizedString('dashboard.proposal.SHARED_PROPOSAL');
    }

    if (this.sessionObject) {
      this.appDataService.userDashboardFLow = this.sessionObject.userDashboardFlow;
      this.appDataService.isPatnerLedFlow = this.sessionObject.isPatnerLedFlow;

      //check if subrefId is empty and subscription data is present in session -- set the data and changeSubFlow
      if (!this.qualService.subRefID && this.sessionObject.qualificationData && this.sessionObject.qualificationData.subscription && this.sessionObject.qualificationData.subscription.subRefId) {
        this.qualService.qualification.subscription = this.sessionObject.qualificationData.subscription;
        this.qualService.subRefID = this.sessionObject.qualificationData.subscription.subRefId;
      }

      this.breadcrumbsService.showOrHideBreadCrumbs(true);
      if (this.appDataService.userInfo.userId === '') {
        this.appDataService.userInfo.userId = this.sessionObject.userInfo.userId;
        this.appDataService.userInfo.accessLevel = this.sessionObject.userInfo.accessLevel;
        this.appDataService.userInfo.firstName = this.sessionObject.userInfo.firstName;
        this.appDataService.userInfo.lastName = this.sessionObject.userInfo.lastName;
        this.appDataService.userInfo.emailId = this.sessionObject.userInfo.emailId;
        this.appDataService.userInfo.partnerAuthorized = this.sessionObject.userInfo.partnerAuthorized;
        this.appDataService.userInfo.authorized = this.sessionObject.userInfo.authorized;
      }
      // set header after userinfo is set from session
      if(this.sessionObject.userInfo && this.appDataService.isReload){
        this.appDataService.userInfoObjectEmitter.emit(this.sessionObject.userInfo);
      }
      this.loadCreateProposal();
    } else {
      // this.breadcrumbsService.showOrHideBreadCrumbs(true);
      this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
      this.appDataService.isReload = true;
      this.appDataService.findUserInfo();
      this.subscription = this.appDataService.createProposalEmitter.subscribe((data) => {
        this.sessionObject = data;
        this.sessionObject.userDashboardFlow = 'userFlow';
        const qualId = this.route.snapshot.params.qualId;
        if (qualId) {
          this.qualService.qualification.qualID = qualId;
          this.appDataService.userDashboardFLow = '';
          this.breadcrumbsService.breadCrumbStatus.next(true);
          this.appDataService.movebreadcrumbUp.next(true);
          this.listProposalService.getProposalList().subscribe(res => {
            this.sessionObject['qualificationData'] = res;
          });
        }
        this.loadCreateProposal();
      });
    }
  }

  loadCreateProposal() {
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW && this.appDataService.isReadWriteAccess) {
      this.appDataService.showEngageCPS = true;
      this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    }
    // this.appDataService.userId = this.appDataService.userInfo.userId;

    // to hide the edit icon on proposal list page
    this.appDataService.isProposalIconEditable = false;

    if (this.qualService.qualification.qualID === '') {
      if (this.sessionObject.qualificationData && this.sessionObject.qualificationData.qualID) {
        this.qualService.qualification = this.sessionObject.qualificationData;
      }
    }
    this.subscribers.name = this.listProposalService.emitQualStatus.subscribe((response: any) => {
      // to check for RO sales team member from sales Team and set the message to disable create proposal
      if (response.userAccessType === ConstantsService.USER_READ_ONLY_ACCESS) {
        const salesTeam = response.salesTeamList.map(item => item.trim());
        for (let i = 0; i < salesTeam.length; i++) {
          if (salesTeam[i] === (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName)) {
            this.appDataService.roSalesTeam = true;
            break;
          } else {
            this.appDataService.roSalesTeam = false;
          }
        }
      } else {
        this.appDataService.roSalesTeam = false;
      }
      // check if user accesstype is read-write
      // if (response.userAccessType !== ConstantsService.USER_READ_WRITE_ACCESS) {
      //   this.titleWithButton.buttons[0].attr = true;
      //   this.proposalDataService.readOnlyAccessType = true;
      //   this.proposalDataService.rwSuperUserAccessType = false;
      //   this.proposalDataService.qualInProgressMsg = false;
      // }
      // check if user has read-write access and also if has read-write access but not create access
      //  and show respective message while creating proposals
      if (!response.rwAccess) {
        this.displayButton = false;
        this.proposalDataService.readOnlyAccessType = true;
        this.proposalDataService.rwSuperUserAccessType = false;
        this.proposalDataService.roSalesteamAccessType = false;
        this.proposalDataService.qualInProgressMsg = false;
      } else if (response.rwAccess && !response.createAccess && this.appDataService.roSalesTeam) {
        // to show rw super user and ro sales team message for disabling create access
        this.displayButton = false;
        this.proposalDataService.readOnlyAccessType = false;
        this.proposalDataService.roSalesteamAccessType = true;
        this.proposalDataService.rwSuperUserAccessType = false; // set to show message that rw super user has to be part of mamage team
        this.proposalDataService.qualInProgressMsg = false;
      } else if (response.rwAccess && !response.createAccess && !this.appDataService.roSalesTeam) {
        // to show rw super user message for disabling create access
        this.displayButton = false;
        this.proposalDataService.readOnlyAccessType = false;
        this.proposalDataService.roSalesteamAccessType = false;
        this.proposalDataService.rwSuperUserAccessType = true; // set to show message that rw super user has to be part of mamage team
        this.proposalDataService.qualInProgressMsg = false;
      } else if (response.qualStatus !== this.constantsService.COMPLETE_STATUS) {
        this.displayButton = false;
        this.proposalDataService.qualInProgressMsg = true;
        this.proposalDataService.rwSuperUserAccessType = false;
        this.proposalDataService.roSalesteamAccessType = false;
        this.proposalDataService.readOnlyAccessType = false;
      } else {
        this.proposalDataService.qualInProgressMsg = false;
        this.proposalDataService.rwSuperUserAccessType = false;
        this.proposalDataService.roSalesteamAccessType = false;
        this.proposalDataService.readOnlyAccessType = false;
        this.displayButton = this.permissionsService.qualPermissions.has(PermissionEnum.QualViewOnly) ? false: true;
      }
    });
    // if(this.sessionObject){
    //   console.log(this.sessionObject);
    //   this.qualService.qualification.qualID = this.sessionObject.qualificationData.qualID;
    // }
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
      const qualName = this.qualService.qualification.name.toUpperCase();
      this.appDataService.custNameEmitter.emit({
        'context': AppDataService.PAGE_CONTEXT.userProposals,
        'text': qualName, qualId: this.qualService.qualification.qualID
      });
      this.blockUiService.spinnerConfig.startChain(); // start chain until proposal list loads
      this.blockUiService.spinnerConfig.blockUI();
      // check for page context and set to proposal list 
      if(!this.appDataService.pageContext){
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalList;
      }
      this.listProposalService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
      // call header service if dashboardflow not equal to user flow
    }
    this.listProposalService.getProposalList().subscribe((res: any) => {
      if ((res && !res.error && res.data && res.data.length > 0) || this.appDataService.pendingForMyApproval ||
      this.appDataService.pendingForTeamApproval) {
        if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW && !this.appDataService.pendingForMyApproval &&
          !this.appDataService.pendingForTeamApproval) {
          this.qualService.qualification.qualID = res.data[0].qualId;
        }
        if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
          // if not dashoardflow not equal to user flow, unbockUI and stop chain
          this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall(); // unblockUI and stop chain after proposal list loads
        }
        this.loadComponent(ProposalListComponent);
        if (res.data) {
          this.proposalDataService.listProposalData.data = res.data;
        } else {
          this.proposalDataService.listProposalData.data = [];
        }
        // if(this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW && this.appDataService.isReadWriteAccess){
        //   this.appDataService.showEngageCPS = true;
        // }
      } else {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.loadComponent(ProposalCreateTutorialComponent);
      }
      if (this.sessionObject) {
        this.appDataService.userInfo = this.sessionObject.userInfo;
        this.appDataService.isReadWriteAccess = this.sessionObject.isUserReadWriteAccess;
        // commenting out for further use
        // if(this.titleWithButton.buttons){
        //     // this.titleWithButton.buttons[0].attr = this.sessionObject.qualificationData.qualStatus ===
        // this.constantsService.COMPLETE_STATUS ? false: true;
        //     if (!this.sessionObject.isUserReadWriteAccess) {
        //       this.titleWithButton.buttons[0].attr = true;
        //       this.proposalDataService.readOnlyAccessType = true;
        //       this.proposalDataService.rwSuperUserAccessType = false;
        //       this.proposalDataService.qualInProgressMsg = false;
        //     }else if (this.sessionObject.isUserReadWriteAccess && !this.sessionObject.createAccess) {
        // to show rw super user message for disabling create access
        //       this.titleWithButton.buttons[0].attr = true;
        //       this.proposalDataService.readOnlyAccessType = false;
        //       this.proposalDataService.rwSuperUserAccessType = true;
        // set to show message that rw super user has to be part of mamage team
        //       this.proposalDataService.qualInProgressMsg = false;
        //     } else if((this.sessionObject.qualificationData.qualStatus && this.sessionObject.qualificationData.qualStatus
        // !== this.constantsService.COMPLETE_STATUS) || this.qualService.qualification.qualStatus
        //  !== this.constantsService.COMPLETE_STATUS){ // check qual status from qual service or from session
        //       this.proposalDataService.qualInProgressMsg = true;
        //       this.titleWithButton.buttons[0].attr = true;
        //       this.proposalDataService.rwSuperUserAccessType = false;
        //       this.proposalDataService.readOnlyAccessType = false;
        //     }
        //     else {
        //       this.proposalDataService.qualInProgressMsg = false;
        //       this.proposalDataService.rwSuperUserAccessType = false;
        //       this.proposalDataService.readOnlyAccessType = false;
        //       this.titleWithButton.buttons[0].attr = false;

        //     }
        // }
      }
    });
  }

  loadComponent(component: any, inputs: any = null) {
    if (this.component) {
      this.component.destroy();
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.dynamicDiretive.viewContainerRef;
    viewContainerRef.clear();
    this.component = viewContainerRef.createComponent(componentFactory);
    (<any>this.component).instance.inputs = inputs;
    // (<any>this.component).instance.callback = (type: string, result: any) => {this.checkResult(type, result)};
  }

  ngOnDestroy() {
    // if (!this.appDataService.isReload) {
    //   this.subscription.unsubscribe();
    // }
    this.appDataService.pendingForMyApproval = false;
    this.appDataService.pendingForTeamApproval = false;
    this.appDataService.whereIAmApprover = false;
    this.qualService.toProposalSummary = false;
    this.subscribers.name.unsubscribe();

    if (this.component) {
      this.component.destroy();
    }
  }

  getTitleWithButton(): ITitleWithButtons {
    let returnObject: ITitleWithButtons;

    //   if(this.appDataService.isReadWriteAccess){
    returnObject = {
      title: '<h2>Proposals</h2>',
      baseClass: '',
      parentClass: 'col-md-5',
      rootClass: 'row align-items-center',
      buttonParentClass: 'qualify-btn',
      buttonDivisionClass: 'col-md-7',
      buttons: [
        {
          name: 'Create New',
          buttonClass: 'btn btn-primary',
          attr: false,
          parentClass: 'viewProspect',
          click: () => {
            if (this.qualService.qualification.qualStatus === this.constantsService.COMPLETE_STATUS) {
              this.qualService.showDealIDInHeader = false;
              this.proposalDataService.proposalDataObject.newProposalFlag = true;
              this.proposalDataService.updateSessionProposal();
              this.router.navigate(['createProposal'], { relativeTo: this.route });
            }
          }
        }
      ]
    };
    return returnObject;
  }
  
  createProposal() {
    if (this.qualService.qualification.qualStatus === this.constantsService.COMPLETE_STATUS) {
      this.qualService.showDealIDInHeader = false;
      this.proposalDataService.proposalDataObject.newProposalFlag = true;
      this.proposalDataService.updateSessionProposal();
      this.router.navigate(['createProposal'], { relativeTo: this.route });
    }
  }

  // mehtod to route to EA Renewals page
  initiateRenewal(){
    this.router.navigate(['qualifications/' + this.qualService.qualification.qualID + '/follow-on/select-subscription']);
  }
}
