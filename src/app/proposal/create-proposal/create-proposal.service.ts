import { LinkedProposalInfo } from './../proposal.data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { AppDataService } from '../../shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ProposalDataService } from '../proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CreateProposalService {
    static readonly IN_PROGRESS_STATUS = 'In Progress';
    proposalCreated = false;
    proposalId: any = null;
    reqJSON: any;
    oldvalue: any;
    oldCountryValue: any;
    countryOfTransactions = [];
    isPartnerDeal = false;        
    distiName = '';

    isPartnerPurchaseAuthorized = false;
    noOfSuitesCount = new EventEmitter<any>();

    partnerID = 0;
    mspPartner = false;
    isMSPSelected = false;
    selectedArchitecture = '';
    callCreateOrResetProposalParamsEmitter = new EventEmitter<any>(); // emit while clicking reset or create 
    proposalArchQnaEmitter = new EventEmitter<any>(); // emit while selecting qna in create proposal flow
    forceAttachProgramTerm = false;
    eligibleArchs = [];


    readonly MONTH = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': "May", '06': 'June', '07': 'July', '08': "August", '09': "September", '10': "October", '11': "November", '12': "December" };

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private appDataService: AppDataService, public proposalDataService: ProposalDataService, public blockUiService: BlockUiService,
        public qualService: QualificationsService, public messageService: MessageService, public constantsService: ConstantsService, public tcoDataService: TcoDataService, public permissionService: PermissionService, private utilitiesService: UtilitiesService) { }

    getPriceList(qualId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/priceList?qualId='+ qualId)
            .pipe(map(res => res));
        
    }
    getEaStartDate() {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/max-allowed-start-date')
            .pipe(map(res => res));
    }
      isPurchaseAdjustmentChanged(proposalId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +proposalId + '/adjusted');
    }


    getBillingModelDetails(proposalId?){
        if(proposalId){
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/billingmodel-metadata?p='+ proposalId)
            .pipe(map(res => res));
        } else {
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/billingmodel-metadata')
            .pipe(map(res => res));
        }
    }

    getCountryOfTransactions(qualId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/countries?qualId='+ qualId)
            .pipe(map(res => res));
    }

     // api call to check if coterm is allowed to show or not
     getCotermAllowed(){
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/co-term-allowed').pipe(map(res=>res));
    }

    getSubscriptionList(){
        // var pid: any = '';
        // if(this.proposalDataService.proposalDataObject.proposalId){
        //     pid = '&pid=' + this.proposalDataService.proposalDataObject.proposalId
        // }
        // return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions?qid='+ this.qualService.qualification.qualID +'&cid=' + this.appDataService.customerID + pid)
        //     .pipe(map(res => res));
        return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions?qid='+ this.qualService.qualification.qualID+ '&type=co-term').pipe(map(res => res));
    }

    subscriptionLookup(subId, qualification, renewalFlow?) {
        if (qualification) { // check if its qualification flow
            return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/search/'+ subId +'?cid=' + this.appDataService.customerID + '&type=change-sub').pipe(map(res => res));
        } else if(renewalFlow){
            return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/search/'+ subId + '?cid=' + this.appDataService.customerID + '&qid=' + this.qualService.qualification.qualID + '&type=RENEWAL').pipe(map(res => res));
        } 
      else {
        //     var pid: any = '';
        //     if (this.proposalDataService.proposalDataObject.proposalId) {
        //         pid = '&pid=' + this.proposalDataService.proposalDataObject.proposalId
        //     }
        //     return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/' + subId + '?qid=' + this.qualService.qualification.qualID + pid)
        //         .pipe(map(res => res));
        return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/search/'+ subId + '?cid=' + this.appDataService.customerID + '&qid=' + this.qualService.qualification.qualID + '&type=co-term').pipe(map(res => res));
        }
    }

   // api to get duration in months btw rsd and end date 
   durationMonths(rsd, end){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/duration?q='+ this.qualService.qualification.qualID + '&s=' + rsd + '&e=' + end).pipe(map(res => res));
}

