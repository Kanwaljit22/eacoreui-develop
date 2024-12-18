import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BomService } from '../bom/bom.service';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CreateProposalService } from '../create-proposal/create-proposal.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualificationsService } from '../../qualifications/qualifications.service';
import { ListProposalService } from '../list-proposal/list-proposal.service';
import { MessageService } from '../../shared/services/message.service';
import { MessageType } from '../../shared/services/message';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { Subscription } from 'rxjs';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalToQuoteComponent } from '@app/modal/proposal-to-quote/proposal-to-quote.component';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { ProposalSummaryService } from '../edit-proposal/proposal-summary/proposal-summary.service';
import { PurchaseOptionsComponent } from '../../modal/purchase-options/purchase-options.component';
import { SubscriptionAccessComponent } from '@app/modal/subscription-access/subscription-access.component';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent implements OnInit, OnDestroy {

  data = {
    'editIcon': false,
    'changeTermName': false
  };
  private gridApi;
  private gridColumnApi;
  public columnDefs;
  public rowData;
  public gridOptions: GridOptions;
  public createQualification = false;
  json: any = {};
  bomData: any = [];
  public isDisabled = '';
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  subscription: Subscription;
  isHeaderLoaded = false;
  arrayArchitecture = [];
  selectedArch: any;
  partnerLedFlow = false;
  isChangeSubFlow = false;
  isPartnerPurchaseAuthorized = true;
  // Error message
  showErrorMessage = false;
  Errormessages = [];

  arrAllBomData: any = [];
  arrDNA: any = [];
  arrDataCenter: any = [];
  arrSecurity: any = [];
  arrServices: any = [];
  showDownloadBom = false; // to show/hide download bom button

  allowConvertToQuote = false;
  invalidPartner = false;
  isCotermPresent = false;
  includedPartialIbSubscription: Subscription
  convertToQuote  = false;
  is2tPartner = false;
  cxSwProposalsLinkedData = [];
  isLinkedCxInProgress = false;
  displayAuthorizationError = false;
 
  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService, @Inject(DOCUMENT) private document: any, private getBomServiceData: BomService, private router: Router, private route: ActivatedRoute, public qualService: QualificationsService, public messageService: MessageService,
    private utiliteService: UtilitiesService, public createProposalService: CreateProposalService, public appDataService: AppDataService,
    public listProposalService: ListProposalService, 
    private modalVar: NgbModal, public proposalDataService: ProposalDataService, private http: HttpClient,
    public constantsService: ConstantsService, public blockUiService: BlockUiService, private permissionService: PermissionService,
    public proposalSummaryService: ProposalSummaryService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 42;
    this.gridOptions.suppressContextMenu = true;
  }

  ngOnInit() {
    if (this.router.url.includes('/group')) {
      this.appDataService.isGroupSelected = true;
      this.selectedArch = 'All';
    } else {
      this.appDataService.isGroupSelected = false;
      this.selectedArch = this.proposalDataService.proposalDataObject.proposalData.architecture;
    }
    this.qualService.disabledContinueButton = false;
    this.appDataService.showActivityLogIcon(true);
    this.appDataService.isProposalIconEditable = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.previewQuote;
    this.blockUiService.spinnerConfig.startChain();
    if (!this.proposalDataService.proposalDataObject.proposalId) {
      const sessionObject: SessionData = this.appDataService.getSessionObject();

      if (!sessionObject) {

        this.route.paramMap.subscribe(params => {
          if (params.keys.length > 0) {
            let proposalId = params.get('proposalId');
            if (proposalId !== undefined && proposalId.length > 0) {
              this.proposalDataService.proposalDataObject.proposalId = parseInt(proposalId);
            }
          }
        });

        // Redirect to proposal summary incase of new tab 
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
        return; // Return so that next code will not be executed incase of navigate
      }
      // get the rosuperuser from session data and store in appDataService
      this.appDataService.userInfo.roSuperUser = sessionObject.userInfo.roSuperUser;
      this.appDataService.userInfo.rwSuperUser = sessionObject.userInfo.rwSuperUser;
      this.qualService.qualification = sessionObject.qualificationData ;
      this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;
      this.constantsService.CURRENCY = sessionObject.currency;
      // set the qualID from session obj
      this.qualService.qualification.qualID = sessionObject.qualificationData.qualID ?
      sessionObject.qualificationData.qualID : sessionObject.qualificationData.id;

    }

    this.appDataService.custNameEmitter.emit({ 'text': this.proposalDataService.proposalDataObject.proposalData.name,
    qualName: this.qualService.qualification.name.toUpperCase(), qualId: this.qualService.qualification.qualID,
    proposalId: this.proposalDataService.proposalDataObject.proposalId, 'context': AppDataService.PAGE_CONTEXT.previewQuote });

    // Only show bom when status complete and user has read write access or RO/RW Super User
    //  if(!((this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE) && (this.appDataService.isReadWriteAccess || this.appDataService.userInfo.roSuperUser ))) {
    //     this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
    //     return; // Return so that next code will not be executed incase of navigate
    //   }
    // assigning partner led flow to local variable 
    this.partnerLedFlow = this.createProposalService.isPartnerDeal;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    // check from session as well while reloadinng and set the parner flow flag
    if (sessionObject) {
      this.appDataService.isPatnerLedFlow = sessionObject.isPatnerLedFlow;
      // this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
      // check if subrefId is empty and subscription data is present in session -- set the data and changeSubFlow
      if (!this.qualService.subRefID && sessionObject.qualificationData && sessionObject.qualificationData.subscription && sessionObject.qualificationData.subscription.subRefId) {
        this.qualService.qualification.subscription = sessionObject.qualificationData.subscription;
        this.qualService.subRefID = sessionObject.qualificationData.subscription.subRefId;
        this.isChangeSubFlow = true;
      }
    }
    // if (this.partnerLedFlow && !this.appDataService.isPurchaseOptionsLoaded) {
    //   this.proposalSummaryService.getPurchaseOptionsData();
    // }
    this.columnDefs = [
      {
        'headerName': 'Part Number',
        'field': 'partNumber',
        'width': 270,
        'suppressMenu': true,
        'cellRenderer': 'group',
        'showRowGroup': true,
        'cellClass': 'expandable-header',
        'cellRendererParams': {
          innerRenderer: this.partNumberRenderer
        }
      },
      {
        'headerName': 'Quantity',
        'field': 'quantity',
        'width': 90,
        'headerClass': 'text-center',
        'cellClass': 'dollar-align',
        'suppressMenu': true
      }, {
        'headerName': 'Duration (Months)',
        'field': 'initialTerm', // added initial term to duration also
        'width': 90,
        'cellClass': 'text-right',
        'suppressMenu': true
        // this column will not have any value and will be blank acc. to US292847
      },
      {
        'headerName': 'Initial Term (Months)',
        'field': 'initialTerm',
        'width': 100,
        'cellClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Auto Renewal Term (Months)',
        'field': 'autoRenewalTerm',
        'width': 120,
        'cellClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Billing Model',
        'field': 'billingModel',
        'width': 110,
        'suppressMenu': true
      },
      {
        'headerName': 'Requested Start Date',
        'field': 'requestedStartDate',
        'width': 110,
        'suppressMenu': true
      },
      {
        'headerName': 'List Price',
        'field': 'listPrice',
        'width': 110,
        'cellClass': 'dollar-align',
        'suppressMenu': true,
        // 'cellRenderer' : 'currencyFormat'
      },
      {
        'headerName': 'Discount (%)',
        'field': 'discount',
        'width': 110,
        'cellClass': 'dollar-align',
        'suppressMenu': true
      },
      {
        'headerName': 'Multi-Suite Discount (%)',
        'field': 'multisuiteDiscount',
        'width': 140,
        'suppressMenu': true,
        'cellClass': 'dollar-align'
        //this column will not have any value and will be blank acc. to US292847
      },
      {
        'headerName': 'One Time Discount',
        'field': 'purchaseAdjustments',
        'width': 110,
        'cellClass': 'dollar-align',
        'suppressMenu': true,
        // 'cellRenderer' : 'currencyFormat'
      }
    ];

    const thisInstance = this;
    this.columnDefs.forEach(element => {
      // console.log(element);
      if (element.field === 'purchaseAdjustments' || element.field === 'listPrice' ||
        element.field === 'qty') {
        element.cellRenderer = 'currencyFormat';
        element.cellClass = 'dollar-align';
        element.cellRenderer = function (params) {
          if(element.field === 'listPrice' && thisInstance.appDataService.isTwoTierUser(thisInstance.qualService.buyMethodDisti)){ // if 2tPartner hide the list price
            return '--'
          }
          return thisInstance.currencyFormat(params, thisInstance);
        };
      }

      if (element.field === 'discount') {
        element.cellRenderer = 'currencyFormat';
        element.cellClass = 'dollar-align';
        element.cellRenderer = function (params) {
          if(thisInstance.appDataService.isTwoTierUser(thisInstance.qualService.buyMethodDisti)){ // if 2tPartner hide the discount
            return '--'
          }
          return thisInstance.currencyFormatForDiscount(params, thisInstance);
        };
      }

    });

    this.json = {
      'data': {
        'id': this.proposalDataService.proposalDataObject.proposalId,
        // 'userId': this.appDataService.userId,
        'qualId': this.qualService.qualification.qualID
      }
    };

    // this.blockUiService.spinnerConfig.startChain();
    this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
    // if (!this.appDataService.isGroupSelected) { // call summary api to get financial sumamry data for single archs only
    //   this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
    // }
    // this.appDataService.subHeaderData.subHeaderVal[4] = 'Validated';
    // form BOM data for ag-grid
    this.subscription = this.appDataService.headerDataLoaded.subscribe(() => {
      if(this.proposalDataService.proposalDataObject.proposalData.coTerm && this.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm){
        this.isCotermPresent = true;
      } else {
        this.isCotermPresent = false;
      }
      // set the flad to hide/show download bom button on permission basis
      this.showDownloadBom = this.permissionService.permissions.has(PermissionEnum.DownloadBom) ? true : false;
      if (this.proposalDataService.proposalDataObject.proposalData.isCrossArchitecture && !this.proposalDataService.proposalDataObject.proposalData.linkId) {
        this.setupBomTab();
      }
      if (this.proposalDataService.proposalDataObject.proposalData.linkId) {
        // this.selectedArch = this.proposalDataService.proposalDataObject.proposalData.architecture;
        this.getCxLinkedProposalListData(this.proposalDataService.proposalDataObject.proposalData.linkId);
      }
      this.isHeaderLoaded = true;
      this.partnerLedFlow = this.createProposalService.isPartnerDeal;
      if (this.partnerLedFlow && !this.appDataService.isPurchaseOptionsLoaded && !this.proposalDataService.cxProposalFlow) {
        this.proposalSummaryService.getPurchaseOptionsData();
      }
      // if cx proposal call to set and show financial summary page
      if (this.proposalDataService.cxProposalFlow){
        this.proposalDataService.getCxFinancialSummaryData();
      } else if (!this.appDataService.isGroupSelected) { //  call summary api to get financial sumamry data for single archs only
        this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
      }
      // Assign the value only if it is a partner deal other wise it is set to True;
      if (this.createProposalService.isPartnerDeal) {
        this.isPartnerPurchaseAuthorized = this.createProposalService.isPartnerPurchaseAuthorized;
      }
      this.is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti); // set 2tpartner
      if(this.is2tPartner && !this.appDataService.isReadWriteAccess){
        this.appDataService.isReadWriteAccess = true;
      }
      this.appDataService.showEngageCPS = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName) ? true : false;
      this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
      // Only get Bom data when proposal is complete and consistent
      if (!(this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch ||
        this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch)) {

        // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.fetchData();

      } else {

        // to unblock UI when we don't call bom api 
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
    });

    this.includedPartialIbSubscription = this.appDataService.includedPartialIbEmitter.subscribe((includedPartialIb) =>{
      this.appDataService.includedPartialIb = includedPartialIb;
    })

    if(this.qualService.qualification.subscription && this.qualService.subRefID) {
      this.qualService.validateChangeSubAccess();
    } else {
      this.convertToQuote = true;
    }

    this.proposalSummaryService.getShowCiscoEaAuth();
    this.proposalDataService.isAnnualBillingMsgRequired();
  }

  architectureSelected(arch) {
    // arch.active = true;
    this.selectedArch = arch;
    let filterByArch = '';
    this.arrayArchitecture.forEach(element => {
      if (arch === element.name) {
        element.active = true;
      } else {
        element.active = false;
      }
    });

    if (arch === this.constantsService.CISCO_SECURITY_CHOICE) {
      this.rowData = this.arrSecurity;
    } else if (arch === this.constantsService.CISCO_DNA) {
      this.rowData = this.arrDNA;
    } else if (arch === this.constantsService.CISCO_DATA_CENTER) {
      this.rowData = this.arrDataCenter;
    } else if (arch === this.constantsService.CISCO_SERVICES_SUPPORT) {
      this.rowData = this.arrServices;
    } else if (arch === this.constantsService.ALL_ARCHITECTURE) {
      this.rowData = this.arrAllBomData;
    }

  }


  setupBomTab() {
    this.arrayArchitecture.push({ name: this.constantsService.ALL_ARCHITECTURE, active: true });
    let isDna = false;
    let isDatacenter = false;
    let isSecurity = false;
    let isServices = false;

    if(this.proposalDataService.proposalDataObject.proposalData.isCrossArchitecture){
      this.appDataService.subHeaderData.subHeaderVal[8].forEach(element => {
        if (element.architecture_code === this.constantsService.DNA) {
          isDna = true;
        } else if (element.architecture_code === this.constantsService.DC) {
          isDatacenter = true;
        } else if (element.architecture_code === this.constantsService.SECURITY) {
          isSecurity = true;
        } else if (element.architecture_code === this.constantsService.CX) {
          isServices = true;
        }
      });
    }
    if (this.proposalDataService.relatedCxProposalId || this.proposalDataService.relatedSoftwareProposalId) {
      this.cxSwProposalsLinkedData.forEach(element => {
        if (element.architecture_code === this.constantsService.DNA) {
          isDna = true;
        } else if (element.architecture_code === this.constantsService.DC) {
          isDatacenter = true;
        } else if (element.architecture_code === this.constantsService.CX) {
          isServices = true;
        }
      });
    }
    if (isDna) {
      this.arrayArchitecture.push({ name: this.constantsService.CISCO_DNA, active: false });
      // check if arch from header is DNA and set as selectedArch
      if (this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.DNA) {
        this.selectedArch = this.constantsService.CISCO_DNA;
      }
    }
    if (isDatacenter) {
      this.arrayArchitecture.push({ name: this.constantsService.CISCO_DATA_CENTER, active: false });
      // check if arch from header is DC and set as selectedArch
      if (this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.DC) {
        this.selectedArch = this.constantsService.CISCO_DATA_CENTER;
      }
    }
    if (isSecurity) {
      this.arrayArchitecture.push({ name: this.constantsService.CISCO_SECURITY_CHOICE, active: false })
      if (this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.SECURITY) {
        this.selectedArch = this.constantsService.CISCO_SECURITY_CHOICE;
      }
    }
    if (isServices) {
      this.arrayArchitecture.push({ name: this.constantsService.CISCO_SERVICES_SUPPORT, active: false });
      // check if arch from header is DNA and set as selectedArch
      if (this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.CX) {
        this.selectedArch = this.constantsService.CISCO_SERVICES_SUPPORT;
      }
    }
  }

  partNumberRenderer(params) {
    return '<span class="index-bom">' + params.data.sequence + '</span>' + params.value;
  }

  fetchData() {
    this.getBomServiceData.getBomGridRowData()
      .subscribe((response: any) => {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        if (response && !response.error && response.data) {
          this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(response.data.buyMethodDisti,response.data.distiInitiated);
          this.qualService.buyMethodDisti = response.data.buyMethodDisti ? true : false;
          if(this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti) && !this.appDataService.isReadWriteAccess){ // check and set access for 2tpartner
            this.appDataService.isReadWriteAccess = true;
          }
          this.allowConvertToQuote = response.data.allowConvertToQuote;
          this.invalidPartner = (response.data.invalidPartner) ? response.data.invalidPartner : false;
          if (!this.allowConvertToQuote) {
            this.messageService.displayMessagesFromResponse(response);
          }

          try {
            if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
              this.isChangeSubFlow = true;
              this.messageService.displayMessages(this.appDataService.setMessageObject(
              this.localeService.getLocalizedMessage('bom.CHANGE_SUBFLOW_ACCESS'), MessageType.Info), true);
           } else {
              this.isChangeSubFlow = false;
           }
             if (response.data.allowedDNAC && !response.data.allowedDNASolnStarter) { // show message only for DNAC
               if(this.isChangeSubFlow){
                 this.messageService.displayMessages(this.appDataService.setMessageObject(
                 this.localeService.getLocalizedMessage('bom.DNA_PROMO_MSG_WITH_SUBFLOW'), MessageType.Warning), true);
                }
               else{
                 this.messageService.displayMessages(this.appDataService.setMessageObject(
                 this.localeService.getLocalizedMessage('bom.DNA_PROMO_MSG'), MessageType.Warning), true);
               }
               this.appDataService.persistErrorOnUi = true;
             } else if (!response.data.allowedDNAC && response.data.allowedDNASolnStarter) { // to show message for DNA Solution Starter
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('bom.DNA_SOLUTION_STARTER_MSG'), MessageType.Warning), true);
              this.appDataService.persistErrorOnUi = true;
             } else if (response.data.allowedDNAC && response.data.allowedDNASolnStarter) { // show message if proposal qualifies for both DNAC and Solution Starter
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('bom.DNA_PROMO_WITH_SOLUTION_STARTER_MSG'), MessageType.Warning), true);
              this.appDataService.persistErrorOnUi = true;
             }
 
             // check and show message for DCN Solution Starter
            if (response.data.allowedAciSolnStarter){
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('bom.DC_SOLUTION_STARTER_MSG'), MessageType.Warning), true);
              this.appDataService.persistErrorOnUi = true;
            }

            // check and show message for DCN free appliance
            if (response.data.allowedDcnFreeAppliance){
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('bom.DC_APPLIANCE_PROMO_MSG'), MessageType.Warning), true);
              this.appDataService.persistErrorOnUi = true;
            }


            this.arrAllBomData = this.manageSingleMLB(response.data.boms);


            if (response.data.archBoms && response.data.archBoms[this.constantsService.DNA]) {
              this.arrDNA = this.manageSingleMLB(response.data.archBoms[this.constantsService.DNA]);
            }

            if (response.data.archBoms && response.data.archBoms[this.constantsService.DC]) {
              this.arrDataCenter = this.manageSingleMLB(response.data.archBoms[this.constantsService.DC]);
            }

            if (response.data.archBoms && response.data.archBoms[this.constantsService.SECURITY]) {
              this.arrSecurity = this.manageSingleMLB(response.data.archBoms[this.constantsService.SECURITY]);
            }
            if (response.data.archBoms && response.data.archBoms[this.constantsService.CX]) {
              this.arrServices = this.manageSingleMLB(response.data.archBoms[this.constantsService.CX]);
            }
            this.rowData = this.arrAllBomData;
            if (this.gridOptions && this.gridOptions.api) {
              this.gridOptions.api.sizeColumnsToFit();
            }
            this.utiliteService.setTableHeight();
            if ((this.appDataService.isGroupSelected === false &&
              this.proposalDataService.proposalDataObject.proposalData.isCrossArchitecture) || this.proposalDataService.proposalDataObject.proposalData.linkId) {
              this.architectureSelected(this.selectedArch);
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
            console.log(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }


  manageMultipleMLB(bomdata) {

    let allData = this.manageSingleMLB(bomdata);
  }


  manageSingleMLB(bomdata) {

    let tempData: any = [];

    bomdata.forEach(element => {

      const record = {};
      record['partNumber'] = element.partNumber;
      record['quantity'] = this.utiliteService.formatWithNoDecimal(element.quantity);
      record['initialTerm'] = element.initialTerm ? this.utiliteService.checkDecimalOrIntegerValue(element.initialTerm): element.initialTerm ;
      record['autoRenewalTerm'] = element.autoRenewalTerm;
      record['billingModel'] = element.billingModel;
      record['requestedStartDate'] = element.requestedStartDate;
      record['listPrice'] = element.listPrice;
      record['discount'] = element.discount;
      record['purchaseAdjustments'] = element.purchaseAdjustments;
      record['sequence'] = element.sequence;
      record['architecture'] = element.architecture;
      record['lineNumber'] = element.lineNumber;
      // record['isFirstLevelParent'] = true;


      record['children'] = new Array<any>();

      if (element.minorLines) {
        element.minorLines.forEach(minorLine => {

          const childRecord1 = {};
          childRecord1['partNumber'] = minorLine.partNumber;
          childRecord1['quantity'] = this.utiliteService.formatWithNoDecimal(minorLine.quantity); // formatter to show comma seperated values for quantity
          childRecord1['initialTerm'] = minorLine.initialTerm ? this.utiliteService.checkDecimalOrIntegerValue(minorLine.initialTerm) : minorLine.initialTerm;
          childRecord1['autoRenewalTerm'] = minorLine.autoRenewalTerm;
          childRecord1['billingModel'] = minorLine.billingModel;
          childRecord1['requestedStartDate'] = minorLine.requestedStartDate;
          childRecord1['listPrice'] = minorLine.listPrice;
          childRecord1['discount'] = minorLine.discount;
          childRecord1['purchaseAdjustments'] = minorLine.purchaseAdjustments;
          childRecord1['sequence'] = minorLine.sequence;
          childRecord1['architecture'] = minorLine.architecture;
          childRecord1['lineNumber'] = minorLine.lineNumber;
          // childRecord1['isFirstLevelParent'] = false;


          childRecord1['children'] = new Array<any>();

          if (minorLine.minorLines) {
            // get data from minor line of minor lines and set to chidRecord2
            minorLine.minorLines.forEach(val => {

              const childRecord2 = {};

              childRecord2['partNumber'] = val.partNumber;
              childRecord2['quantity'] = this.utiliteService.formatWithNoDecimal(val.quantity);
              childRecord2['initialTerm'] = val.initialTerm ?  this.utiliteService.checkDecimalOrIntegerValue(val.initialTerm)  : val.initialTerm;
              childRecord2['autoRenewalTerm'] = val.autoRenewalTerm;
              childRecord2['billingModel'] = val.billingModel;
              childRecord2['requestedStartDate'] = val.requestedStartDate;
              childRecord2['listPrice'] = val.listPrice;
              childRecord2['discount'] = val.discount;
              childRecord2['purchaseAdjustments'] = val.purchaseAdjustments;
              childRecord2['sequence'] = val.sequence;
              childRecord2['architecture'] = val.architecture;
              childRecord2['lineNumber'] = val.lineNumber;
              childRecord2['multisuiteDiscount'] = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti) ? '--' : val.multisuiteDiscount;


              childRecord2['children'] = new Array<any>();
              childRecord1['children'].push(childRecord2);

            })
          }
          record['children'].push(childRecord1);

        })
      }

      tempData.push(record);
    });


    return tempData;
  }

  ngOnDestroy() {
    this.proposalDataService.displayAnnualBillingMsg = false;
    this.proposalDataService.showFinancialSummary = false; // set to false when route to other pages
    this.appDataService.isGroupSelected = false;
    this.appDataService.persistErrorOnUi = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.appDataService.showActivityLogIcon(false);
  }

  getNodeChildDetails(rowItem) {
    if (rowItem.children.length) {
      return {
        group: true,
        children: rowItem.children,
        key: rowItem.group,
        expanded: true // To make it by default expanded
      };
    } else {
      return null;
    }
  }


  gotoDocument() {
    this.router.navigate(['../document'], { relativeTo: this.route });
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  openQuoteUrl() {
    this.displayAuthorizationError = false;
    this.blockUiService.spinnerConfig.blockUI();
    this.getBomServiceData.generateBomToQuote().subscribe((response: any) => {
      if (response.error) {

        response.messages.forEach(element => {
          if(element.code === 'EA238'){
            this.displayAuthorizationError = true;
          }
        });
        if(!this.displayAuthorizationError){
          this.showErrorMessage = true;
          this.Errormessages = response['messages'];
        }
        
      } else {
        this.showErrorMessage = false;
        const url = response['ccwUrl'];
        if (url) {

          window.open(url, '_blank');
          this.blockUiService.spinnerConfig.unBlockUI();
        }

        this.blockUiService.spinnerConfig.unBlockUI();
      }
    });
  }

  openUrl(){
    window.open('https://salesconnect.cisco.com/open.html?c=ccac87e7-5e2a-472e-8635-c1f716d6c3ae');
  }


  // check type - convertoquote or gotoquote
  generateBomToQuote(type) {
    // if(!this.isPartnerPurchaseAuthorized){
    //   this.openPurchaseModal();
    //   }
    //   else{
    // console.log(type)
    if (this.convertToQuote || this.qualService.changSubAccess) {
        this.getBomServiceData.getDealQuotes(type).subscribe((res: any) => {

          if (res && !res.error && res.data) {

            this.getBomServiceData.linkedQuoteId = res['data']['linkedQuoteId'];
            if (!res['data']['linkedQuote'] && res['data']['eligibleQuotes']) {
              this.openQuoteModal(res['data'], type);
            } else {
              // if type id gotoquote and has inkedQuotedId
              if (type === 'goToQuote' && res['data']['linkedQuoteId']) {
                // console.log(res, type);
                this.goToQuote(res['data']['linkedQuoteId']);
              } else if (type !== 'goToQuote') { // if convert to quote call this convertoccw api
                this.openQuoteUrl();
              }
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
     } else {
        const modalRef = this.modalVar.open(SubscriptionAccessComponent, { windowClass: 'subscriptionaccess-modal'});
        modalRef.result.then((result) => {
          this.qualService.disabledContinueButton = true;
          return;
        });
    }

  }

  currencyFormat(params, thisInstance) {
    if (params.colDef.field === 'qty') {
      return thisInstance.utiliteService.formatWithNoDecimal(params.value);
    } else {
      return thisInstance.utiliteService.formatValue(params.value);
    }
  }

  currencyFormatForDiscount(params, thisInstance) {
    return thisInstance.utiliteService.formatValue(params.value);
  }

  exportExcel() {
    const params = {
      fileName: 'bom'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  downloadBOMPreview() {

    this.getBomServiceData.downloadBOMPreview().subscribe((res: any) => {

      if (res && !res.error) {
        let x = res.headers.get('content-disposition').split('=');
        let filename = x[1]; // res.headers.get("content-disposition").substring(x+1) ;
        filename = filename.replace(/"/g, '');
        const nav = (window.navigator as any);
        if (nav.msSaveOrOpenBlob) { // IE & Edge
          // msSaveBlob only available for IE & Edge
          nav.msSaveBlob(res.body, filename);
        } else {
          const url2 = window.URL.createObjectURL(res.body);
          const link = this.downloadZipLink.nativeElement;
          link.href = url2;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url2);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  salesReadiness() {
    const screenName = 'salesReadiness';
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/' + screenName]);
  }

  goToDocumentCenter() {
    this.qualService.qualification.qualID = '';
    if (this.proposalDataService.proposalDataObject.proposalId !== undefined) {

      if (this.appDataService.isGroupSelected === true) {
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalData.groupId + '/' + 'document' + '/group']);
      } else {
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/' + 'document']);
      }
    }
  }

  openQuoteModal(data, type) { 
    const modalRef = this.modalVar.open(ProposalToQuoteComponent, { windowClass: 'quote-conversion' });
    modalRef.componentInstance.quoteData = data;
    modalRef.componentInstance.invalidPartner = this.invalidPartner;
    modalRef.componentInstance.type = type; // set the type in modal
    modalRef.componentInstance.quotesList = data['eligibleQuotes'];
    modalRef.result.then(res => {
      // check type and do go to quote or coverttoquote
      if (type === 'goToQuote') {
        // console.log(res, type);
        this.goToQuote(res);
      } else {
        if (res) {
          this.getBomServiceData.linkedQuoteId = res;
        } else {
          this.getBomServiceData.linkedQuoteId = null;
        }
        this.openQuoteUrl();
      }
    });
  }
  openPurchaseModal() {
    const modalRef = this.modalVar.open(PurchaseOptionsComponent, { windowClass: 'purchase-options' });

  }

  goToQuote(quoteId) {
    let quoteUrl;
    if (this.proposalDataService.proposalDataObject.proposalId) {
      this.getBomServiceData.getQuoteUrl(this.proposalDataService.proposalDataObject.proposalId, quoteId).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          window.open(response.data, '_blank')
        } else {
          if (response.messages) {
            let errorMessage = response.messages.find(message => {
              return message.code === 'EA149'
            }).text;
            if (errorMessage) {
              this.messageService.displayMessages(this.appDataService.setMessageObject(errorMessage, MessageType.Error), true);
            }
          }
        }
      });
    }
  }

  getCxLinkedProposalListData(linkId) {
    this.cxSwProposalsLinkedData = []
    this.getBomServiceData.getCxLinkedProposalList(this.proposalDataService.proposalDataObject.proposalId, linkId).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        if (res.data.matching && res.data.matching.length) {
          this.cxSwProposalsLinkedData = res.data.matching;
          for (const data of this.cxSwProposalsLinkedData) {
            if (data.status === this.constantsService.IN_PROGRESS_STATUS) {
              this.isLinkedCxInProgress = true;
            }
          }
          if (!this.isLinkedCxInProgress) {
            this.setupBomTab();
          }
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
}
