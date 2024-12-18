import { UtilitiesService } from '@app/shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AllArchitectureViewService } from '@app/all-architecture-view/all-architecture-view.service';
import { AccountHealthInsighService } from './account.health.insight.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { Component, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { QualProposalListObj } from '../services/constants.service';
import { LocaleService } from '../services/locale.service';
import { ListProposalService } from '@app/proposal/list-proposal/list-proposal.service';
import { PartnerBookingsService } from '../partner-bookings/partner-bookings.service';
import { CountriesPresentService } from '../countries-present/countries-present.service';
import { Router } from '@angular/router';
import { MessageType } from '../services/message';
import { BlockUiService } from '../services/block.ui.service';

@Component({
  selector: 'app-account-health-insight',
  templateUrl: './account-health-insight.component.html',
  styleUrls: ['./account-health-insight.component.scss']
})
export class AccountHealthInsightComponent implements OnInit, OnDestroy {
  qualData: QualProposalListObj;
  proposalData: QualProposalListObj;
  showQualList = false;
  showProposalList = false;
  selectedArchiteture: string;
  selectedArchDisplayName: string;
  hidePageDetails = true;
  accHealthData: any;
  accountInsighrArr = [{ 'viewBy': 'All Architectures', 'active': true, 'displayName': 'All Architectures' },
  { 'viewBy': 'C1_DNA', 'active': false, 'displayName': 'Cisco DNA' },
  { 'viewBy': 'C1_DC', 'active': false, 'displayName': 'Cisco Data Center' },
  { 'viewBy': 'SEC', 'active': false, 'displayName': 'Cisco Security Choice' }];
  architectureData: any;
  ibSummaryView: boolean;
  selectedNav: string;
  selectedCustomerDetails = { customerName: '', customerId: '' };
  suitesArray: any;
  displayGridView = false;
  start = 0;
  start_max = 0;
  data_new = [];
  show = 6;
  renewalData = [];
  penetrationPercent = 0.0; // flag for getting penetration percent is as per architecture.
  totalContractValue: any = '0.0'; // flag for getting total contract value is different for different arch.
  penetrationArchitecture = '';
  renewalEaView = false;
  currentQuarter = null;
  EA_SUPPORTED_PRODUCTS = 'SUPPORTED_PRODUCTS';
  constructor(public qualService: QualificationsService, private messageService: MessageService, public appDataService: AppDataService,
    public localeService: LocaleService, public accountHealthInsighService: AccountHealthInsighService,
    public allArchitectureViewService: AllArchitectureViewService, public partnerBookingService: PartnerBookingsService,
    private router: Router, public renderer: Renderer2, public el: ElementRef, private utilitiesService: UtilitiesService,
    private blockUiService: BlockUiService, public countriesPresentService: CountriesPresentService) { }

  ngOnInit() {
    this.accountHealthInsighService.showSuitesFlyout = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.accountHealth;
    this.appDataService.isQualOrPropListFrom360Page = true;
    this.blockUiService.spinnerConfig.startChain();
    this.getQualList();
    this.getProposalListbyCustomer();
    this.selectedArchiteture = 'All Architectures';
    this.selectedArchDisplayName = 'All Architectures';
    this.selectedCustomerDetails.customerName = this.appDataService.customerName;
    this.selectedCustomerDetails.customerId = this.appDataService.customerID;
    this.getAccountHealthData(null);
    this.getRenewaldata();
    this.qualData = { data: [] };
    this.proposalData = { data: [] };
    this.qualData.isCreatedByMe = true;
    this.proposalData.isCreatedByMe = true;
    // dashboard and Account health has same view
    this.qualData.isProposalOnDashboard = true;
    this.proposalData.isProposalOnDashboard = true;
    this.architectureData = [
      {
        'name': 'Total Assets',
        'value': '0',
        'class': 'icon-total-assets',
        'id': 'numberOfAssets'
      },
      {
        'name': 'Install Sites',
        'value': '0',
        'class': 'icon-installed-sites',
        'id': 'numberOfInstallSites'
      },
      {
        'name': 'Contracts',
        'value': '0',
        'class': 'icon-contracts',
        'id': 'numberOfContracts'
      },
      {
        'name': this.localeService.getLocalizedString('common.COUNTRY_REGION_PRESENT'),
        'value': '0',
        'class': 'icon-countries-present',
        'id': 'numberOfCountries'
      },
      {
        'name': 'Sales Orders',
        'value': '0',
        'class': 'icon-sales-orders',
        'id': 'numberOfSalesOrders'
      },
      {
        'name': 'Partners',
        'value': '0',
        'class': 'icon-partner',
        'id': 'numberOfPartners'
      },
      {
        'name': 'Subscriptions',
        'value': '0',
        'class': 'icon-subscription',
        'id': 'numberOfSubscriptions'
      }
    ];
    this.getArchitectureData();
    // if archMetaData is not loaded this will load the archMetaData for further use.
    this.appDataService.getDetailsMetaData('PROSPECT_SUBSIDARY');
    setTimeout(() => {
      this.appDataService.custNameEmitter.emit({
        context: AppDataService.PAGE_CONTEXT.accountHealth,
        text: (this.appDataService.customerName).toUpperCase()
      });
    }, 100);
  }

