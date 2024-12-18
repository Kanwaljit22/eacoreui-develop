
import { Component, OnInit, OnDestroy, ViewChild, ComponentRef, ComponentFactoryResolver, HostListener, Renderer2 } from '@angular/core';
import { IRoadMap, RoadMapConstants, RoadMapGrid } from '@app/shared';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { WhoInvolvedComponent } from './who-involved/who-involved.component';
import { ManageGeographyComponent } from './manage-geography/manage-geography.component';
import { ManageAffiliatesComponent } from './manage-affiliates/manage-affiliates.component';
import { QualSummaryComponent } from './qual-summary/qual-summary.component';
import { EditProposalHeaderComponent } from '../../modal/edit-proposal-header/edit-proposal-header.component';
import { DocumentCenterService } from '../../document-center/document-center.service';
import { QualSummaryService } from './qual-summary/qual-summary.service';
import { QualificationsService } from '../qualifications.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
import { MessageService } from '@app/shared/services/message.service';
import { WhoInvolvedService } from './who-involved/who-involved.service';
import { SessionData, AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { BreadcrumbsService } from '@app/core';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';

@Component({
  selector: 'app-edit-qualifications',
  templateUrl: './edit-qualifications.component.html'
})

export class EditQualificationsComponent implements OnInit, OnDestroy {
  subData = {
    'name': 'Cisco EA for Cisco One-Adobe-WW-FY18',
    'icon': false,
    'iconEdit': true,
    'swQtyH': 'Deal ID',
    'swAmtH': 'Account Manager',
    'statusH': 'Status',
    'swQty': '293742967',
    'swAmt': 'Paul Sorge',
    'serviceAmt': '',
    'status': 'New'
  };
  componentNumToLoad: number;
  roadMaps: Array<IRoadMap>;
  roadMapGrid: RoadMapGrid;
  currentStep: number;
  editArr = [];
  editValues = false;
  involvedSpecialist = [];
  involvedMembers = [];
  cxTeamsData = []; // to store cx specialist team data


  constructor(public localeService: LocaleService, private router: Router, private route: ActivatedRoute, private modalVar: NgbModal,
    private appDataService: AppDataService, public documentCenter: DocumentCenterService, public qualService: QualificationsService,
    public permissionService: PermissionService, public breadcrumbsService: BreadcrumbsService,
    public qualSummaryService: QualSummaryService, public messageService: MessageService, public involvedService: WhoInvolvedService,
    public utilitiesService: UtilitiesService, public renderer: Renderer2,public eaService: EaService,public eaStoreService: EaStoreService) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset >= 80 && window.pageYOffset <= 185) {
      //this.renderer.addClass(document.body, 'sticky-header');
      this.renderer.removeClass(document.body, 'sticky-header-button');
    } else if (window.pageYOffset > 185) {
      this.renderer.addClass(document.body, 'sticky-header');
      this.renderer.addClass(document.body, 'sticky-header-button');
    } else {
      this.renderer.removeClass(document.body, 'sticky-header-button');
      this.renderer.removeClass(document.body, 'sticky-header');
    }
  }

  ngOnInit() {
    if(this.eaStoreService.isValidationUI){
      this.eaService.navigateToVui();
    }
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        let qualId = params.get('qualId');
        if (qualId !== undefined && qualId.length > 0) {
          if (this.qualService.createQualFlow) {
            this.componentNumToLoad = 0;
            this.qualService.createQualFlow = false;
          } else {
            this.componentNumToLoad = 3;
          }
          this.qualService.qualification.qualID = qualId;
        }
      }

    });

    this.appDataService.isProposalIconEditable = true;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    this.appDataService.enableQualFlag = true;

    // if (this.qualService.qualification.name === "") {
    //   if(sessionObject){
    //     this.qualService.qualification = sessionObject.qualificationData;
    //     this.qualService.comingFromDocCenter = sessionObject.comingFromDocCenter;
    //   }
    // }

    this.roadMaps = [
      {
        name: this.localeService.getLocalizedString('roadmap.qual.WHO_IS_INVOLVED'),
        component: WhoInvolvedComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(1);
          },
          back: () => {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.qual.GEO'),
        component: ManageGeographyComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(2);
          },
          back: () => {
            this.roadMapGrid.loadComponent(0);
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.qual.SUBSIDIARY'),
        component: ManageAffiliatesComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(3);
          },
          back: () => {
            this.roadMapGrid.loadComponent(1);
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.qual.SUMMARY'),
        component: QualSummaryComponent,
        eventWithHandlers: {
          continue: () => {
            // console.log(this.roadMaps);
          },
          back: () => {
            this.roadMapGrid.loadComponent(2);
          },
          backToGeography: () => {
            this.roadMapGrid.loadComponent(1);
          },
          backToInvolved: () => {
            this.roadMapGrid.loadComponent(0);
          }
        }
      }
    ];
    this.roadMapGrid = new RoadMapGrid(this.roadMaps);

    if (this.qualService.comingFromDocCenter) {
      this.qualSummaryService.getCustomerInfo().subscribe((res: any) => {
        if (res) {
          if (res.messages && res.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(res);
          }
          if (!res.error) {
            try {
              if (res.data) {
                let data = res.data;
                this.qualService.qualification.name = data.qualName;
                this.qualService.qualification.qualID = data.qualId;
                this.qualService.qualification.status = data.status;
                this.qualService.qualification.eaQualDescription = data.description;
                if (data.saleSpecialist) {
                  this.involvedSpecialist = data.saleSpecialist;
                  this.qualService.qualification.softwareSalesSpecialist = data.saleSpecialist;
                  for (let i = 0; i < data.saleSpecialist.length; i++) {
                    data.saleSpecialist[i].previouslyAdded = true; //add this property to check if specialist has been previously added so that we can disable checkbox when adding contacts again 
                  }
                  this.involvedService.previouslySelectedSpecialist = data.saleSpecialist; //Set previously selected speciualist to show them on add  Pop up
                }
                if (data.extendedSalesTeam) {
                  this.involvedMembers = data.extendedSalesTeam;
                  this.qualService.qualification.extendedsalesTeam = data.extendedSalesTeam;
                }
                if (data.cxTeams) {
                  this.cxTeamsData = data.cxTeams;
                  this.qualService.qualification.cxTeams = data.cxTeams;
                }
                if (data.assurersTeams) {
                 // this.cxTeamsData = data.assurersTeams;
                  this.qualService.qualification.cxDealAssurerTeams = data.assurersTeams;
                }
                if (data.partnerTeams) {
                  // this.involvedMembers = data.extendedSalesTeam;
                  this.qualService.qualification.partnerTeam = data.partnerTeams;
                }
                if (data.customerContact) {
                  // If legal name is not inputed by user assign default value as accountName
                  if (data.customerContact.preferredLegalName) {
                    this.qualService.qualification.customerInfo.preferredLegalName = data.customerContact.preferredLegalName;
                  } else {
                    this.qualService.qualification.customerInfo.preferredLegalName = data.deal.accountName;
                  }

                  this.qualService.qualification.customerInfo.affiliateNames = data.customerContact.affiliateNames;
                  this.qualService.qualification.customerInfo.repEmail = data.customerContact.repEmail;
                  this.qualService.qualification.customerInfo.repName = data.customerContact.repName;
                  this.qualService.qualification.customerInfo.repTitle = data.customerContact.repTitle;
                  this.qualService.qualification.customerInfo.phoneNumber = data.customerContact.phoneNumber;
                  this.qualService.qualification.customerInfo.phoneCountryCode = data.customerContact.phoneCountryCode;
                  this.qualService.qualification.customerInfo.dialFlagCode = data.customerContact.dialFlagCode;
                }
                if (data.deal) {
                  this.qualService.qualification.dealId = data.deal.dealId;
                  this.qualService.qualification.accountName = data.deal.accountName;
                  this.qualService.qualification.accountAddress = data.deal.accountAddress;
                  this.qualService.qualification.accountManager.firstName = data.deal.accountManager.firstName;
                  this.qualService.qualification.accountManager.lastName = data.deal.accountManager.lastName;
                  this.qualService.qualification.accountManager.emailId = data.deal.accountManager.emailId;
                }
                if (data.permissions && data.permissions.featureAccess &&
                  data.permissions.featureAccess.some(permission => (permission.name === PermissionEnum.QualEditName || permission.name === PermissionEnum.QualViewOnly))) {
                  this.qualService.qualification.userEditAccess = true;
                  this.qualService.readOnlyState = false;
                  this.appDataService.isReadWriteAccess = true;
                } else {
                  this.qualService.qualification.userEditAccess = false;
                  this.qualService.readOnlyState = true;
                  this.appDataService.isReadWriteAccess = false;
                }
              }
            } catch (error) {
              console.error(error.ERROR_MESSAGE);
              this.messageService.displayUiTechnicalError(error);
            }
          }
        }
        this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
        this.roadMaps[3].eventWithHandlers.backToInvolved();
      });
    }
    this.breadcrumbsService.showOrHideBreadCrumbs(true);
  }

  ngOnDestroy() {
    this.permissionService.qualPermissions.clear();
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.appDataService.roadMapPath = false;
    this.appDataService.roSalesTeam = false;
    this.renderer.removeClass(document.body, 'sticky-header-button');
    this.renderer.removeClass(document.body, 'sticky-header');
  }

}
