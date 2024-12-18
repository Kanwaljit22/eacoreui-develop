import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppDataService } from '../shared/services/app.data.service';
import { QualificationsService } from '../qualifications/qualifications.service';
import { BlockUiService } from '../shared/services/block.ui.service';
import { MessageService } from '../shared/services/message.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { QualProposalListObj, ConstantsService } from '../shared/services/constants.service';
import { ListProposalService } from '../proposal/list-proposal/list-proposal.service';
import { BreadcrumbsService } from '../core/breadcrumbs/breadcrumbs.service';
import { AllArchitectureViewService } from './all-architecture-view.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { LocaleService } from '@app/shared/services/locale.service';
 

@Component({
  selector: 'app-all-architecture-view',
  templateUrl: './all-architecture-view.component.html',
  styleUrls: ['./all-architecture-view.component.scss']
})
export class AllArchitectureViewComponent implements OnInit, OnDestroy {

  selectedTab = 'accounthealth';
  qualData: QualProposalListObj;
  searchQualBy: string;
  customerId: any;
  showQualList = false;
  proposalData: QualProposalListObj;
  showProposalList = false;
  openSharedDrop = false;
  selectedQualView = 'Created by Me';
  QualViewoptions = ['Created by Me', 'Shared with Me'];
  searchText = '';
  placeholder = '';
  activeAgreementData: any;
  showAggrementList = false;
  architecture: any;
  autoSelectedTab: any;
  subHeaderData: SubHeaderData;
  smartAccountList = [];
  agreementEmitter: Subscription;
  deleteAgreementEmitter: Subscription;
  proposalSub: Subscription;
  qualSub: Subscription;
  agreementSub: Subscription;
  smartAccountSub: Subscription;
  changeSmartAccountLinkSub: Subscription;
  userInfoSub: Subscription;
  isInternalUser = false;
  public subscribers: any = {};

  constructor(
    public qualService: QualificationsService,
    public appDataService: AppDataService,
    private blockUiService: BlockUiService,
    public messageService: MessageService,
    public localeService: LocaleService,
    private route: ActivatedRoute,
    private listPorposalService: ListProposalService,
    private breadCrumbService: BreadcrumbsService,
    public allArchitectureViewService: AllArchitectureViewService,
    private router: Router,
    private constantsService: ConstantsService
  ) { }

