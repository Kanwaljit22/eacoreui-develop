import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

@Component({
  selector: 'app-master-agreement',
  templateUrl: './master-agreement.component.html',
  styleUrls: ['./master-agreement.component.scss']
})
export class MasterAgreementComponent implements OnInit {

  @Output() updateMsaSelection = new EventEmitter();
  @Input() isEditProposal: boolean;
  contractNumber: string;
  showContractNumber = false;

  constructor(public localizationService: LocalizationService, public proposalStoreService: ProposalStoreService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService, public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    if(this.isEditProposal && this.proposalStoreService.masterAgreementInfo?.masterAgreement && this.proposalStoreService.masterAgreementInfo?.contractNumber && this.eaService.isSpnaFlow){
      this.contractNumber = this.proposalStoreService.masterAgreementInfo.contractNumber;
      this.showContractNumber = true;
    }
  }

  changeMsa(event) {
    if (event.target.id === 'yes') {
      this.proposalStoreService.masterAgreementInfo.masterAgreement = true;
      this.showContractNumber = true;
    } else {
      this.proposalStoreService.masterAgreementInfo.masterAgreement = false;
      this.showContractNumber = false;
      // if(this.proposalStoreService.masterAgreementInfo?.contractNumber){
      //   this.proposalStoreService.masterAgreementInfo.contractNumber = '';
      // }
    }
    if (this.isEditProposal) {
      this.updateMsaSelection.emit(false);
    }
  }

  updateContractNumber($event){
    if(!$event.target.value.trim()){
      this.contractNumber = '';
      this.proposalStoreService.masterAgreementInfo.contractNumber = '';
    } else {
      this.proposalStoreService.masterAgreementInfo.contractNumber = this.contractNumber;
    }
    if (this.isEditProposal) {
      this.updateMsaSelection.emit(true);
    }
  }
}
