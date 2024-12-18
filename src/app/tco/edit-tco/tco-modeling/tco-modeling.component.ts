import { Subscription } from 'rxjs';
import { QualificationsService } from './../../../qualifications/qualifications.service';
import { CreateProposalService } from './../../../proposal/create-proposal/create-proposal.service';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { IRoadMap } from '@app/shared';
import { TcoModelingService } from './tco-modeling.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { DeleteProposalComponent } from '@app/modal/delete-proposal/delete-proposal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';

@Component({
  selector: 'app-tco-modeling',
  templateUrl: './tco-modeling.component.html',
  styleUrls: ['./tco-modeling.component.scss']
})
export class TcoModelingComponent implements OnInit, OnDestroy {
  @ViewChild('value', { static: true }) private valueContainer: ElementRef;
  roadMap: IRoadMap;
  stackedBarData: any;
  showStacked = true;
  modelingData: any;
  pricingData: any;
  state: string;
  tcoDataObject: any;
  tcoMetaData: any;
  allowImplicitSave = false;
  showAdditionalWarning = false;
  markupMarginSelectedValue: string;
  selectedMark = 'Markup';
  markOptions = ['Markup', 'Margin'];
  arrAdditionalCost = [];
  selectedMarkForBau = 'Markup';
  loadReviewFinalize = false;
  catalogue: any; // to set the catalogue data from metadata api
  tcoSummaryData = []; // for tcosummary data to outcomes
  public subscribers: any = {};
  includedPartialIbSubscription:Subscription;

  constructor(public tcoModelingService: TcoModelingService, private tcoDataService: TcoDataService,
    public constantsService: ConstantsService, private messageService: MessageService,
    private tcoAPICallService: TcoApiCallService, public appDataService: AppDataService, private permissionService: PermissionService,
    private router: Router, private createProposalService: CreateProposalService, public localeService: LocaleService,
    public utilitiesService: UtilitiesService, public modalVar: NgbModal,
    private route: ActivatedRoute, public proposalDataService: ProposalDataService, private qualService: QualificationsService) { }

  ngOnInit() {

    // Get tco data object from session incase of refresh screen
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    if (sessionObj && sessionObj.tcoDataObj && sessionObj.tcoDataObj.id) {

      if (this.tcoDataService.tcoDataObj) {
        sessionObj.tcoDataObj = this.tcoDataService.tcoDataObj;
      } else {
        this.tcoDataService.tcoDataObj = sessionObj.tcoDataObj;
        this.appDataService.userInfo.firstName = sessionObj.userInfo.firstName;
        this.appDataService.userInfo.lastName = sessionObj.userInfo.lastName;
      }

      if(this.qualService.buyMethodDisti && this.appDataService.userInfo.distiUser && !this.appDataService.isReadWriteAccess){ // set read-write accees to disti user 
        this.appDataService.isReadWriteAccess = true;
      }
      this.appDataService.setSessionObject(sessionObj);
      this.messageService.clear();
      // check id data is present else call get api for tco data
      if (this.tcoDataService.tcoDataObj) {
        this.setTCOModellingData();
      } else {
        this.getTcoModelingData();
      }
      // if ro super user and don't have access to the proposal 
      // if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      //   this.getReadOnlyMode();
      // }
    } else {

      let url1 = this.router.url;
      let spliturl = url1.split('proposal/');
      if (spliturl.length > 1) {
        let arrProposalID = spliturl[1].split('/');
        this.proposalDataService.proposalDataObject.proposalId = arrProposalID[0];


        this.route.paramMap.subscribe(params => {
          if (params.keys.length > 0) {

            let tcoID = params.get('tcoId');
            // let proposalID = params.get('proposalId');

            if (tcoID && tcoID.length > 0) {
              this.tcoDataService.tcoId = +tcoID;
            }
          }

        });
        this.loadUserInfo(arrProposalID[0]);
      }
    }
    this.includedPartialIbSubscription = this.appDataService.includedPartialIbEmitter.subscribe((includedPartialIb) =>{
     this.appDataService.includedPartialIb = includedPartialIb;
    });
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    if (this.tcoDataService.loadReviewFinalize) {
      this.tcoDataService.loadReviewFinalize = !this.tcoDataService.loadReviewFinalize;
    }
    // unsubscribe to the subscription of tco data
    if (this.subscribers.tcoData) {
      this.subscribers.tcoData.unsubscribe();
    }
    if(this.includedPartialIbSubscription){
      this.includedPartialIbSubscription.unsubscribe();
    }
  }