checkIfMSPPartner(dealID,partnerID) {

    return this.http.get(this.appDataService.getAppDomain + 'api/partner/msp?dealId=' +dealID + '&partnerId=' + partnerID);

  }

    createProposal(reqJSON?) {
        let json;
        if(!reqJSON){
            json = {
                "data": {
                    "id": this.proposalDataService.proposalDataObject.proposalId,
                    //"userId": this.appDataService.userId,//private need to check
                    "qualId": this.qualService.qualification.qualID,
                    "name": this.proposalDataService.proposalDataObject.proposalData.name,
                    "desc": this.proposalDataService.proposalDataObject.proposalData.desc,
                    "countryOfTransaction": this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction,
                    "primaryPartnerName": "",
                    "eaStartDateStr": this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr,
                    "eaTermInMonths": this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths,
                    "billingModel": this.proposalDataService.proposalDataObject.proposalData.billingModel,
                    "priceList": this.proposalDataService.proposalDataObject.proposalData.priceList,
                    "partnerContacts": [],
                    "status": CreateProposalService.IN_PROGRESS_STATUS
                }
            }
        } else{
            json = reqJSON;
        }       
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/save', json)
            .pipe(map(res => res));
    }

    getProposalHeaderData(reqJSON) {
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/header', reqJSON)
            .pipe(map(res => res));
    }

    prepareSubHeaderObject(screenName, isProposalCreation: boolean, json) {


        this.getProposalHeaderData(json).subscribe((res: any) => {
            this.forceAttachProgramTerm = false;

            if(res && !res.error && res.data && res.data.partnerPurchaseAuthorized){
                this.isPartnerPurchaseAuthorized=res.data.partnerPurchaseAuthorized;
        }
            // if tcoflow unblock ui and stop chain 
            if (this.appDataService.tcoFlow) {
                this.blockUiService.spinnerConfig.unBlockUI();
                this.blockUiService.spinnerConfig.stopChainAfterThisCall();
            }
            
            this.proposalDataService.nonTransactionalRelatedSoftwareProposal = (res.data.nonTransactionalRelatedSoftwareProposal) ? true : false;
            
            // to check the mandatory suites count and assign to appdata service after the questionnaire update from edit modal
            if (res.data.noOfMandatorySuitesRequired !== undefined && res.data.noOfMandatorySuitesRequired > -1) {
                this.appDataService.noOfMandatorySuitesrequired = res.data.noOfMandatorySuitesRequired;
            }
            // set flag of whether proposal has any legacy suite
            this.proposalDataService.hasLegacySuites = res.data.hasLegacySuites;
            if(res.data.legacySuiteMap){
                this.proposalDataService.legacySuitesObj = res.data.legacySuiteMap
            } else {
                this.proposalDataService.legacySuitesObj = {};
            }
            // to check exception suite count and emit the value
            if (res.data.noOfExceptionSuitesRequired) {
                this.appDataService.noOfExceptionSuitesRequired = res.data.noOfExceptionSuitesRequired;
              } else {
                this.appDataService.noOfExceptionSuitesRequired = 0;
              }
              if(res.data.partnerDeal){
                this.qualService.loaData['partnerDeal'] = res.data.partnerDeal;
                this.isPartnerDeal = res.data.partnerDeal;
              }
            this.appDataService.includedPartialIbEmitter.emit(res.data.includedPartialIB); // comment this out and uncomment the below
            // check for includedPartialIB and set it
            // if (res.data.includedPartialIB) {
            //     this.appDataService.includedPartialIb = res.data.includedPartialIB;
            // }
            
            this.qualService.buyMethodDisti = res.data.buyMethodDisti ? true : false; // set buyMethodDisti flag
            // to emit noOfMandatorySuitesrequired suites count for checking suites count in proposal summary pgae 
            this.noOfSuitesCount.emit(this.appDataService.noOfMandatorySuitesrequired);
            this.constantsService.CURRENCY = res.data.currencyCode;
            // the customer id does not set in some scenarios which fails the qual header API
            this.appDataService.customerID = res.data.prospectKey;
            //Setting user access to read/write if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
            if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
                this.permissionService.proposalPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
            } else {
                this.permissionService.proposalPermissions.clear();
            }

              if (res.data.mspPartner) {
                this.isMSPSelected = true;
                this.proposalDataService.proposalDataObject.proposalData.mspPartner = true;
            }else {
                this.isMSPSelected = false;
                this.proposalDataService.proposalDataObject.proposalData.mspPartner = false;
            }



            //Renewal flag set 
           if (res.data.renewal) {
                this.appDataService.isRenewal = true;
            }else {
                this.appDataService.isRenewal = false;
            }

              //Renewal type set 
           if (res.data.renewal && res.data.followonType) {
                this.appDataService.followonType = res.data.followonType;
            }else {
                this.appDataService.followonType = '';
            }

            // check and set partnerBeGeoId to filter partner in manage teams
            this.proposalDataService.checkAndSetPartnerId(res.data.partner);

            if(res.data.demoProposal){
                this.proposalDataService.proposalDataObject.proposalData.demoProposal = true;
            }else{
                this.proposalDataService.proposalDataObject.proposalData.demoProposal = false;
            }

            // permission to show and allow compliance hold manual release
            this.permissionService.allowComplianceHold = this.permissionService.proposalPermissions.has(PermissionEnum.Compliance_Hold_Release);
            //Set local permission for debugger
            this.permissionService.isProposalPermissionPage(true);
            this.appDataService.isReadWriteAccess = (this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalViewOnly)) ? true : false;
            // set tco create access for tco 
            this.tcoDataService.tcoCreateAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;

            // flag to allow initiate followon
            this.appDataService.allowInitiateFollowOn = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalInitiateFollowon);

            // if ro super user and don't have access to the proposal set the disable mode 
            if (!this.appDataService.isReadWriteAccess && this.appDataService.userInfo.roSuperUser) {
                this.tcoDataService.disableMode = true;
            }
            
            if (!this.appDataService.isReadWriteAccess) {
                this.qualService.qualification.userEditAccess = false;
                this.proposalDataService.readOnlyState = true;
                this.proposalDataService.proposalDataObject.userEditAccess = false;
            }
            else {
                this.qualService.qualification.userEditAccess = true;
                this.proposalDataService.proposalDataObject.userEditAccess = true;
                this.qualService.readOnlyState = false;
            }
            // if ro super user and don't have access to the proposal set the disable mode 
            // if (res.data.userAccessType !== ConstantsService.USER_READ_WRITE_ACCESS && this.appDataService.userInfo.roSuperUser) {
            //     this.tcoDataService.disableMode = true;
            // }
            // this.appDataService.isReadWriteAccess = (res.data.userAccessType === ConstantsService.USER_READ_WRITE_ACCESS || this.appDataService.userInfo.rwSuperUser)  ? true : false;
            this.appDataService.subHeaderData.favFlag = false;
            this.appDataService.subHeaderData.moduleName = screenName;
            if (isProposalCreation) {

                if(res.data.coTerm){
                    this.proposalDataService.proposalDataObject.proposalData.coTerm = res.data.coTerm;
                }
                else {
                    this.proposalDataService.proposalDataObject.proposalData.coTerm = {'subscriptionId':  "", 'eaEndDate': "" , 'coTerm': false}
                }
                this.appDataService.subHeaderData.custName = res.data.name;
                const subHeaderAry = new Array<any>();
                //let dateToFormat = res.data.eaStartDateStr;
                //let year = dateToFormat.substring(0, 4);
                //let month = dateToFormat.substring(4, 6);
                //let day = dateToFormat.substring(6);
                //let dateFormed = this.MONTH[month] + " " + day + ", " + year;

                subHeaderAry.push(res.data.eaStartDateDdMmmYyyyStr);
                if(this.proposalDataService.proposalDataObject.proposalData.coTerm && this.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm){
                    subHeaderAry.push(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(res.data.eaTermInMonths)));
                } else {
                  subHeaderAry.push((res.data.eaTermInMonths));
                }
                subHeaderAry.push(res.data.priceList);
                subHeaderAry.push(res.data.billingModel);
                subHeaderAry.push(res.data.status);

                //Added Header data regarding Cross architecture
                subHeaderAry.push(res.data.architecture);
                subHeaderAry.push(res.data.hasLinkedProposal);
                subHeaderAry.push(res.data.archName);

                subHeaderAry.push(res.data.linkedProposals);
                subHeaderAry.push(res.data.dealId); // push the deal ID to subheader array to show on proposal header
                this.appDataService.dealID = res.data.dealId;
                this.qualService.qualification.dealId = this.appDataService.dealID;

                this.appDataService.subHeaderData.subHeaderVal = subHeaderAry;
                this.proposalDataService.selectedArchForQna = this.appDataService.subHeaderData.subHeaderVal[7];

                this.proposalDataService.proposalDataObject.proposalData.name = res.data.name;
                this.proposalDataService.proposalDataObject.proposalData.desc = res.data.desc;
                this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = res.data.eaTermInMonths;
                this.proposalDataService.proposalDataObject.proposalData.billingModel = res.data.billingModel;
                this.proposalDataService.proposalDataObject.proposalData.priceList = res.data.priceList
                this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr = res.data.eaStartDateStr;
                this.proposalDataService.proposalDataObject.proposalData.eaStartDateFormed = res.data.eaStartDateDdMmmYyyyStr;
                this.proposalDataService.proposalDataObject.proposalData.status = res.data.status;
                this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction = res.data.countryOfTransaction;
                this.proposalDataService.proposalDataObject.proposalData.partner = res.data.partner;
                this.proposalDataService.proposalDataObject.createdBy = res.data.userId;
                this.proposalDataService.proposalDataObject.proposalData.currencyCode = res.data.currencyCode;
                this.proposalDataService.proposalDataObject.proposalData.priceListId = res.data.priceListId;
                this.proposalDataService.proposalDataObject.proposalData.loaLanguageClarificationIds = res.data.loaLanguageClarificationIds ? res.data.loaLanguageClarificationIds : [];
                this.proposalDataService.proposalDataObject.proposalData.loaNonStdModificationIds = res.data.loaNonStdModificationIds ? res.data.loaNonStdModificationIds : [];
                
                // check and set loaQuestionSeletedValue for loa questionnaire
                this.appDataService.loaQuestionSeletedValue = res.data.specialLoaSigningRequired;

                // check and set proposal is CX eligible or not 
                if (res.data.cxEligible) {
                    this.proposalDataService.cxEligible = res.data.cxEligible;
                } else {
                    this.proposalDataService.cxEligible = false;
                }

                // check if CX allowed or not 
                if (res.data.cxAllowed) {
                    this.proposalDataService.cxAllowed = res.data.cxAllowed;
                } else {
                    this.proposalDataService.cxAllowed = true; // setting to true for now 
                }

               // check if cx proposal
                if (res.data.cxProposal) {
                    this.proposalDataService.cxProposalFlow = true;
                }else{
                    this.proposalDataService.cxProposalFlow = false;
                }


               // check if locc signed and allow cx proposal
               this.checkCxReasonCode(res.data.cxNotAllowedReasonCode);
                

                // get software proposal id for deep link
                if (res.data.relatedSoftwareProposalId) {
                    this.proposalDataService.relatedSoftwareProposalId = res.data.relatedSoftwareProposalId;
                } else {
                    this.proposalDataService.relatedSoftwareProposalId = null; // setting to true for now 
                }

                // get cx proposal id for deep link
                if (res.data.relatedCxProposalId) {
                    this.proposalDataService.relatedCxProposalId = res.data.relatedCxProposalId;
                } else {
                    this.proposalDataService.relatedCxProposalId = null; // setting to true for now 
                }

                // get software proposal archName for deep link
                if (res.data.relatedSoftwareArchName) {
                    this.proposalDataService.relatedSoftwareProposalArchName = res.data.relatedSoftwareArchName;
                } else {
                    this.proposalDataService.relatedSoftwareProposalArchName = null; // setting to true for now 
                }

                if (res.data.archName) {
                    this.proposalDataService.proposalDataObject.proposalData.archName = res.data.archName;
                    this.appDataService.archName = res.data.archName;
                }
                // res.data.countryOfTransaction

                if(res.data.renewalParams){
                    this.proposalDataService.linkedRenewalSubscriptions = res.data.renewalParams;
                } else {
                    this.proposalDataService.linkedRenewalSubscriptions = [];
                }

                // check if cx suites are selected and set isAnyCxSuiteSelected
                if (res.data.cxSuites){
                    this.proposalDataService.isAnyCxSuiteSelected = true;
                } else {
                    this.proposalDataService.isAnyCxSuiteSelected = false;
                }

                this.loCCSignedCheck(res)

                
                // check for proposal status and set the respective flags
                if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.IN_PROGRESS_STATUS) {
                    this.appDataService.roadMapPath = false;
                    this.appDataService.isProposalPending = false;
                    this.appDataService.isPendingAdjustmentStatus = false;
                } else if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS) {
                    this.appDataService.roadMapPath = true;
                    this.appDataService.isProposalPending = false;
                    this.appDataService.isPendingAdjustmentStatus = false;
                } else if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PENDING_APPROVAL) {
                    // set roadMapPath & withdraw request if proposal is in pending approval or pending adjustment approval status
                    this.appDataService.roadMapPath = true;
                    this.appDataService.isProposalPending = true;
                    this.appDataService.isPendingAdjustmentStatus = false;
                } else if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_IN_PROGRESS || this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_APPROVAL_SUBMISSION_PENDING || this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_APPROVAL_IN_PROGRESS) {
                    this.appDataService.roadMapPath = true;
                    this.appDataService.isProposalPending = false;
                    this.appDataService.isPendingAdjustmentStatus = true;
                }
                //Added data regarding Cross architecture
                this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList = Array<LinkedProposalInfo>();
                
                //Default value as false
                this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch =  false;
                this.proposalDataService.proposalDataObject.proposalData.isOneOfStatusCompleteCrossArch =  false;

                //Incase status incosistence
                if (res.data.linkParamChanged) {
                      this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch =  true;
                }else {
                      this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch =  false;
                }
                
                if (res.data.hasLinkedProposal && res.data.linkedProposals) 
                {
                    this.proposalDataService.proposalDataObject.proposalData.groupId = res.data.groupId;
                    this.proposalDataService.proposalDataObject.proposalData.groupName = res.data.groupName

                    for (let _object of res.data.linkedProposals) 
                    {
                        let _proposalInfo: LinkedProposalInfo = _object;

                        // If any proposal status is incomplete in cross architecture then show message in doc center  
                        if (_proposalInfo.status !== this.constantsService.COMPLETE_STATUS) {
                            this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch =  true;
                        }
                          // If any proposal status is complete in cross architecture then allow all proposal download 
                        if (_proposalInfo.status === this.constantsService.COMPLETE_STATUS) {
                            this.proposalDataService.proposalDataObject.proposalData.isOneOfStatusCompleteCrossArch =  true;
                        }
                        if(_proposalInfo.architecture_code === this.constantsService.SECURITY) {
                            if (_proposalInfo.status !== this.constantsService.COMPLETE_STATUS) {
                               this.proposalDataService.isSecurityInprogressinCrossArch = true; 
                            }
                          this.proposalDataService.isSecurityIncludedinCrossArch = true;
                        }
                        this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList.push(_proposalInfo);
                    }
                }
                this.proposalDataService.proposalDataObject.proposalData.isCrossArchitecture = res.data.hasLinkedProposal;
                this.proposalDataService.proposalDataObject.proposalData.architecture = res.data.architecture;

                if (!res.data.loccNotRequired) {
                    this.proposalDataService.isLoccRequired = true;
                  } else {
                    this.proposalDataService.isLoccRequired = false;
                  }
                  if (res.data.brownfieldPartner) {
                    this.proposalDataService.isBrownfieldPartner = true;
                } else {
                    this.proposalDataService.isBrownfieldPartner = false;
                }  
            }
            else {
                this.appDataService.subHeaderData.subHeaderVal = null;
            }
            if(res.data.forceAttachProgramTerm){
                this.forceAttachProgramTerm = res.data.forceAttachProgramTerm;
            } else {
                this.forceAttachProgramTerm = false;
            }
            // check and set linkId
            this.proposalDataService.proposalDataObject.proposalData.linkId = res.data.linkId ? res.data.linkId : 0;
            this.checkToAllow84MonthsTerm(res.data.suiteIds);
            
            this.appDataService.headerDataLoaded.emit();
            // emit tcodata emitter after header loaded to send required data
            this.appDataService.tcoData.emit({'isRwAccess': this.appDataService.isReadWriteAccess, 'rwSuperUser': this.appDataService.userInfo.rwSuperUser, 'disableMode': this.tcoDataService.disableMode, 'tcoCreateAccess': this.tcoDataService.tcoCreateAccess});
        });
    }

    updateHeaderStartDate() {
        let json = {
            'data': {
              'id': this.proposalDataService.proposalDataObject.proposalId,
              'qualId': this.qualService.qualification.qualID
            }
          };
        this.getProposalHeaderData(json).subscribe((res: any) => {
            if(res && !res.error && res.data && res.data.eaStartDate){
                this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr = res.data.eaStartDateStr;
                this.proposalDataService.proposalDataObject.proposalData.eaStartDateFormed = res.data.eaStartDateDdMmmYyyyStr;               
                this.appDataService.subHeaderData.subHeaderVal[0] = res.data.eaStartDateDdMmmYyyyStr; 
            }
        })
    }
    checkToAllow84MonthsTerm(suitesArray){
        if((this.appDataService.archName === 'C1_DC' || this.appDataService.archName === 'CX') && this.allow84MonthTerm(suitesArray)){
            this.proposalDataService.allow84Term = true;
        } else {
            this.proposalDataService.allow84Term = false;
        }
    }

    allow84MonthTerm(suitesArray){
        if(suitesArray.includes(22) || suitesArray.includes(23) || suitesArray.includes(24) || suitesArray.includes(51) || suitesArray.includes(43)){
           return false;
        }else if(suitesArray.includes(17) || suitesArray.includes(41) || suitesArray.includes(42) || suitesArray.includes(19) || suitesArray.includes(107)){
            return true;
        }
    }
       
  loCCSignedCheck(response) {

    var signatureSigned = true;

    if (response.data && response.data.loccSigned) {
           signatureSigned = true;
    } else {
           signatureSigned = false;
      if (response.data.loccInitiated) {
        //Incase locc is pending signature
        this.qualService.loaData.document = {};
        this.qualService.loaData.document.status = ConstantsService.PENDING_STATUS;
      } else {
        this.qualService.loaData.document = {};
      }
    }
    this.qualService.loaData.loaSigned = signatureSigned;

  }


    updateProposalStatus() {
        const json = {
            "data": {
                "id": this.proposalDataService.proposalDataObject.proposalId,
                //"userId": this.appDataService.userId,//private need to check
                "qualId": this.qualService.qualification.qualID,
                "name": this.proposalDataService.proposalDataObject.proposalData.name,
                "desc": this.proposalDataService.proposalDataObject.proposalData.desc,
                "countryOfTransaction": this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction,
                "primaryPartnerName": "",
                "eaStartDateStr": this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr,
                "eaTermInMonths": this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths,
                "billingModel": this.proposalDataService.proposalDataObject.proposalData.billingModel,
                "priceList": this.proposalDataService.proposalDataObject.proposalData.priceList,
                "partnerContacts": [],
                "status": CreateProposalService.IN_PROGRESS_STATUS
            }
        }
        this.createProposal(json).subscribe((res: any) => {
            if (res && !res.error && res.data) {
                this.appDataService.subHeaderData.subHeaderVal[4] = res.data.status;
                this.proposalDataService.proposalDataObject.proposalData.status = res.data.status;
            } else {
                this.messageService.displayMessagesFromResponse(res);
            }
        });
    }

    partnerAPI(qualId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/partners?q=' + qualId) // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/partners?u='+ this.appDataService.userId + '&q=' + this.qualService.qualification.qualID)
            .pipe(map(res => res));
    }

    // to get selected partner details for proposal
    getPartnerForProposal(proposalId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/partner?p=' + proposalId) // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/partners?u='+ this.appDataService.userId + '&q=' + this.qualService.qualification.qualID)
            .pipe(map(res => res));
    }
    checkCxReasonCode(code){
        if(code){
            this.proposalDataService.cxNotAllowedReasonCode =  code;
            this.proposalDataService.cxNotAllowedMsg = CxCodeEnum[code];
        } else {
            this.proposalDataService.cxNotAllowedMsg = '';
            this.proposalDataService.cxNotAllowedReasonCode = '';
        }
    }

    checkCustomDurationWarning(val){  
        //not showing Custom Duration warning between 36-60 and showing for less than 36 months and DNA Custom duration warning for greater than 60
        if (val !== ConstantsService.PROPOSAL_STANDARD_DURATION_MIN_VALUE && val !== ConstantsService.PROPOSAL_STANDARD_DURATION_MAX_VALUE && val < ConstantsService.PROPOSAL_STANDARD_DURATION_MIN_VALUE ) {
              
            return true;          
        }
        else{
          return false;  
        }
      }

      // method to check custom duration grater than 60 months
      checkCustomDurationForGreaterThan60(val){  
        if (val > ConstantsService.PROPOSAL_STANDARD_DURATION_MAX_VALUE ) {   
            return true;          
        }
        else{
          return false;  
        }
      }

    // checkDNACustomDurationWarning(val){

    //     if (val > ConstantsService.PROPOSAL_STANDARD_DURATION_MAX_VALUE) {
    //       return true;          
    //     }
    //     else{
    //       return false;  
    //     }
    //   }

      updateProposalFromModal(json){
        return this.http.put(this.appDataService.getAppDomain + 'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/workflow-immutable-parameter', json) 
        .pipe(map(res => res));
      }

    // api to get maxAndDefaultStartDate
    maxAndDefaultStartDate(id?) {
        if(id){
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/max-and-default-start-date?p='+ id)
            .pipe(map(res => res));
        } else {
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/max-and-default-start-date')
            .pipe(map(res => res));
        }
        
    }
}

export enum CxCodeEnum {
    LOCC_NOT_SIGNED = 'Since the LOCC is not signed for this proposal, you are not eligible to purchase services in this proposal',
    DISTI_LED = 'Suites in this proposal are eligible to get CX support',//dummy msg update once US is updated
}