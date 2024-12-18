import { Component, OnInit, Input, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IRoadMap, RoadMapGrid } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-change-deal-id',
  templateUrl: './change-deal-id.component.html',
  styleUrls: ['./change-deal-id.component.scss']
})
export class ChangeDealIdComponent implements OnInit, OnDestroy {
  @Input() changeDealid; // to set changedeal/clone
  roadMaps: any;
  showLookUp = false; // to set after deal lookup
  continueSelectionDisable = true; // to disable continue button for first step after deal lookup
  disableUpdateBtn = true;
  resultFound = true;
  resultMatch = false;
  currentStep = 0;
  showWarningMessage = false;
  percentageComplete: number;
  showSuccessmessge = false;
  headerName: string;
  qualObj: any;
  qualId: any;
  ciscoDealForPartner = false;
  qualProposals: any;
  selectedProposals: any = []; // to set checked proposal and display in summary page
  reqObj: any;
  newQualObj: any; // to set new qual object data after save and confirm
  selectAll = true;
  dealData: any = []; // to set deal data of existing qual
  isQualDataLoaded = false; // set after existing qualdata is loaded/set
  qualEAQualificationName = '';
  isQualNameInvalid = false;
  qualEADealId = '';
  eaQualDescription = '';
  disableSearch = true;
  errorDealID = false;
  newQualData: any = []; // set for new deal data after lookup
  prospectDetails: any = {};
  isCustomerMatching: boolean; // set if customer is matching
  isPartnerDeal = false; // set if deal is partner deal
  showDealSummary = false; // set to show deal summary
  searchDealId = true;
  invalidDealId = false;
  amMactching = false; // set if account of new and old deal matched
  isQualPartnerDeal = false; // set if existing qual's deal is partner deal
  disableSelection = false; // set in toggled switch and disable checkbox
  sameDeal = false; // set if the deals are same
  isBeGeoIdDifferent = false; // in partner flow, if BeGeoId is Different set it to true
  @Input() isFromQualList; // set if clone/changedeal in qual summary/list page

  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService, private http: HttpClient,
    private qualService: QualificationsService, public renderer: Renderer2, public appDataService: AppDataService,
    public utilitiesService: UtilitiesService, public constantsService: ConstantsService, private blockUiService: BlockUiService,
    public router: Router, public productSummaryService: ProductSummaryService, public messageService: MessageService) { }

  ngOnInit() {
    this.percentageComplete = 0;
    this.loadQualProposals();
    if (this.changeDealid) {
      this.headerName = 'Change Deal ID';
      this.roadMaps = [
        {
          name: 'Select Deal ID'
        },
        {
          name: 'Select Proposal(s)'
        },
        {
          name: 'Summary'
        }
      ];
    } else {
      this.currentStep = 0;
      this.headerName = 'Clone Qualification';
      this.continueSelectionDisable = false;
      this.roadMaps = [
        {
          name: 'Qualification Info'
        },
        {
          name: 'Select Proposal(s)'
        },
        {
          name: 'Summary'
        }
      ];
    }

  }

  ngOnDestroy() {
    this.messageService.hideParentErrorMsg = false;
    this.messageService.clear();
  }
  continueSelection(event) {
    // if (event.target.checked) {
    this.continueSelectionDisable = !this.continueSelectionDisable;
    // }
  }
  continueProposalSelection(step) {
    if (step === 0 && this.changeDealid) {
      this.continueSelectionDisable = true;
    }
    this.currentStep = step;
    this.percentageComplete = this.currentStep * (100 / (this.roadMaps.length - 1));
  }

  // method to go back to 1st and 2nd steps to edit selected values
  backToPrevious(step) {
    this.messageService.clear();
    this.currentStep = step - 1;
    if (this.currentStep === 0 && this.changeDealid) {
      this.continueSelectionDisable = true;
    }
  }

  close() {
    this.messageService.hideParentErrorMsg = false;
    this.activeModal.close();
  }

  showRoadMap(index) {
    // disable the button and uncheck checboc if first step and change dealID
    if (index === 0 && this.changeDealid) {
      this.continueSelectionDisable = true;
    }
    // if current step is less than index requested, don't allow roadmap
    if (this.currentStep < index) {
      return false;
    }
    this.currentStep = index;
    this.percentageComplete = this.currentStep * (100 / (this.roadMaps.length - 1));
  }


  // If Qualification Name is blank then disable create button.
  isQualNameBlank() {
    this.isQualNameInvalid = (this.qualEAQualificationName === '') ? true : false;
  }

  loadQualProposals() {
    // if from qual list call qual data api, set req obj and call proposal list
    if (this.isFromQualList) {
      // call getQual api
      this.qualService.getCustomerInfo(this.qualId).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          this.qualObj = response.data;
          this.dealData = this.qualObj.deal;
          this.isQualPartnerDeal = this.qualObj.partnerDeal;
          this.isQualDataLoaded = true;
          this.reqObj = {
            qualId: this.qualObj.qualId,
            proposalIds: [],
            archName: this.qualObj.archName,
            customerId: this.qualObj.customerId,
            customerName: this.qualObj.customerName,
            dealId: this.qualObj.dealId,
            qualName: this.qualEAQualificationName,
            description: this.eaQualDescription,
            federalCustomer: this.qualObj.federalCustomer,
            am: this.dealData.accountManager
          };
          // call list proposal api after qual data api
          this.getProposalList(this.qualObj.qualId);
        }
      });

    } else { // set req obj, qual data from qual summary api data and call proposal list api
      this.dealData = this.qualObj.dealInfoObj;
      this.qualObj.customerName = this.appDataService.customerName;
      this.isQualPartnerDeal = this.qualObj.partnerDeal;
      this.isQualDataLoaded = true;
      this.reqObj = {
        qualId: this.qualObj.qualID,
        proposalIds: [],
        archName: this.appDataService.archName,
        customerId: this.appDataService.customerID,
        customerName: this.appDataService.customerName,
        dealId: this.qualObj.dealId,
        qualName: this.qualEAQualificationName,
        description: this.eaQualDescription,
        federalCustomer: (this.qualObj.federal === 'Yes') ? 'Y' : 'N',
        am: this.dealData.accountManager
      };
      this.getProposalList(this.qualObj.qualID);
    }
  }

  // method to call proposal list api
  getProposalList(qualId) {
    this.http.get(this.appDataService.getAppDomain + 'api/proposal/list?q=' + qualId).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        this.qualProposals = [];
        response.data.forEach(prop => {
          if(!prop.cxProposal){
            prop.checked = true;
            this.qualProposals.push(prop);
          }
          
        });
        this.selectedProposals = this.qualProposals.filter(data => data.checked === true);
      } else {
        this.qualProposals = [];
      }
    });
  }

  // method to save and confirm, set the request obj from entered/selected values
  saveAndConfirm() {
    // this.reqObj.qualId = this.qualObj.id;
    this.reqObj.qualName = this.qualEAQualificationName;
    this.reqObj.description = this.eaQualDescription;

    if (this.qualProposals) {
      this.reqObj.proposalIds = [];
      this.qualProposals.forEach(prop => {
        if (prop.checked) {
          this.reqObj.proposalIds.push(prop.id);
        }
      });
    }
    // call clone or change deal api
    this.qualService.qualClone(this.changeDealid, this.reqObj).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        this.newQualObj = response.data;
        this.showSuccessmessge = true;
        this.qualService.loadUpdatedQualListEmitter.emit();
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  allChecked() {
    if (this.qualProposals) {
      this.selectAll = true; 
      this.qualProposals.forEach(prop => {
        if (!prop.checked) {
          this.selectAll = false;
        }
      });
      // set the selected proposals by filtering checked proposal of proposalList
      this.selectedProposals = this.qualProposals.filter(data => data.checked === true);
    }

  }

  updateCheckAll() {
    if (this.selectAll) {
      this.qualProposals.forEach(prop => {
        prop.checked = true;
      });
    } else {
      this.qualProposals.forEach(prop => {
        prop.checked = false;
      });
    }
    // set the selected proposals by filtering checked proposal of proposalList
    this.selectedProposals = this.qualProposals.filter(data => data.checked === true);
  }

  goToNewQual() {
    if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.QualificationSuccess){
      this.qualService.loadQualSummaryEmitter.emit();
    } 
    this.router.navigate(['qualifications/' + this.newQualObj.qualId]);
    this.close();
  }

  // method to proceed deal change after modal opens
  proceedDealChange() {
    this.currentStep = 0;
    // this.showWarningMessage = false;
    this.loadQualProposals();
  }

  // method to lookupdeal
  updateDealLookUpID() {
    this.resultFound = false;
    this.resultMatch = false;
    this.showLookUp = false;
    this.amMactching = false;
    this.errorDealID = false;
    this.sameDeal = false;
    this.ciscoDealForPartner = false;
    this.isBeGeoIdDifferent = false;
    this.continueSelectionDisable = true;
    this.disableSearch = (this.qualEADealId !== this.qualObj.dealId && this.qualEADealId.trim() !== '') ? false : true;
    this.disableUpdateBtn = true;
    this.messageService.clear();
  }

  //  method to call lookupdeal api
  searchDeal(dealId) {
    const dealLookUpRequest = {
      userId: this.appDataService.userId,
      dealId: this.utilitiesService.removeWhiteSpace(this.qualEADealId),
      customerId: this.isFromQualList ? this.qualObj.customerId : this.appDataService.customerID
    };
    if (dealLookUpRequest.dealId === this.dealData.dealId) {
      this.sameDeal = true;
    } else {
      this.productSummaryService.showProspectDealLookUp(dealLookUpRequest).subscribe((res: any) => {
        if (res && res.data && !res.error) {
          this.isCustomerMatching = res.data.matching;
          this.isPartnerDeal = res.data.partnerDeal;
          this.newQualData = res.data.dealDetails;
          if (res.data.prospectDetails) {
            this.prospectDetails = res.data.prospectDetails[0];
          } else {
            this.prospectDetails = {};
          }
          this.isQualNameInvalid = false;
          if (this.isPartnerDeal) { // for partner deal
            this.qualService.qualification.primaryPartnerName = res.data.partnerInfo.beGeoName;
           // if partner deal & partner user check for bgo id
            if (this.appDataService.userInfo.isPartner && res.data.partnerInfo.beGeoId !== this.qualObj.partnerBEGeoId) {
              this.isBeGeoIdDifferent = true;
            }
          } else { // for cisco deal
            if (this.appDataService.userInfo.isPartner) { // if cisco deal & partner user show error msg
              this.ciscoDealForPartner = true;
            }
            this.qualService.qualification.primaryPartnerName = this.newQualData.primaryPartnerName;
          }
          this.errorDealID = false;

          this.showDealSummary = true;
          this.showLookUp = true;
          this.searchDealId = false;

          // check the new deals manager user id with old deals and set amMatching flag
          if (this.dealData.accountManager) {
            if(this.newQualData.accountManager.userId === this.dealData.accountManager.userId){
              this.amMactching = true;
            }
         }else {
             this.amMactching = false;
          }
          // set the requested obj after search deal data
          this.reqObj = {
            qualId: this.qualId,
            proposalIds: [],
            archName: this.qualObj.archName,
            customerId: this.prospectDetails.prospectKey,
            customerName: this.prospectDetails.prospectName,
            dealId: this.newQualData.dealId,
            qualName: this.qualEAQualificationName,
            federalCustomer: this.qualObj.federalCustomer,
            am: this.newQualData.accountManager,
            description: this.eaQualDescription
          };
        } else {
          this.messageService.displayMessagesFromResponse(res);
          // this.errorMessage = this.localeService.getLocalizedMessage('qual.create.NO_ASSOCIATED_DEAL');
          this.searchDealId = false;
          this.errorDealID = true;
          this.invalidDealId = true;
        }
      });
    }

  }

  // method to switch proposals check or uncheck for selecting
  globalSwitchChange(event) {
    // console.log(event);
    this.selectAll = !event;
    this.disableSelection = event; // set depending on switch event and disable checkboxes of proposal selection
    this.updateCheckAll(); // after switching check/uncheck all proposals
  }
  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }
}