  loadUserInfo(proposalID) {

    this.appDataService.getSessionDataForSummaryPage('p', proposalID).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          const userInfo = res.data.user;
          if (this.appDataService.isAutorizedUser(userInfo)) {
            this.appDataService.userInfo.isProxy = false;
            this.appDataService.userInfo.loggedInUser = userInfo.userId;
            this.appDataService.userInfo.emailId = userInfo.emailId;

            // if user info has permissions and not empty assign to the value else set to empty array
            if (userInfo.permissions && userInfo.permissions.featureAccess && userInfo.permissions.featureAccess.length > 0) {
              // var permissions = [];
              // permissions = userInfo.permissions.featureAccess.map(a => a.name);
              this.permissionService.permissions = new Map(userInfo.permissions.featureAccess.map(i => [i.name, i]));
              this.appDataService.userInfo.permissions = this.permissionService.permissions;
              // this.appDataService.userInfo.permissions = permissions;
            }

            // added for getting adminUser from permissions
            this.appDataService.userInfo.adminUser = this.permissionService.permissions.has(PermissionEnum.Admin);
            if (this.appDataService.userInfo.adminUser) {
              localStorage.setItem('isAdmin', 'TRUE');
            } else {
              localStorage.setItem('isAdmin', this.constantsService.FALSE);
            }

            // check for RoSuerUser message and set the Ro Super user
            if (this.permissionService.permissions.has(PermissionEnum.RoMessage)) {
              this.appDataService.userInfo.roSuperUser = true;
            } else {
              this.appDataService.userInfo.roSuperUser = false;
            }

            // To show debugger
            this.appDataService.showDebugger = this.permissionService.permissions.has(PermissionEnum.Debug);

            // to show Change Subscription radio button
            this.appDataService.allowChangSub = this.permissionService.permissions.has(PermissionEnum.Change_Subscription);

            // flag to allow smart Subsidiaries view access
            this.appDataService.allowSmartSubsidiariesView = this.permissionService.permissions.has(PermissionEnum.Smart_Subsidiary);

            // flag to allow dna exception approval for user
            this.appDataService.userInfo.thresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaThreshold);

            // flag to allow dc exception approval for user
            this.appDataService.userInfo.dcThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DcThreshold);

