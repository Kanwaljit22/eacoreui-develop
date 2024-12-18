import { AddSpecialistComponent } from './../modal/add-specialist/add-specialist.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BlockUiService } from './../shared/services/block.ui.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { LocaleService } from './../shared/services/locale.service';
import { PermissionEnum } from './../permissions';
import { DealListService } from './../dashboard/deal-list/deal-list.service';
import { PermissionService } from './../permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { BreadcrumbsService } from './../core/breadcrumbs/breadcrumbs.service';
import { Subscription } from 'rxjs';
import { ProposalDataService } from './../proposal/proposal.data.service';
import { QualificationsService } from './../qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Renderer2, OnDestroy } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { QualProposalListObj, ConstantsService } from '@app/shared/services/constants.service';
import { NewLaunchedExpComponent } from './../modal/new-launched-exp/new-launched-exp.component';
import { ListProposalService } from '@app/proposal/list-proposal/list-proposal.service';

@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  prospectsData: any[];
  upcomingTfData: any[];
  upcomingRenewalData: any[];
  activeAgreementData: any[];
  qualData: QualProposalListObj;
  proposalData: QualProposalListObj;
  isCreatedbyQualView = true;
  isCreatedByProposalView = true;
  openQualDrop = false;
  openProposalDrop = false;
  openProspectDrop = false;
  openComplianceDrop = false;
  selectedQualView = 'Created by Me';
  selectedProposalView = 'Created by Me';
  selectedProspectView = 'Start Here';
  selectedComplianceView = 'Created by Me';
  showFavoritesProspects = false;
  QualViewoptions = ['Created by Me', 'Shared with Me'];
  DealViewOptions = ['Created by Me', 'Created by my Team'];
  ProspectViewOptions = ['All Prospects', 'All Favorite Prospects'];
  dealData: any = [];
  dealCreatedByTeam = false;
  showEADeals = false;
  selectedDealView = 'Created by Me';
  openDealDrop = false;

  displayFavToggle = false;
  displayMyQual = false;
  displayMyProposal = false;
  displayProspects = false;
  isPartnerUser = true;
  displayMyDeal = false;
  partnerLedFlow = false;
  subscription: Subscription;
  proposalPendingForMyApproval = 0;
  proposalPendingForTeamApproval = 0;
  proposalPendingDataLoaded = false;
  qualDataLoaded = false;
  proposalDataLoaded = false;
  showMessage = true;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  qualOrProposal = 'dashboard';

  subscribers: any = {};
  globalView = true;
  showTaketour = true;
  slides = [{
    'index': 1,
    'url': 'assets/images/banner-thumb-1.jpg',
    'active': true
  },
  {
    'index': 2,
    'url': 'assets/images/banner-thumb-2.png',
    'active': false
  }];

  firstBanner = true;
  secondBanner = false;
  selectedIndex = 0;
  maxSlide = 7;
  closeSlide = true;

  tourGuide = [{ 'index': 1, 'url': 'assets/images/slide-1.jpg', 'active': true },
  { 'index': 2, 'url': 'assets/images/slide-2.jpg', 'active': false },
  { 'index': 3, 'url': 'assets/images/slide-3.jpg', 'active': false },
  { 'index': 4, 'url': 'assets/images/slide-4.jpg', 'active': false },
  { 'index': 5, 'url': 'assets/images/slide-5.jpg', 'active': false },
  { 'index': 6, 'url': 'assets/images/slide-6.jpg', 'active': false },
  { 'index': 7, 'url': 'assets/images/slide-7.jpg', 'active': false },
  { 'index': 8, 'url': 'assets/images/slide-8.jpg', 'active': false }];

  constructor(public localeService: LocaleService, private router: Router,
    public productSummaryService: ProductSummaryService, public renderer: Renderer2,
    public appDataService: AppDataService, private route: ActivatedRoute, public dashboardService: DashboardService,
    private breadcrumbsService: BreadcrumbsService, private messageService: MessageService,
    public utilitiesService: UtilitiesService, private permissionService: PermissionService,
    private qualService: QualificationsService, private proposalDataService: ProposalDataService, private dealListService: DealListService,
    public constantsService: ConstantsService, public blockUiService: BlockUiService,
    private modalVar: NgbModal, private listProposalService: ListProposalService) { }

  ngOnInit() {
    this.initializedDashboardData();
    this.subscription = this.appDataService.proxyUserEmitter.subscribe(() => {
      this.subscribers.userInfoObjectEmitter.unsubscribe();
      this.initializedDashboardData();
    });
    
    if (this.selectedIndex === 0) {
      this.renderer.addClass(document.body, 'carousel-body');
    }

    if (this.appDataService.isDashboardVisited) {
      this.closeSlide = true;
    }
  }
  ngOnDestroy() {
    this.appDataService.pageContext = '';
    this.appDataService.subHeaderData.moduleName = '';
    this.appDataService.subHeaderData.custName = '';
    this.dashboardService.fullLoader = false;
    if (this.subscribers.userInfoObjectEmitter) {
      this.subscribers.userInfoObjectEmitter.unsubscribe();
    }
    this.appDataService.isDashboardVisited = true;
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  getProspectsData() {
    this.dashboardService.prospectLoader = true;
    this.dashboardService.fullLoader = false;
    let viewType = 'GLOBAL';
    if (!this.globalView) {
      viewType = 'Sales_account_view';
    }
    this.dashboardService.getProspectsData(viewType).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          this.prospectsData = response.data;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
      setTimeout(() => {
        this.dashboardService.prospectLoader = false;
      }, 2000);
    });

  }

  getProposalPendingForApproval() {
    this.dashboardService.getApprovalPendingProposalCount().subscribe((response: any) => {
      if (response) {
        if (response.pendingMyApproval || response.pendingMyApproval === 0) {
          this.proposalPendingForMyApproval = response.pendingMyApproval;
        }
        if (response.pendingMyTeamApproval || response.pendingMyTeamApproval === 0) {
          this.proposalPendingForTeamApproval = response.pendingMyTeamApproval;
        }
        this.proposalPendingDataLoaded = true;
      }

    });
  }

  pendingProposal(view) {
    if (view === 'myProposal') {
      this.appDataService.pendingForMyApproval = true;
    } else {
      this.appDataService.pendingForTeamApproval = true;
    }

    this.goToProposalList();
  }

  getQualData(isCreatedByMeData) {
    this.dashboardService.qualificationLoader = true;
    this.dashboardService.fullLoader = false;
    this.dashboardService.getQualData(isCreatedByMeData).subscribe((response: any) => {

      this.qualDataLoaded = true;

      if (response.data && !response.error) {

        try {
          //  this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
          this.qualData = response;
          this.qualData.isCreatedByMe = isCreatedByMeData;
          this.qualService.isCreatedByMe = isCreatedByMeData;
          const dimensionValue = this.appDataService.userInfo.userId;
          this.utilitiesService.showSuperUserMessage(this.permissionService.permissions.has(PermissionEnum.RwMessage),
          this.permissionService.permissions.has(PermissionEnum.RoMessage), this.qualOrProposal);
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.qualData.data = [];
        this.messageService.displayMessagesFromResponse(response);
      }
      setTimeout(() => {
        this.dashboardService.qualificationLoader = false;
      }, 2000);
    });
  }

  viewAllProspects() {
    this.productSummaryService.viewFavorites = this.showFavoritesProspects;
    this.productSummaryService.globalView = this.globalView;
    this.router.navigate(['/prospects']);
  }

  close() {
    this.showMessage = false;
  }

  getProposalData(isCreatedByMeData) {
    this.dashboardService.proposalLoader = true;
    this.dashboardService.fullLoader = false;
    this.dashboardService.getProposalData(isCreatedByMeData).subscribe((response: any) => {

      this.proposalDataLoaded = true;
      if (response.data && !response.error) {
        try {
          this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
          this.proposalData.data = response.data;
          this.proposalData.isCreatedByMe = isCreatedByMeData;
          this.proposalData.isProposalOnDashboard = true;
         this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.proposalData.data = [];
        this.messageService.displayMessagesFromResponse(response);
      }
      setTimeout(() => {
        this.dashboardService.proposalLoader = false;
        // adding pageContext here as it is getting updated while loading my proposal section.
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
      }, 2000);
    });
  }

  goToQualification() {
    this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
    this.qualService.isCreatedbyQualView = this.isCreatedbyQualView;
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.appDataService.isGroupSelected = true;
    if (this.qualService.isCreatedByMe) {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.MY_QUAL');
      this.selectedQualView = 'Created by Me';
    } else {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.SHARED_QUAL');
      this.selectedQualView = 'Shared with Me';
    }
    this.router.navigate(['/qualifications']);
  }


  goToProposalList() {
    this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
    sessionObject.pendingForMyApproval = this.appDataService.pendingForMyApproval;
    sessionObject.pendingForTeamApproval = this.appDataService.pendingForTeamApproval;
    if(this.appDataService.userInfo.permissions.size){
      sessionObject.userInfo.permissions = this.appDataService.userInfo.permissions;
    }
    this.proposalDataService.listProposalData = { data: [], isCreatedByMe: this.isCreatedByProposalView, isToggleVisible: true }
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    // this.blockUiService.spinnerConfig.blockUI();
    this.router.navigate(['/proposal']);
  }

  selectQual(value) {
    this.selectedQualView = value;
    this.openQualDrop = false;
    if (this.selectedQualView === 'Created by Me') {
      this.getQualData(true);
      this.isCreatedbyQualView = true;
    } else if (this.selectedQualView === 'Shared with Me') {
      this.getQualData(false);
      this.isCreatedbyQualView = false;
    }
  }

  selectProposal(val) {
    this.selectedProposalView = val;
    this.openProposalDrop = false;
    if (this.selectedProposalView === 'Created by Me') {
      this.getProposalData(true);
      this.isCreatedByProposalView = true;
    } else if (this.selectedProposalView === 'Shared with Me') {
      this.getProposalData(false);
      this.isCreatedByProposalView = false;
    }
  }

  selectProspect(event) {
    this.selectedProspectView = event;
    this.openProspectDrop = false;
    if (event === 'All Favorite Prospects') {
      this.showFavoritesProspects = true;
      this.dashboardService.prospectLoader = true;
      this.prospectsData = [];
      this.dashboardService.getFavorites().subscribe((response: any) => {
        if (!response.error && response.data) {
          this.prospectsData = response.data;
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
        setTimeout(() => {
          this.dashboardService.prospectLoader = false;
        }, 2000);

      });
    } else if ((event === 'All Prospects')) {
      this.showFavoritesProspects = false;
      this.getProspectsData();
    }
  }

  dealDataReceived(data) {
    this.dealData = data;
  }

  selectDeal(value) {
    if (this.selectedDealView !== value) {
      this.dealCreatedByTeam = !this.dealCreatedByTeam;
    }
    this.selectedDealView = value;
    this.openDealDrop = false;
  }

  openSpecialist() {

    this.blockUiService.spinnerConfig.blockUI();
    const ngbModalOptionsLocal = this.ngbModalOptions;
    const modalRef = this.modalVar.open(AddSpecialistComponent, { windowClass: 'add-specialist' });
  }

  closeSoftwareSpecialistMessage() {
    this.appDataService.showSoftwareSpecialistMessage = false;
  }


  goToMyDeals() {

    this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
    this.qualService.isCreatedbyQualView = this.isCreatedbyQualView;
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.dealListService.showFullList = true;
    this.breadcrumbsService.showOrHideBreadCrumbs(true);
    this.dealListService.isCreatedByMe = !this.dealCreatedByTeam;
    this.router.navigate(['/mydeals']);
  }

  initializedDashboardData() {
    this.messageService.clear();
    // this.appDataService.userInfo.rwSuperUser = false
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
    this.utilitiesService.adminSection = false;
    this.dealListService.showFullList = false;
    this.breadcrumbsService.showOrHideBreadCrumbs(false);
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.renderer.addClass(document.body, 'dashboard-body');
    sessionStorage.setItem(AppDataService.SESSION_OBJECT, JSON.stringify(this.appDataService.sessionObject));
    this.appDataService.flow = this.route.snapshot.queryParamMap.get('flow');
    this.appDataService.findUserInfo();
    this.qualData = { data: '' };
    this.proposalData = { data: '' };
    this.subscribers.userInfoObjectEmitter = this.appDataService.userInfoObjectEmitter.subscribe((userInfo: any) => {
      this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
      if(this.appDataService.userInfo.distiUser){
      this.DealViewOptions[1] = 'Created by Partner';
     }
      this.displayFavToggle = this.permissionService.permissions.has(PermissionEnum.Favorite);
      // display prospects only if the user has permission
      if (this.permissionService.permissions.has(PermissionEnum.Prospect)) {
        this.displayProspects = true;
        if (this.appDataService.userInfo.salesAccountView) {
          this.globalView = false;
        } else {
          this.globalView = true;
        }
        this.getProspectsData();
      } else {
        this.displayProspects = false;
      }
      if (this.permissionService.permissions.has(PermissionEnum.Qualification)) {
        this.displayMyQual = true;
        this.getQualData(true);
      } else {
        this.displayMyQual = false;
      }
      if (this.permissionService.permissions.has(PermissionEnum.Proposal)) {
        this.displayMyProposal = true;
        this.getProposalData(true);
      } else {
        this.displayMyProposal = false;
      }
      this.displayMyDeal = !this.displayProspects;
      if (!this.appDataService.isPatnerLedFlow) {
        this.getProposalPendingForApproval();
      }
    });
  }

  onCompOutside(event) {
    this.openComplianceDrop = false;
  }

  onQualOutside(event) {
    this.openQualDrop = false;
  }

  onDealOutside(event) {
    this.openDealDrop = false;
  }

  onProposalOutside(event) {
    this.openProposalDrop = false;
  }

  onProsOutside(event) {
    this.openProspectDrop = false;
  }

  selectCompliance(val) {
    this.selectedComplianceView = val;
    this.openComplianceDrop = false;
  }

  globalSwitchChange(checked) {
    this.globalView = checked;
    this.getProspectsData();
  }

  openLaunchModal() {
    const modalRef = this.modalVar.open(NewLaunchedExpComponent, { windowClass: 'launch-experience' });
    modalRef.result.then((result) => {
      if (result.continue === true) {

      }
    });
  }

  selectSlide(slide) {
    for (let i = 0; i < this.slides.length; i++) {
      if (slide.index === this.slides[i].index) {
        this.slides[i].active = true;
        this.firstBanner = !this.slides[i].active;
        this.secondBanner = this.slides[i].active;
      } else {
        this.slides[i].active = false;
        this.firstBanner = !this.slides[i].active;
        this.secondBanner = this.slides[i].active;
      }
    }
    if (slide.index === 1) {
      this.showTaketour = false;
    } else {
      this.showTaketour = true;
    }
  }

  nextSlide() {
    this.selectedIndex++;
    if (this.selectedIndex > 0) {
      this.renderer.removeClass(document.body, 'carousel-body');
    }
  }

  backSlide() {
    this.selectedIndex--;
    if (this.selectedIndex === 0) {
      this.renderer.addClass(document.body, 'carousel-body');
    }
  }

  closeSlideBanner() {
    this.closeSlide = true;
    this.selectedIndex = 0;
  }

}
