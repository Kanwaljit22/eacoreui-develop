import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaStoreService } from 'ea/ea-store.service';

@Component({
  selector: 'app-eligibility-status',
  templateUrl: './eligibility-status.component.html',
  styleUrls: ['./eligibility-status.component.scss']
})
export class EligibilityStatusComponent implements OnInit {

  constructor(public ngbActiveModal: NgbActiveModal, public priceEstimateService: PriceEstimateService, private vnextService: VnextService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService,
    public proposalStoreService: ProposalStoreService, private proposalRestService: ProposalRestService, public utilitiesService: UtilitiesService ,public localizationService:LocalizationService, private eaStoreService: EaStoreService) { }
  programEligibilityData: any = {}
  totalFcCount = 0;
  totalPcCount = 0;
  percentage = 0;
  widthForProgressBar = {
    "width":'0%'
  };
  pcEnrollmentNames = []; // set to store entrollemnt names of  0 fccount
  pcPrimaryEnrollments = []; // push primary enrollments that are partial commited
  primaryEnrollmentsPresent = []; //push primary enrollments present in data
  isOnlySecurityPresent = false; // set if only security only enrolled
  showEligibleMsg = false; // set if to show hurray message
  isSpnaProposal = false;// set if spna flow and spna featureflag

  ngOnInit() {
    this.eaService.getLocalizedString('eligibility-status');
    if(this.eaService.isSpnaFlow && this.eaService.features.SPNA_REL){
      this.isSpnaProposal = true;
    } else {
      this.isSpnaProposal = false;
    }
    this.getProgramEligibilityData();
  }
  getProgramEligibilityData() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {       
        this.programEligibilityData = response.data;
        this.checkSecurityPresent(); // to check if only security enrolled
        this.calcuclatePercentage();
        this.getTotalSuiteCount();
        if(this.isSpnaProposal){
          this.showEligibleMsg = (this.programEligibilityData.proposal?.programEligibility && this.programEligibilityData.proposal?.programEligibility?.eligible) ? true : false;
        } else {
          this.checkToShowEligible(); // to check if fully eligible
        }
      }
    });
  }

  getTotalSuiteCount(){
    this.programEligibilityData.enrollments.forEach(enrollment => {
      if(enrollment.commitInfo){
        if (enrollment.primary){
          this.primaryEnrollmentsPresent.push(enrollment)
        }
        if(enrollment.commitInfo.fcSuiteCount){
          this.totalFcCount = this.totalFcCount +  enrollment.commitInfo.fcSuiteCount;
        }
        if(enrollment.commitInfo.pcSuiteCount){
          this.totalPcCount = this.totalPcCount +  enrollment.commitInfo.pcSuiteCount;
        }

        // set to store entrollemnt names of  0 fccount
        if (!enrollment.commitInfo.fcSuiteCount){
          if (enrollment.primary){
            this.pcPrimaryEnrollments.push(enrollment.name);
          }
          this.pcEnrollmentNames.push(enrollment.name);
        }
      }
    });
  }

  // convert array data to string
  setEnrollmentNamesString(enrollments){
    let enrollmentNamesString = ''
    if (enrollments.length){
      enrollmentNamesString = enrollments.toString();
    }
    return enrollmentNamesString;
  }

  calcuclatePercentage(){
    if ((this.eaService.isResellerLoggedIn || (this.proposalStoreService.isPartnerAccessingSfdcDeal && this.eaStoreService.userInfo?.distiUser) || (this.proposalStoreService.proposalData?.hideCollabPartnerNetPriceInfo)) && this.programEligibilityData.proposal.commitInfo && this.programEligibilityData.proposal.commitInfo?.achievedCommitPercentage) {
      this.percentage = this.programEligibilityData.proposal.commitInfo.achievedCommitPercentage;
    } else {
      if (this.programEligibilityData.proposal.commitInfo && this.programEligibilityData.proposal.commitInfo.fullCommitTcv && this.programEligibilityData.proposal.commitInfo.threshold) {
        if (this.programEligibilityData.proposal.commitInfo.fullCommitTcv > this.programEligibilityData.proposal.commitInfo.threshold) {
          this.percentage = 100;
        } else {
          this.percentage = Math.trunc((this.programEligibilityData.proposal.commitInfo.fullCommitTcv / this.programEligibilityData.proposal.commitInfo.threshold) * 100)
        }
        this.widthForProgressBar.width = '' + this.percentage + '%'
      }
    }
  }

  close() {
    this.ngbActiveModal.close();
  }

  continue() {
    this.ngbActiveModal.close();
  }

  // to show orange icon -- if any enrollment not commited and only security enrolled
  showWarnStatus(enrollment){
    if(!enrollment.commitInfo?.committed && (!enrollment.primary && !this.isOnlySecurityPresent)){
      return true;
    }
    return false;
  }
  
  // to show red icon if only security present and portfolio not committed
  setDangerStatus(enrollment){
    if(!enrollment.commitInfo?.committed && ((!enrollment.primary && this.isOnlySecurityPresent) || (enrollment.primary && !this.isOnlySecurityPresent))){
      return true;
    }
    return false;
  }

  // to check if only security enrolled
  checkSecurityPresent() {
    if (this.programEligibilityData.enrollments.length === 1 && !this.programEligibilityData.enrollments[0].primary && (this.programEligibilityData.enrollments[0].id === 3)){
      this.isOnlySecurityPresent = true;
    }
  }


  // to check if fully eligible
  checkToShowEligible(){
      if (this.percentage === 100 && (this.isOnlySecurityPresent || (!this.isOnlySecurityPresent && !this.pcPrimaryEnrollments.length))){
        this.showEligibleMsg = true;
      }
  }
}