  ngOnInit() {
    this.appDataService.insideAllArchView = true;
    // code for not allowing partner to see 360 lifeycycle
    if (this.appDataService.userInfo.accessLevel === 0) {
      this.appDataService.findUserInfo();
    } else if (this.appDataService.userInfo.isPartner) {
      this.router.navigate(['']);
      this.isInternalUser = false;
      return;
    } else {
      this.isInternalUser = true;
    }

    this.userInfoSub = this.appDataService.userInfoObjectEmitter.subscribe((userInfo: any) => {
      if (userInfo.isPartner) {
        this.router.navigate(['']);
        this.isInternalUser = false;
        return;
      } else {
        this.isInternalUser = true;
      }
    });
    /// end

    this.breadCrumbService.showOrHideBreadCrumbs(true); 
    this.qualData = { data: [] };
    this.proposalData = { data: [] };
    this.agreementEmitter = this.appDataService.agreementDataEmitter.subscribe((smartAccountobj) => {
      this.allArchitectureViewService.smartAccountId = smartAccountobj.smartAccountId;
      this.getAgreementsData(smartAccountobj.smartAccountId);
      this.changeLindSmartAccount(smartAccountobj);
      //  this.changeLindSmartAccount({'smartAccountId':this.appDataService.linkedSmartAccountObj.id, 'active': false});
      this.appDataService.linkedSmartAccountObj.id = smartAccountobj.smartAccountId;
      this.appDataService.linkedSmartAccountObj.name = smartAccountobj.smartAccountName;

    });

    this.deleteAgreementEmitter = this.appDataService.deleteAgreementDataEmitter.subscribe(() => {
      this.appDataService.linkedSmartAccountObj = { name: 'Not Assigned', id: '' };
      this.allArchitectureViewService.activeAgreementData = '';

      if (this.appDataService.subHeaderData && this.appDataService.subHeaderData.subHeaderVal) {
        this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = 0;
      }
    });

    this.route.params.forEach((params: Params) => {
      if (Object.keys(params).length !== 0) {
        this.appDataService.userDashboardFLow = '';
        this.appDataService.customerID = decodeURIComponent(params['customerId']);
        this.appDataService.customerName = decodeURIComponent(params['customername']);
        this.architecture = decodeURIComponent(params['architecture']);
        this.appDataService.archName = decodeURIComponent(params['architecture']);
        // this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
        if (params.variable === 'landing') {
          this.qualService.flowSet = false;
        } else {
          this.qualService.flowSet = true;
        }
        if (params['selected'] && params['selected'] === this.constantsService.QUALIFICATION) {
          this.selectedTab = 'qualifications';
        }
      }

      // Initialization to avoid intermittent error(cannot read  numberofAgreements of undefined)
      this.subHeaderData = {
        moduleName: 'AllArchView',
        custName: this.appDataService.customerName,
        subHeaderVal: [
          {
            'numberOfQualifications': 0,
            'numberOfProposals': 0,
            'numberOfAgreements': 0,
            'ldosPercentage': 0,
            'serviceCoveragePercentage': 0,
            'toolTipMsg': []
          }
        ]
      };

      this.appDataService.subHeaderData = this.subHeaderData;
      this.getSubHeaderData();

    });


    if (this.selectedTab === 'qualifications') {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.accountHealth;
      this.onSelectQual('qualifications');
    } else {
      this.onSelectAccountHealth('accounthealth');
    }

    this.allArchitectureViewService.viewTabEmitter.subscribe((tab: any) => {
      if (tab === 'proposals') {
        this.onSelectProposal(tab);
      } else if (tab === 'qualifications') {
        this.onSelectQual(tab);
      } else if (tab === 'agreements') {
        this.onSelectAgreement(tab);
      } else if (tab === 'compliance') {
        this.onSelectAgreement(tab);
      }
    });

    this.getSmartAccountList();

    this.appDataService.reloadSmartAccountEmitter.subscribe((response: any) => {
      this.getSmartAccountList();
    });

    // subsctribe to emitter and call qual list afte clone/change deal success
    this.subscribers.qualListUpdated = this.qualService.loadUpdatedQualListEmitter.subscribe(() => {
      this.getQualList();
    });
  }

  getSearchText(value) {
    this.searchText = value;
  }

  onSelectQual(tab) {
    this.selectedTab = tab;
    this.searchText = '';
    this.placeholder = 'Search By All Qualifications';
    this.showProposalList = false;
    this.showAggrementList = false;
    this.qualData.isToggleVisible = true;
    this.qualData.isProposalOnDashboard = false;
    this.qualData.editIcon = true;
    this.getQualList();
  }