  ngOnDestroy(){
    this.appDataService.isQualOrPropListFrom360Page = false;// set to false 
  }
  openIbSummaryFlyout(name) {
    if (name === 'Total Assets') {
    } else if (name === 'Install Sites') {
    } else if (name === 'Contracts') {
    } else if (name === 'Sales Orders') {
    }
  }

  toggleView() { }


  getRenewaldata() {
    this.renewalData = [];
    let viewType = this.EA_SUPPORTED_PRODUCTS;
    this.currentQuarter = null;
    if (this.renewalEaView) {
      viewType = 'ALL';
    }
    this.accountHealthInsighService.getRenewaldata(this.selectedArchiteture, viewType).subscribe((res: any) => {
      const responseObject = this.appDataService.validateResponse(res);
      if (responseObject) {
        responseObject.forEach(value => {
          if (value.currentQuarter) {
            this.currentQuarter = value;
          }
          const element = {
            'name': value.quarterName,
            'value': value.renewalAmount,
            'currentQuarter': value.currentQuarter
          };
          this.renewalData.push(element);
        });

        this.currentQuarter.renewalAmount = this.appDataService.prettifyNumber(this.currentQuarter.renewalAmount);
        this.accountHealthInsighService.loadRenewalData.emit(this.renewalData);
      }
    });
  }