            // flag to allow security exception approval for user
            this.appDataService.userInfo.secThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.SecThreshold);

            // flag to allow adjustment approval for user
            this.appDataService.userInfo.adjustmentApprover = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentApprover);

            // flag to allow dna exception approval for user 
            this.appDataService.userInfo.dnaDiscountExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaDiscountApprover);

            // flag to allow user to perform purchase adjustment
            // this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentPermit);

            if (userInfo.rwSuperUser) {
              this.appDataService.userInfo.rwSuperUser = userInfo.rwSuperUser;
            } else {
              this.appDataService.userInfo.rwSuperUser = false;
            }

            // if (userInfo.roSuperUser) {
            //   this.appDataService.userInfo.roSuperUser = userInfo.roSuperUser
            // } else {
            //   this.appDataService.userInfo.roSuperUser = false;
            // }

            // flag to allow dna exception approval for user
            // if (userInfo.thresholdExceptionApprover) {
            //    this.appDataService.userInfo.thresholdExceptionApprover =  userInfo.thresholdExceptionApprover;
            // }

            // flag to allow dc exception approval for user
            // if (userInfo.dcThresholdExceptionApprover) {
            //    this.appDataService.userInfo.dcThresholdExceptionApprover =  userInfo.dcThresholdExceptionApprover;
            // }

            // flag to allow security exception approval for user
            // if (userInfo.secThresholdExceptionApprover) {
            //   this.appDataService.userInfo.secThresholdExceptionApprover =  userInfo.secThresholdExceptionApprover;
            //  } else {
            //   this.appDataService.userInfo.secThresholdExceptionApprover = false;
            //  }

            // get the adjustmentApprover from session to userInfo
            // if (userInfo.adjustmentApprover) {
            //   this.appDataService.userInfo.adjustmentApprover = userInfo.adjustmentApprover;
            // } else {
            //   this.appDataService.userInfo.adjustmentApprover = false;
            // }


            if (res.data.propsoal) {
              // qual name and Id are required to load list page if arch name is invalid
              this.appDataService.customerName = res.data.propsoal.customerName;
              this.qualService.qualification.qualID = res.data.propsoal.qualId;
              this.qualService.qualification.name = res.data.propsoal.qualificationName;
              this.proposalDataService.proposalDataObject.proposalData = res.data.propsoal;
              this.proposalDataService.proposalDataObject.proposalId = res.data.propsoal.id;
              //    this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
              this.appDataService.userDashboardFLow = '';
              let sessionObj: SessionData = this.appDataService.getSessionObject();

              if (sessionObj === undefined) {
                sessionObj = this.appDataService.sessionObject;
              }

              this.appDataService.userInfo.firstName = userInfo.firstName;
              this.appDataService.userInfo.lastName = userInfo.lastName;
              sessionObj.userInfo = this.appDataService.userInfo;
              sessionObj.qualificationData = res.data.qualification;
              sessionObj.proposalDataObj = this.proposalDataService.proposalDataObject;
              sessionObj.userDashboardFlow = this.appDataService.userDashboardFLow;
              this.appDataService.setSessionObject(sessionObj);

              this.appDataService.custNameEmitter.emit({
                qualName: this.qualService.qualification.name.toUpperCase(),
                qualId: this.qualService.qualification.qualID,
                proposalId: this.proposalDataService.proposalDataObject.proposalId, 'context': 'TCO'
              });

              if (res.data.propsoal.permissions && res.data.propsoal.permissions.featureAccess &&
                res.data.propsoal.permissions.featureAccess.length > 0) {
                this.permissionService.proposalPermissions = new Map(res.data.propsoal.permissions.featureAccess.map(i => [i.name, i]));
              } else {
                this.permissionService.proposalPermissions.clear();
              }

              // Set local permission for debugger
              this.permissionService.isProposalPermissionPage(true);

              this.appDataService.isReadWriteAccess = (this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName)) ? true : false;
              // set tco create access for tco
              this.tcoDataService.tcoCreateAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) ||
                this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
              
              // flag to allow initiate followon
              this.appDataService.allowInitiateFollowOn = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalInitiateFollowon);
            }

            /// check for rosalesteam and qual permisions and set them in qual service
            if (res.data.qualification) {
              this.qualService.setRoSalesTeamAndQualPermissions(res.data.qualification);
            }

            this.getTcoModelingData();
          }
        } catch (error) {
          console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  // method to call modeling data api and set data to display on UI
  getTcoModelingData() {

    this.tcoAPICallService.getTcoModeling(this.tcoDataService.tcoId).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.tcoDataService.tcoDataObj = res.data;

        const sessionObj: SessionData = this.appDataService.getSessionObject();
        if (sessionObj) {

          if (this.tcoDataService.tcoDataObj) {
            sessionObj.tcoDataObj = this.tcoDataService.tcoDataObj;
          }
          this.appDataService.setSessionObject(sessionObj);
        }
        this.setTCOModellingData();

      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // this method will throw user to summary page and only readonly mode
  getReadOnlyMode() {
    this.tcoDataService.conponentNumToLoad = 2;
    this.appDataService.tcoReadOnlyUser.emit(this.tcoDataService.conponentNumToLoad);
    this.tcoDataService.loadReviewFinalize = true; // assign load review page to true
  }
  setTCOModellingData() {

    // if RO Super user, call readonly method to open review page
    if (!this.appDataService.isReadWriteAccess && !this.tcoDataService.loadReviewFinalize) {
      this.getReadOnlyMode();
    }

    this.tcoDataObject = this.tcoDataService.tcoDataObj;

    // Set flex cost
    // this.setFlexCost()
    this.tcoDataService.tcoId = this.tcoDataObject.id;
    // to set the vlaue on UI after loading
    // this.setMarkUpMargin();
    // after the header called while reloading the page check for disable mode and call readonlymode method
    this.subscribers.tcoData = this.appDataService.tcoData.subscribe((data: any) => {
      if (data.disableMode && !this.tcoDataService.loadReviewFinalize) {
        this.getReadOnlyMode();
      }
    });
    if (!this.tcoDataService.isHeaderLoaded) {

      if (!this.proposalDataService.proposalDataObject.proposalId) {

        const sessionObj: SessionData = this.appDataService.getSessionObject();
        this.proposalDataService.proposalDataObject = sessionObj.proposalDataObj;
        this.qualService.qualification = sessionObj.qualificationData;
      }


      let json = {
        'data': {
          'id': this.proposalDataService.proposalDataObject.proposalId,
          'qualId': this.qualService.qualification.qualID
        }
      };
      this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, json);
      this.tcoDataService.isHeaderLoaded = true;
    }
    // if header loaded set the pagecontext and load respective page
    if (this.tcoDataService.isHeaderLoaded) {
      // console.log(this.tcoDataService.loadReviewFinalize);
      // if not the load review set pagecontext to TCO and call metadata else set review page and call meta data if data not present
      if (!this.tcoDataService.loadReviewFinalize) {
        this.loadReviewFinalize = false;
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.tcoModeling;
        this.appDataService.showActivityLogIcon(true);
        this.state = 'TCO Modeling';
        // console.log(this.tcoDataService.tcoMetaData, 'metadata');
        // if metadata present and is related to same arch call showmodelingdata method to set & show modeling data else call metadata api
        if (this.tcoDataService.tcoMetaData &&
          this.tcoDataService.tcoMetaData.archName === this.appDataService.subHeaderData.subHeaderVal[7]) {
          this.showModelingData();
        } else {
          this.getMetaData();
        }
        // console.log('outcome3');
        // console.log('metadata-modeling');
        // console.log('modeling');
        // Set flex cost
        this.setFlexCost();
        // to set the vlaue on UI after loading
        this.setMarkUpMargin();
      } else {
        this.loadReviewFinalize = true;
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.tcoReview;
        this.state = 'Review-Finalize';
        // if catalogue meta data present call show outcomes mehtod to show outcomes data else call metadata api
        if (this.tcoDataService.catalogueMetaData) {
          this.showOutcomeData();
          // console.log('outcome1')
          this.stackedBarData = this.tcoDataService.prepareGraph1(this.tcoDataObject);
          this.appDataService.loadGraphDataEmitter.emit(this.stackedBarData);
        } else {
          this.getMetaData();
          // console.log('outcome2')
          // console.log('metadata-review');
        }
        // console.log('review');
      }
    }
    // this.getMetaData();
  }

  // this method will call and set all the required calls for setting and showing the modeling data on UI
  showModelingData() {
    this.tcoMetaData = this.tcoDataService.tcoMetaData;
    this.markupMarginSelectedValue = this.tcoDataService.tcoDataObj['enterpriseAgreement']['markupMargin']['type'];
    this.tcoDataService.catalogueMetaData = this.tcoMetaData.catalogue;
    // console.log('showModelingData');
    this.pricingData = this.tcoModelingService.getPricingObject();
    this.tcoModelingService.prepareModelingData(this.pricingData, this.modelingData, this.tcoMetaData);
    this.modelingData = this.tcoMetaData.metadata;
    this.stackedBarData = this.tcoDataService.prepareGraph1(this.tcoDataObject);
    this.appDataService.loadGraphDataEmitter.emit(this.stackedBarData);
  }

  // Set flex cost
  setFlexCost() {

    if (this.tcoDataObject['businessAsUsual'] && this.tcoDataObject['businessAsUsual']['flexCosts']) {
      this.arrAdditionalCost = this.tcoDataObject['businessAsUsual']['flexCosts'];
      // Format currency value
      for (const additionalCost of this.arrAdditionalCost) {
        additionalCost.value = this.utilitiesService.formatWithNoDecimalForDashboard(additionalCost.value);
      }
    }
  }

  getModelingdata() {
    this.tcoModelingService.getModelingData()
      .subscribe((response: any) => {
        this.pricingData = response.priceComparison;
        this.modelingData = response.distribution;
      });
  }

  getGraphData() {
    this.tcoModelingService.getGraphData()
      .subscribe((responseData: any) => {
        this.stackedBarData = responseData;
      });
  }

  continue() {
    this.tcoDataService.loadReviewFinalize = false;
    if (this.loadReviewFinalize) {
      this.tcoAPICallService.finalizeModeling(this.tcoDataService.tcoId).subscribe((res: any) => {
        if (res && !res.error) {
          this.gotToListPage();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      this.roadMap.eventWithHandlers.continue();
    }
    // this.roadMap.eventWithHandlers.continue();
  }

  cancel() {
    // back to tco list page
    this.router.navigate(['../tcoList'], { relativeTo: this.route });
  }

  // method to go back to TCO outcomes page
  backToOutcome() {
    this.roadMap.eventWithHandlers.backToOutcome();
  }

  showStackedGrph() {
    this.showStacked = true;
    // this.appDataService.loadGraphDataEmitter.emit(this.stackedBarData);
  }

  showBarGrph() {
    this.showStacked = false;
  }

  addMore() {

    if (this.arrAdditionalCost && this.arrAdditionalCost.length > 0) {

      for (let additionalCost of this.arrAdditionalCost) {
        if (additionalCost.name.length === 0 || additionalCost.value.length === 0) {
          return;
        }
      }
    }
    this.arrAdditionalCost.push({ 'name': '', 'value': '' });
    this.scrollBottom();
  }

  getMetaData() {
    // if(this.tcoDataService.isMetaDataLoaded && this.loadReviewFinalize){
    //   return;
    // }
    // this.tcoDataService.isMetaDataLoaded = true;
    this.tcoAPICallService.getMetaData(this.tcoDataService.tcoId).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        this.tcoDataService.tcoMetaData = res.data;
        // console.log('metadata');
        // method to set and show modeling data on UI after meta data api repsponse
        this.showModelingData();
        //   this.tcoMetaData = res.data;
        //   this.markupMarginSelectedValue = this.tcoDataService.tcoDataObj['enterpriseAgreement']['markupMargin']['type'];
        //   this.tcoDataService.catalogueMetaData = res.data.catalogue;
        //  // console.log('metadata');
        //   this.pricingData = this.tcoModelingService.getPricingObject();
        //   this.tcoModelingService.prepareModelingData(this.pricingData,this.modelingData,this.tcoMetaData);
        //   this.modelingData = this.tcoMetaData.metadata;
        //   this.stackedBarData = this.tcoDataService.prepareGraph1(this.tcoDataObject);
        //   this.appDataService.loadGraphDataEmitter.emit(this.stackedBarData);
        // if review page load is set and metadata api is called, call showoutcomedata method to set and show out comes data
        if (this.loadReviewFinalize) {
          this.showOutcomeData();
          // console.log('outcome4');
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }

    });
  }

  // method to call modeling data api and set data to display on UI
  showOutcomeData() {
    this.tcoSummaryData = [];
    this.tcoDataService.tcoSummaryData = [];
    // to set selected outcome data
    this.catalogue = this.tcoDataService.catalogueMetaData;
    this.tcoDataService.getTcoSummaryData(this.tcoDataObject.catalogue.outcomes, this.catalogue);
    this.tcoSummaryData = this.tcoDataService.tcoSummaryData;
    // console.log(this.tcoSummaryData);
  }

  implicitSave(b, a, modelingData, event: any, editedValue = 'bauValue') {
    // if value is empty don't call save api
    this.allowImplicitSave = this.tcoModelingService.checkValueChanged(b, editedValue);
    /*if (b.bauValue === '' || b.eavalue === '') {
      this.allowImplicitSave = false;
    }*/
    if (editedValue === 'bauPercentage' && (b.bauPercentage === '' || b.bauPercentage === ' ' || b.bauPercentage === undefined)) {
      b.bauPercentage = '0.00';
    }
    if (editedValue === 'bauValue' && (b.bauValue === '' || b.bauValue === ' ' || b.bauValue === '-' || b.bauValue === undefined)) {
      b.bauValue = '0.00';
    }
    if (editedValue === 'eavalue' && (b.eavalue === '' || b.eavalue === ' ' || b.eavalue === '-' || b.eavalue === undefined)) {
      b.eavalue = '0.00';
    }
    if (editedValue === 'eaPercentage' && (b.eaPercentage === '' || b.eaPercentage === ' ' || b.eaPercentage === undefined)) {
      b.eaPercentage = '0.00';
    }
    if (!this.allowImplicitSave) {
      return;
    }
    this.allowImplicitSave = false;
    let tcoObj = this.tcoDataService.tcoDataObj;
    // Using TCO_METADATA_IDS map for comparisons 
    if (b.id === this.constantsService.TCO_METADATA_IDS.netPrice ||
      b.id === this.constantsService.TCO_METADATA_IDS.productListPrice ||
      b.id === this.constantsService.TCO_METADATA_IDS.serviceListPrice ||
      b.id === this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment ||
      b.id === this.constantsService.TCO_METADATA_IDS.netPriceWithPA || b.id === this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA) {
      if ((tcoObj.businessAsUsual[b.id] || tcoObj.businessAsUsual[b.id] === 0) && b.bauValue) {
        tcoObj.businessAsUsual[b.id] = +(b.bauValue.split(',').join(''));
      }
      if ((tcoObj.enterpriseAgreement[b.id] || tcoObj.enterpriseAgreement[b.id] === 0) && b.eavalue) {
        tcoObj.enterpriseAgreement[b.id] = +(b.eavalue.split(',').join(''));
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.purchaseAdjustment) {  // set negative value for purchaseAdjustment
      if ((tcoObj.businessAsUsual[b.id] || tcoObj.businessAsUsual[b.id] === 0) && b.bauValue) {
        // convert number in negative
      if (b.bauValue > 0) {
        b.bauValue = b.bauValue * -1;
      }
      b.bauValue = (b.bauValue + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,'); // format the value 
      tcoObj.businessAsUsual[b.id] = b.bauValue.replace(/,/g, ''); // convert from string to number
      }
      if ((tcoObj.enterpriseAgreement[b.id] || tcoObj.enterpriseAgreement[b.id] === 0) && b.eavalue) {
        // convert number in negative
      if (b.eavalue > 0) {
        b.eavalue = b.eavalue * -1;
      }
      b.eavalue = (b.eavalue + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,'); // format the value 
      tcoObj.enterpriseAgreement[b.id] = b.eavalue.replace(/,/g, ''); // convert from string to number
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.averageDiscount) {
      if ((tcoObj.businessAsUsual[b.id] || tcoObj.businessAsUsual[b.id] === 0) && b.bauValue && editedValue === 'bauValue') {
        b.bauValue = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value));
        tcoObj.businessAsUsual[b.id] = +b.bauValue;
      }
      if ((tcoObj.enterpriseAgreement[b.id] || tcoObj.enterpriseAgreement[b.id] === 0) && b.eavalue && editedValue === 'eavalue') {
        b.eavalue = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value));
        tcoObj.enterpriseAgreement[b.id] = +b.eavalue;
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.growth ||
      b.id === this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku || b.id === this.constantsService.TCO_METADATA_IDS.timeValueMoney) {
      if (b.bauValue) {
        tcoObj.businessAsUsual[b.id].value = +(b.bauValue.split(',').join(''));
      }
      if (b.bauPercentage) {
        // send the percentage value changed to two decimal point
        b.bauPercentage = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value));
        tcoObj.businessAsUsual[b.id].percent = +(b.bauPercentage);
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.trueFroward ||
      b.id === this.constantsService.TCO_METADATA_IDS.operationalEffieciency) {
      if (b.bauValue) {
        tcoObj.businessAsUsual[b.id] = +(b.bauValue.split(',').join(''));
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.markupMargin) {
      if (b.eavalue) {
        tcoObj.enterpriseAgreement[b.id].value = +(b.eavalue.split(',').join(''));
      }
      if (b.eaPercentage && editedValue === 'eaPercentage') {
        // send the percentage value changed to two decimal point
        b.eaPercentage = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value));
        tcoObj.enterpriseAgreement[b.id].percentage = +(b.eaPercentage);
      }

      if (b.bauValue) {
        tcoObj.businessAsUsual[b.id].value = +(b.bauValue.split(',').join(''));
      }
      if (b.bauPercentage && editedValue === 'bauPercentage') {
        // send the percentage value changed to two decimal point
        b.bauPercentage = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value));
        tcoObj.businessAsUsual[b.id].percentage = +(b.bauPercentage);
      }
    } else if (b.id === this.constantsService.TCO_METADATA_IDS.ramp ||
      b.id === this.constantsService.TCO_METADATA_IDS.starterKit || b.id === this.constantsService.TCO_METADATA_IDS.dnac || b.id === this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance) {
      if (b.bauValue) {
        tcoObj.businessAsUsual[this.constantsService.TCO_METADATA_IDS.promotionCost][b.id] = +(b.bauValue.split(',').join(''));
      }
    }

    // console.log(tcoObj.businessAsUsual);
    if (tcoObj.catalogue) {
      delete tcoObj.catalogue;
    }
    if (tcoObj.benefitsPercent) {
      delete tcoObj.benefitsPercent;
    }
    if (tcoObj.savings) {
      delete tcoObj.savings;
    }

    // Add additional cost
    if (this.arrAdditionalCost && this.arrAdditionalCost.length > 0) {

      this.formatAdditionalCost();
      tcoObj.businessAsUsual['flexCosts'] = this.arrAdditionalCost;
    }

    this.tcoAPICallService.implicitSave(this.tcoDataService.tcoId, tcoObj).subscribe((res: any) => {
      if (res && !res.error) {
        this.refreshTCOModellingData(res);
      } else {
        // add catalog
      }
    });
  }

  // Remove currency formatting
  formatAdditionalCost() {

    for (let additionalCost of this.arrAdditionalCost) {
      if (additionalCost.value) {
        additionalCost.value = +(additionalCost.value.split(',').join(''));
      }
    }
  }

  implicitSaveAdditionalCost(additionalCost) {

    let tcoObj = this.tcoDataService.tcoDataObj;

    // console.log(tcoObj.businessAsUsual);
    if (tcoObj.catalogue) {
      delete tcoObj.catalogue;
    }
    if (tcoObj.benefitsPercent) {
      delete tcoObj.benefitsPercent;
    }
    if (tcoObj.savings) {
      delete tcoObj.savings;
    }

    if (additionalCost.name && additionalCost.value) {
      this.formatAdditionalCost();
      tcoObj.businessAsUsual['flexCosts'] = this.arrAdditionalCost;
      this.tcoAPICallService.implicitSave(this.tcoDataService.tcoId, tcoObj).subscribe((res: any) => {
        if (res && !res.error) {
          this.refreshTCOModellingData(res);
        } else {
          // add catalog
        }
      });
    }
  }

  // to set the vlaue on UI after loading
  setMarkUpMargin() {
    // check if the type is margin and set the respected value on UI as selected value
    if (this.tcoDataObject['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['type'] === ConstantsService.TCO_MARGIN) {
      this.selectedMark = this.localeService.getLocalizedString('tco.TCO_MODELING_MARGIN');
    } else {
      this.selectedMark = this.localeService.getLocalizedString('tco.TCO_MODELING_MARKUP');
    }
    if (this.tcoDataObject['businessAsUsual']['markupMargin']['type'] === ConstantsService.TCO_MARGIN) {
      this.selectedMarkForBau = this.localeService.getLocalizedString('tco.TCO_MODELING_MARGIN');
    } else {
      this.selectedMarkForBau = this.localeService.getLocalizedString('tco.TCO_MODELING_MARKUP');
    }
  }

  // This method will be used to refresh tco modelling
  refreshTCOModellingData(res) {

    this.tcoDataService.tcoDataObj = res.data;
    this.tcoDataObject = this.tcoDataService.tcoDataObj;
    this.tcoDataService.tcoId = this.tcoDataObject.id;


    // Set session value
    this.setSessionValue();

    // Set flex cost
    this.setFlexCost();

    // to set the vlaue on UI after saving
    this.setMarkUpMargin();
    this.tcoModelingService.prepareModelingData(this.pricingData, this.modelingData, this.tcoMetaData);
    this.modelingData = this.tcoMetaData.metadata;
    this.stackedBarData = this.tcoDataService.prepareGraph1(this.tcoDataObject);
    this.appDataService.loadGraphDataEmitter.emit(this.stackedBarData);
    // console.log(this.stackedBarData);
  }


  // Set session value
  setSessionValue() {

    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.tcoDataObj = this.tcoDataService.tcoDataObj;
    this.appDataService.setSessionObject(sessionObj);
  }


  // This method will be used to restore default
  restoreDefault(tcoID) {

    this.tcoAPICallService.restore(tcoID).subscribe((res: any) => {
      if (res && !res.error) {
        this.refreshTCOModellingData(res);
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // this method is to call only number event for all prices
  numberOnlyKey(b, $event, id = 'additionalCost', editedValue = 'bauValue') {
    if (id === 'averageDiscount') {
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 ||
        $event.keyCode === 9 || $event.keyCode === 190 || $event.keyCode === 110 ||
        $event.keyCode === 37 || $event.keyCode === 39 || $event.keyCode === 46)) {
        // if not the keycodes set the value to empty
        $event.target.value = '';
        b[editedValue] = $event.target.value;
        event.preventDefault();
      } else {
        this.allowImplicitSave = true;
      }
    } else {
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 ||
        $event.keyCode === 9 || $event.keyCode === 37 || $event.keyCode === 39 || $event.keyCode === 46)) {
        event.preventDefault();
      } else {
        this.allowImplicitSave = true;
      }
    }
  }

  averageDiscountKey(b, event: any) {
    if (b.id === this.constantsService.TCO_METADATA_IDS.averageDiscount) {
      this.isNumberOnlyKey(event);
    }
  }
  // this method is to calling numbers and decimal points
  isNumberOnlyKey(event: any) {
    if (!this.utilitiesService.isNumberKey(event)) {
      event.target.value = '';
    }
    // if value set respective and call save api
    if (event.target.value) {
      if (event.target.value > 100) {
        event.target.value = 100;
      } else if (event.target.value < 0 || event.target.value === 0) {
        event.target.value = 0;
      }
      this.allowImplicitSave = true;
    }
  }

  selectOption(val, type) {
    // set the value to MARKUP/MARGIN to send in tco obj
    let value = ConstantsService.TCO_MARKUP; // set default to markup
    if (val === ConstantsService.TCO_SAVE_MARKUP) { // check if selected is markup / margin and set the value
      value = ConstantsService.TCO_MARKUP;
    } else {
      value = ConstantsService.TCO_MARGIN;
    }
    let tcoObj = this.tcoDataService.tcoDataObj;
    if (type === 'ea') {
      this.selectedMark = val;
      tcoObj['enterpriseAgreement']['markupMargin']['type'] = value;
    } else {
      this.selectedMarkForBau = val;
      tcoObj['businessAsUsual']['markupMargin']['type'] = value;
    }

    // Add additional cost
    if (this.arrAdditionalCost && this.arrAdditionalCost.length > 0) {
      this.formatAdditionalCost();
      tcoObj.businessAsUsual['flexCosts'] = this.arrAdditionalCost;
    }

    this.tcoAPICallService.implicitSave(this.tcoDataService.tcoId, tcoObj).subscribe((res: any) => {
      if (res && !res.error) {
        this.refreshTCOModellingData(res)
      } else {
        // add catalog
      }
    });
  }

  scrollBottom() {
    if (window.pageYOffset > 0) {
      setTimeout(() => {
        window.scrollTo(0, (window.pageYOffset + 100));
      }, 200);
    }
  }


  deleteRow(i) {
    let tcoObj = this.tcoDataService.tcoDataObj;
    const modalRef = this.modalVar.open(DeleteProposalComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.message = 'Are you sure you want to delete?';
    modalRef.result.then((result) => {
      if (result.continue === true) {
        if (tcoObj.catalogue) {
          delete tcoObj.catalogue;
        }
        if (tcoObj.benefitsPercent) {
          delete tcoObj.benefitsPercent;
        }
        if (tcoObj.savings) {
          delete tcoObj.savings;
        }
        this.arrAdditionalCost.splice(i, 1);

        // Add additional cost
        if (this.arrAdditionalCost && this.arrAdditionalCost.length > 0) {
          this.formatAdditionalCost();
          tcoObj.businessAsUsual['flexCosts'] = this.arrAdditionalCost;
        }

        tcoObj.businessAsUsual.flexCosts = this.arrAdditionalCost;
        this.tcoAPICallService.implicitSave(this.tcoDataService.tcoId, tcoObj).subscribe((res: any) => {
          if (res && !res.error) {
            this.refreshTCOModellingData(res);
          } else {
            // add catalog
          }
        });
      }
    });

  }

  open(tooltip, val) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }
  // call this method to go to TCO List Page
  gotToListPage() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco']);
  }

  goToDocCenter() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/document']);
  }

  goToBom() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  hasChangedFromInitialValue(b, editedValue) {
    // check the edited vaule type and if its editable or not
    const tcoObj = this.tcoDataService.tcoDataObj;
    if (tcoObj.prices[editedValue][b.id] !== undefined && tcoObj.prices[editedValue][b.id] !== tcoObj[editedValue][b.id]) {
      if (editedValue === 'businessAsUsual' && !b.bauEditable) {
        return false;
      } else if (editedValue === 'enterpriseAgreement' && !b.eaEditable) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  restoreValue(b, editedValue) {
    const tcoObj = this.tcoDataService.tcoDataObj;

    // Add additional cost
    if (this.arrAdditionalCost && this.arrAdditionalCost.length > 0) {
      this.formatAdditionalCost();
      tcoObj.businessAsUsual['flexCosts'] = this.arrAdditionalCost;
    }
    // check the edited value if bau /ea, set the respected value depeding upon id and call the api
    tcoObj[editedValue][b.id] = this.tcoDataService.tcoDataObj.prices[editedValue][b.id];
    // tcoObj[editedValue][b.id] = this.tcoDataService.tcoDataObj.prices[b.id];
    this.tcoAPICallService.implicitSave(this.tcoDataService.tcoId, tcoObj).subscribe((res: any) => {
      if (res && !res.error) {
        this.refreshTCOModellingData(res);
      } else {
        // add catalog
      }
    });
  }
}