  // this method will call qual list of the customer
  getQualList() {

    this.appDataService.isQualOrPropListFrom360Page = false;
    this.qualSub = this.qualService.listQualification().subscribe((response: any) => {
      if (response) {
        this.showQualList = true;
        if (response.messages && response.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
          try {
            if (response.data == null) {
              // No qualifications created before, show create qual UI
              // this.isDisableCreate = true;
              // this.showCreateQual = true;
              return;
            }
            if (response.data.length > 0) {
              // Qualifications were creted before, show them
              // this.showCreateQual = false;

              // this.isDisableCreate = false;
              this.qualData.data = response.data;
              // this.rowData = this.qualData.data;
              // this.appendId();
              this.qualService.qualListData = response;
            }
            // if(response.favorite){
            this.appDataService.isFavorite = response.favorite === true ? 1 : 0;
            // }
          } catch (error) {
            // this.isDisableCreate = true;
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          // this.isDisableCreate = true;
          this.messageService.displayMessagesFromResponse(response);
        }
      }
    });
  }

  onSelectProposal(tab) {
    this.selectedTab = tab;
    this.searchText = '';
    this.placeholder = 'Search By All Proposals';
    this.showQualList = false;
    this.showAggrementList = false;
    this.proposalData.isToggleVisible = true;
    this.proposalData.isProposalOnDashboard = false;
    this.proposalData.editIcon = true;
    this.getProposalListbyCustomer();
  }

  onSelectAccountHealth(tab) {
    this.selectedTab = tab;
    this.searchText = '';
    this.placeholder = '';
    this.showQualList = false;
    this.showProposalList = false;
    this.showAggrementList = false;
    this.qualData.isToggleVisible = false;
    this.qualData.editIcon = false;
    this.proposalData.isToggleVisible = false;
    this.proposalData.editIcon = false;
    // Dashboard and account health has same view like dashboard
    this.proposalData.isProposalOnDashboard = true;
    this.qualData.isProposalOnDashboard = true;
    // get accounthealth

  }

  onSelectAgreement(tab) {
    this.selectedTab = tab;
    this.searchText = '';
    this.placeholder = 'Search By All Agreements';
    this.showQualList = false;
    this.showProposalList = false;
    // this.getSmartAccountList();
  }

  getSmartAccountList() {
    this.smartAccountSub = this.allArchitectureViewService.getSmartAccountList()
      .subscribe((response: any) => {
        try {
          if (response && !response.error) {
            if (response.data) {
              this.smartAccountList = response.data;
              this.appDataService.smartAccountData = response.data;
            } else {
              this.smartAccountList = [];
              this.appDataService.smartAccountData = [];
            }
            this.qualService.displaySmartAccountInHeader = true;
            let isLinkedAccoutnPresent = false;
            for (let i = 0; i < this.appDataService.smartAccountData.length; i++) {
              const smartAccount: any = this.appDataService.smartAccountData[i];
              if (smartAccount.active) {
                this.appDataService.linkedSmartAccountObj.name = smartAccount.smartAccountName;
                this.appDataService.linkedSmartAccountObj.id = smartAccount.smartAccountId;
                this.allArchitectureViewService.smartAccountId = smartAccount.smartAccountId;
                this.getAgreementsData(smartAccount.smartAccountId);
                isLinkedAccoutnPresent = true;
                break;
              }
            }

            if (!isLinkedAccoutnPresent) {
              this.appDataService.linkedSmartAccountObj = { name: 'Not Assigned', id: '' };
            }

          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      });
  }

  changeLindSmartAccount(smartAccountobj) {
    this.changeSmartAccountLinkSub = this.appDataService.changeSmartAccountLink(smartAccountobj).subscribe((response: any) => {
      try {
        if (response && response.data && !response.error) {
          console.log('testing');
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      } catch (error) {
        this.messageService.displayUiTechnicalError(error);
      }
    });
  }

  getAgreementsData(smartAccountId) {
    this.agreementSub = this.allArchitectureViewService.getAgreementsData(smartAccountId).subscribe((response: any) => {
      this.showAggrementList = true;  
      try {
        if (response && response.data && !response.error) {
          this.activeAgreementData = response;
          this.allArchitectureViewService.activeAgreementData = response;
          if (response.data.accounts && response.data.accounts.length > 0) {
            this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = response.data.accounts.length;
            this.subHeaderData.subHeaderVal[0].numberOfAgreements = response.data.accounts.length;  
            this.appDataService.agreementCntEmitter.emit(this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements);  
          } else {
            if (this.appDataService.subHeaderData && this.appDataService.subHeaderData.subHeaderVal) {
              this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = 0;
            }
          }

        } else {
          this.messageService.displayMessagesFromResponse(response);
          if (this.appDataService.subHeaderData && this.appDataService.subHeaderData.subHeaderVal) {
            this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = 0;
          }
        }
      } catch (error) {
        this.messageService.displayUiTechnicalError(error);
        if (this.appDataService.subHeaderData && this.appDataService.subHeaderData.subHeaderVal) {
          this.appDataService.subHeaderData.subHeaderVal[0].numberOfAgreements = 0;
        }
      }
    });
  }


  getProposalListbyCustomer() {
    this.appDataService.isQualOrPropListFrom360Page = false;
    this.proposalSub = this.allArchitectureViewService.getProposalListbyCustomer().subscribe(
      (response: any) => {
        this.showProposalList = true;
        if (!response.error) {
          if (response.data) {
            this.proposalData.data = response.data;
          }
        } else {
          // this.isDisableCreate = true;
          this.messageService.displayMessagesFromResponse(response);
        }
      },
      (error) => {
        this.messageService.displayUiTechnicalError(error);
      }
    );
  }

  createNewQual() {
    this.appDataService.createQualfrom360 = true;
    this.router.navigate(['/qualifications',
      {
        architecture: this.architecture,
        customername: encodeURIComponent(this.appDataService.customerName),
        customerId: this.appDataService.customerID
      }
    ]);
  }

  getSubHeaderData() {
    this.allArchitectureViewService.getSubHeaderData()
      .subscribe((response: any) => {
        if (!response.error) {
          if (response.data) {
            this.subHeaderData.subHeaderVal[0].numberOfQualifications = response.data.numberOfQualifications;
            this.subHeaderData.subHeaderVal[0].numberOfProposals = response.data.numberOfProposals;
            this.subHeaderData.subHeaderVal[0].ldosPercentage = response.data.ldosPercentage;
            this.subHeaderData.subHeaderVal[0].serviceCoveragePercentage = response.data.serviceCoveragePercentage;
            this.appDataService.subHeaderData = this.subHeaderData;
            this.appDataService.isGroupSelected = false;
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      },
        (error) => {
          this.messageService.displayUiTechnicalError(error);
        });
  }

  ngOnDestroy() {
    this.appDataService.insideAllArchView = false;
    this.appDataService.isQualOrPropListFrom360Page = false; // set this to false if coming out of 360 page
    if(!this.appDataService.createQualfrom360){
      this.appDataService.smartAccountData = null;
      this.appDataService.linkedSmartAccountObj = { name: 'Not Assigned', id: '' };
      this.qualService.displaySmartAccountInHeader = false;
    }
    this.allArchitectureViewService.smartAccountId = '';
    this.allArchitectureViewService.activeAgreementData = '';
    if (this.agreementEmitter) {
      this.agreementEmitter.unsubscribe();
    }
    if (this.deleteAgreementEmitter) {
      this.deleteAgreementEmitter.unsubscribe();
    }
    if (this.proposalSub) {
      this.proposalSub.unsubscribe();
    }
    if (this.qualSub) {
      this.qualSub.unsubscribe();
    }
    if (this.agreementSub) {
      this.agreementSub.unsubscribe();
    }
    if (this.smartAccountSub) {
      this.smartAccountSub.unsubscribe();
    }
    if (this.changeSmartAccountLinkSub) {
      this.changeSmartAccountLinkSub.unsubscribe();
    }
    if (this.userInfoSub) {
      this.userInfoSub.unsubscribe();
    }
    if (this.subscribers.qualListUpdated) {
      this.subscribers.qualListUpdated.unsubscribe();
    }
  }

  onSelectCompliance(tab) {
    this.selectedTab = tab;
  }
}


export interface SubHeaderData {
  moduleName: string;
  custName: string;
  favFlag?: boolean;
  subHeaderVal: Array<any>;
  editIcon?: boolean;
}