  getQualList() {
    this.qualService.listQualification().subscribe((response: any) => {
      if (response) {

        this.showQualList = true;
        if (response.messages && response.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
          try {
            if (response.data == null) {
              return;
            }
            if (response.data.length > 0) {

              if (response.data.length > 3) {
                response.data.length = 3;
              }
              this.qualData.data = response.data;
              this.qualService.qualListData = response;
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      }
    });
  }


  getProposalListbyCustomer() {
    this.allArchitectureViewService.getProposalListbyCustomer().subscribe(
      (response: any) => {

        this.showProposalList = true;
        const responseObject = this.appDataService.validateResponse(response);

        if (responseObject) {
          if (responseObject.length > 3) {
            responseObject.length = 3;
          }
          this.proposalData.data = responseObject;
        }

        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
    );
  }

  goToProposalList() {
    this.allArchitectureViewService.viewTabEmitter.emit('proposals');
  }

  goToOrder() {
    this.allArchitectureViewService.viewTabEmitter.emit('compliance');
  }

  goToAgreementList() {
    this.allArchitectureViewService.viewTabEmitter.emit('agreements');
  }

  goToQualification() {
    this.allArchitectureViewService.viewTabEmitter.emit('qualifications');
  }

  selectInsightView(val) {
    for (let i = 0; i < this.accountInsighrArr.length; i++) {
      if (val.viewBy === this.accountInsighrArr[i].viewBy) {
        this.accountInsighrArr[i].active = true;
        this.selectedArchiteture = val.viewBy;
        this.appDataService.archName = this.selectedArchiteture;
        if (this.appDataService.archName === 'All Architectures') {
          this.appDataService.archName = 'ALL';
        }
        this.selectedArchDisplayName = val.displayName;
        this.renewalEaView = false;
        if (val.viewBy !== 'SEC') {
          this.penetrationArchitecture = val.displayName;
        } else {
          this.penetrationArchitecture = 'Subscription';
        }
        this.getAccountHealthData(val.viewBy);
        this.getRenewaldata();
      } else {
        this.accountInsighrArr[i].active = false;
      }
    }
    if (val.viewBy === 'All Architectures') {
      this.moveLeft();
      this.moveLeft();

    }
    this.accountHealthInsighService.reloadPartnerEmitter.emit();
  }


  getAccountHealthData(archName) {
    this.blockUiService.spinnerConfig.blockUI();
    this.accountHealthInsighService.getAccountHealthData(archName).subscribe((response: any) => {

      const responseObject = this.appDataService.validateResponse(response);

      if (responseObject) {
        this.hidePageDetails = false;
        this.accHealthData = responseObject;
        if (archName === null) {
          archName = 'All Architectures';
        } else {
          this.prepareArchitectureData(archName);
        }
        this.getArchitectureInfoArray(archName);
        for (let i = 0; i < this.architectureData.length; i++) {
          this.architectureData[i].value = this.utilitiesService.pretifyAndFormatNumber(this.accHealthData[this.architectureData[i].id]);
        }
      } else {
        this.hidePageDetails = true;
        this.messageService.displayMessages(this.appDataService.setMessageObject('No Data Found', MessageType.Info));
      }
    });
  }
  getTooltip(element) {
    let value = '';
    for (let i = 0; i < this.accHealthData.toolTipMsg.length; i++) {
      if (this.appDataService.archName === 'ALL') {
        if (this.accHealthData.toolTipMsg[i].name === 'ldosCoverage') {
          this.appDataService.ldosCoverageTooltip = this.accHealthData.toolTipMsg[i].value;
        }

        if (this.accHealthData.toolTipMsg[i].name === 'serviceCoverage') {
          this.appDataService.serviceCoverageTooltip = this.accHealthData.toolTipMsg[i].value;
        }
        if (this.accHealthData.toolTipMsg[i].name === element) {
          value = this.accHealthData.toolTipMsg[i].value;
          if (this.appDataService.serviceCoverageTooltip && this.appDataService.ldosCoverageTooltip) {
            break;
          }
        }
      } else if (this.appDataService.archName === 'C1_DNA' && this.accHealthData.toolTipMsg[i].name === element) {
        value = this.accHealthData.toolTipMsg[i].value;
        break;
      } else if (this.appDataService.archName === 'C1_DC' && this.accHealthData.toolTipMsg[i].name === element) {
        value = this.accHealthData.toolTipMsg[i].value;
        break;
      } else if (this.appDataService.archName === 'SEC' && this.accHealthData.toolTipMsg[i].name === element) {
        value = this.accHealthData.toolTipMsg[i].value;
        break;
      }
    }
    return value;
  }
  getSuite(suiteName) {
    const dna1: SuiteDetail = { 'suiteName': 'Cisco DNA for Switching', 'isGreenField': false };
    dna1.suiteName = suiteName;
    return dna1;
  }

  private prepareArchitectureData(archName) {
    this.suitesArray = new Array<SuiteDetail>();
    if (archName === 'C1_DNA') {
      this.penetrationPercent = this.accHealthData.dnaPenetrationPercentage;
      this.totalContractValue = this.appDataService.prettifyNumber(this.accHealthData.tcvDna);
      const dna1 = this.getSuite('Cisco DNA for Switching');
      dna1.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvAccessSwitchingDna);
      if (this.accHealthData.tcvAccessSwitchingDna <= 0) {
        dna1.isGreenField = true;
      }
      this.suitesArray.push(dna1);
      const dna2 = this.getSuite('Cisco DNA for Wireless');
      dna2.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvAccessWirelessDna);
      if (this.accHealthData.tcvAccessWirelessDna <= 0) {
        dna2.isGreenField = true;
      }
      this.suitesArray.push(dna2);
      const dna3 = this.getSuite('Cisco DNA for Routing');
      dna3.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvRoutingDna);
      if (this.accHealthData.tcvRoutingDna <= 0) {
        dna3.isGreenField = true;
      }
      this.suitesArray.push(dna3);

    } else if (archName === 'C1_DC') {
      this.penetrationPercent = this.accHealthData.dcPenetrationPercentage;
      this.totalContractValue = this.appDataService.prettifyNumber(this.accHealthData.tcvDc);

      const dna1 = this.getSuite('Cisco DC Data Center Networking');
      dna1.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvAciDc);
      if (this.accHealthData.tcvAciDc <= 0) {
        dna1.isGreenField = true;
      }
      this.suitesArray.push(dna1);
      const dna2 = this.getSuite('Cisco DC Intersight');
      dna2.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvHyperflex);
      if (this.accHealthData.tcvHyperflex <= 0) {
        dna2.isGreenField = true;
      }
      this.suitesArray.push(dna2);
      const dna3 = this.getSuite('Cisco DC Hyperflex');
      dna3.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvRoutingDna);
      if (this.accHealthData.tcvRoutingDna <= 0) {
        dna3.isGreenField = true;
      }
      this.suitesArray.push(dna3);
    } else if (archName === 'SEC') {
      this.penetrationPercent = this.accHealthData.subscriptionPenetrationPercentage;
      this.totalContractValue = this.appDataService.prettifyNumber(this.accHealthData.tcvSec);

      const obj1 = this.getSuite('EMAIL SECURITY');
      obj1.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvEmailSecurity);
      if (this.accHealthData.tcvEmailSecurity <= 0) {
        obj1.isGreenField = true;
      }
      this.suitesArray.push(obj1);

      const obj2 = this.getSuite('WEB SECURITY');
      obj2.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvWebSecurity);
      if (this.accHealthData.tcvWebSecurity <= 0) {
        obj2.isGreenField = true;
      }
      this.suitesArray.push(obj2);
      const obj3 = this.getSuite('CLOUDLOCK');
      obj3.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvCloudlock);
      if (this.accHealthData.tcvCloudlock <= 0) {
        obj3.isGreenField = true;
      }
      this.suitesArray.push(obj3);


      const obj4 = this.getSuite('ISE');
      obj4.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvIse);
      if (this.accHealthData.tcvIse <= 0) {
        obj4.isGreenField = true;
      }
      this.suitesArray.push(obj4);
      const obj5 = this.getSuite('NGFW SECURITY');
      obj5.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvNgfw);
      if (this.accHealthData.tcvNgfw <= 0) {
        obj5.isGreenField = true;
      }
      this.suitesArray.push(obj5);
      const obj6 = this.getSuite('AMP FOR ENDPOINTS');
      obj6.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvAmpForEndpoints);
      if (this.accHealthData.tcvAmpForEndpoints <= 0) {
        obj6.isGreenField = true;
      }
      this.suitesArray.push(obj6);


      const dna1 = this.getSuite('STEALTHWATCH');
      dna1.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvStealthwatch);
      if (this.accHealthData.tcvStealthwatch <= 0) {
        dna1.isGreenField = true;
      }
      this.suitesArray.push(dna1);
      const dna2 = this.getSuite('UMBRELLA');
      dna2.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvUmbrella);
      if (this.accHealthData.tcvUmbrella <= 0) {
        dna2.isGreenField = true;
      }
      this.suitesArray.push(dna2);
      const dna3 = this.getSuite('SECURITY TETRATION');
      dna3.amount = this.appDataService.prettifyNumber(this.accHealthData.tcvTetration);
      if (this.accHealthData.tcvTetration <= 0) {
        dna3.isGreenField = true;
      }
      this.suitesArray.push(dna3);
    }
  }

  createNewQualification() {
    this.appDataService.createQualfrom360 = true;
    this.router.navigate(['/qualifications',
      {
        architecture: this.selectedArchiteture,
        customername: encodeURIComponent(this.appDataService.customerName),
        customerId: this.appDataService.customerID
      }
    ]);
  }

  getArchitectureInfoArray(viewBy) {

    if (viewBy === 'All Architectures') {
      this.architectureData = [
        {
          'name': 'Total Assets',
          'value': '56K',
          'class': 'icon-total-assets',
          'id': 'numberOfAssets'
        },
        {
          'name': 'Install Sites',
          'value': '221',
          'class': 'icon-installed-sites',
          'id': 'numberOfInstallSites'
        },
        {
          'name': 'Contracts',
          'value': '247',
          'class': 'icon-contracts',
          'id': 'numberOfContracts'
        },
        {
          'name': this.localeService.getLocalizedString('common.COUNTRY_REGION_PRESENT'),
          'value': '17',
          'class': 'icon-countries-present',
          'id': 'numberOfCountries'
        },
        {
          'name': 'Sales Orders',
          'value': '53',
          'class': 'icon-sales-orders',
          'id': 'numberOfSalesOrders'
        },
        {
          'name': 'Partners',
          'value': '12',
          'class': 'icon-partner',
          'id': 'numberOfPartners'
        },
        {
          'name': 'Subscriptions',
          'value': '12',
          'class': 'icon-subscription',
          'id': 'numberOfSubscriptions'
        }
      ];
    } else {
      this.architectureData = [
        {
          'name': 'Total Assets',
          'value': '56K',
          'class': 'icon-total-assets',
          'id': 'numberOfAssets'
        },
        {
          'name': 'Install Sites',
          'value': '221',
          'class': 'icon-installed-sites',
          'id': 'numberOfInstallSites'
        },
        {
          'name': 'Contracts',
          'value': '247',
          'class': 'icon-contracts',
          'id': 'numberOfContracts'
        },
        {
          'name': this.localeService.getLocalizedString('common.COUNTRY_REGION_PRESENT'),
          'value': '17',
          'class': 'icon-countries-present',
          'id': 'numberOfCountries'
        },
        {
          'name': 'Sales Orders',
          'value': '53',
          'class': 'icon-sales-orders',
          'id': 'numberOfSalesOrders'
        },
        {
          'name': 'Partners',
          'value': '12',
          'class': 'icon-partner',
          'id': 'numberOfPartners'
        },
        {
          'name': 'Subscriptions',
          'value': '12',
          'class': 'icon-subscription',
          'id': 'numberOfSubscriptions'
        },
        {
          'name': 'Geography (Theaters)',
          'value': '4',
          'class': 'icon-geaography',
          'id': 'numberOfTheaters'
        },
        {
          'name': 'Subsidiaries',
          'value': '108',
          'class': 'icon-Subsidiaries',
          'id': 'numberOfSubsidiaries'
        }
      ];
      if (viewBy === 'SEC') {
        this.architectureData.splice(1, 1);
        this.architectureData.splice(5, 1);
      }
    }
    this.getArchitectureData();
  }

  viewTileDetails(tile) {
    if (this.selectedArchiteture === 'All Architectures') {
      this.appDataService.archName = 'ALL';
    } else {
      this.appDataService.archName = this.selectedArchiteture;
    }
    if (tile === 'Total Assets') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = true;
      this.selectedNav = 'serialNumber';
    } else if (tile === 'Subsidiaries') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = false;
      this.selectedNav = 'subsidiary';
    } else if (tile === 'Geography (Theaters)') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = false;
      this.selectedNav = 'geography';
    } else if (tile === 'Sales Orders') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = true;
      this.selectedNav = 'salesOrders';
    } else if (tile === 'Contracts') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = true;
      this.selectedNav = 'contractNumbers';
    } else if (tile === 'Install Sites') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = true;
      this.selectedNav = 'installSites';
    } else if (tile === 'Country/Region Present') {
      this.countriesPresentService.showCountriesPresent = true;
    } else if (tile === 'Partners') {
      this.partnerBookingService.showPartnerBooking = true;
    }
    else if (tile === 'Subscriptions') {
      this.accountHealthInsighService.showIbSummaryFlyout = true;
      this.ibSummaryView = true;
      this.selectedNav = 'subscription';
    } 
    this.renderer.addClass(document.body, 'position-fixed');
  }

  displaySuitesDetails() {
    this.accountHealthInsighService.showSuitesFlyout = !this.accountHealthInsighService.showSuitesFlyout;
    this.renderer.addClass(document.body, 'position-fixed');
  }

  private getSuitesByArchitecture() {
    const suiteMappingObj = new Object();
    if (this.selectedArchiteture === 'C1_DNA') {

    } else if (this.selectedArchiteture === 'C1_DC') {

      suiteMappingObj['tcvAccessWirelessDna'] = 'Cisco DC Workload Optimization';
      suiteMappingObj['tcvRoutingDna'] = 'Cisco DC Container Platform';
    } else if (this.selectedArchiteture === 'SEC') {

    }
  }

  moveRight() {
    if (this.start === this.start_max) {
      return;
    }
    this.start++;
    const element = this.el.nativeElement.querySelector('.architecture-row');
    // this.renderer.setStyle(element, 'transform', 'translateX(-16.05%)');
    if (this.start === 1) {
      this.renderer.setStyle(element, 'transform', 'translateX(-16.67%)');
    } else if (this.start === 2) {
      this.renderer.setStyle(element, 'transform', 'translateX(-33.34%)');
    } else if (this.start === 3) {
      this.renderer.setStyle(element, 'transform', 'translateX(-50.01%)');
    }
    // this.data_new = this.architectureData.slice(this.start, this.show + this.start);
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    const element = this.el.nativeElement.querySelector('.architecture-row');
    if (this.start === 2) {
      this.renderer.setStyle(element, 'transform', 'translateX(-33.34%)');
    } else if (this.start === 1) {
      this.renderer.setStyle(element, 'transform', 'translateX(-16.67%)');
    } else if (this.start === 0) {
      this.renderer.setStyle(element, 'transform', 'translateX(0%)');
    }
    // this.data_new = this.architectureData.slice(this.start, this.show + this.start);
  }

  getArchitectureData() {
    this.show = this.show < this.architectureData.length ? this.show : this.architectureData.length;
    this.start_max = this.architectureData.length - this.show;
    this.data_new = this.architectureData.slice(this.start, this.show + this.start);
  }

  globalSwitchChange(checked) {
    this.renewalEaView = checked;
    this.getRenewaldata();
  }

}

interface SuiteDetail {
  suiteName: string;
  amount?: string | number;
  isGreenField?: boolean;
}

