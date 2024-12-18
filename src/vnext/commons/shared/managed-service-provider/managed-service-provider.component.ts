import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

@Component({
  selector: 'app-managed-service-provider',
  templateUrl: './managed-service-provider.component.html',
  styleUrls: ['./managed-service-provider.component.scss']
})
export class ManagedServiceProviderComponent implements OnInit {
  isSoldThroughMsp: boolean;
  @Output() updateMspSelection = new EventEmitter();
  @Input() isEditProposal: boolean;
  @Input() isMsea: boolean;
  @Input() isChangeSubFlow: boolean;
  showMspInfo = false;
  contractNumber: string;
  selectedEntitled: string;
  isProviderEntitled:string;
  isInflightProposal = false;

  constructor(public localizationService: LocalizationService, public proposalStoreService: ProposalStoreService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService, public constantsService: ConstantsService) { }

  ngOnInit(): void {
    if (this.eaService.features.MSEA_REL) {
      if (this.isChangeSubFlow && this.proposalStoreService.mspInfo?.entitlementType) {
        this.isProviderEntitled = this.proposalStoreService.mspInfo?.entitlementType;
      }
      if(this.isEditProposal) {
        if ((!this.proposalStoreService.proposalData?.buyingProgramTransactionType || this.proposalStoreService.proposalData?.buyingProgramTransactionType === null ) && this.proposalStoreService.mspInfo?.mspPartner) {
          this.isInflightProposal = true;
        } else {
          this.isInflightProposal = false;
        }
        this.selectedEntitled = this.proposalStoreService.mspInfo?.entitlementType;
        this.isSoldThroughMsp = (this.proposalStoreService.proposalData?.buyingProgramTransactionType === this.constantsService.MSP_EA) ? false : true;
        this.proposalStoreService.mspInfo.managedServicesEaPartner = (this.proposalStoreService.proposalData?.buyingProgramTransactionType === this.constantsService.MSP_EA) ? false : true;
        this.isProviderEntitled = this.proposalStoreService.mspInfo?.entitlementType;
      } else {
          if (!this.isChangeSubFlow && this.proposalStoreService.mspInfo?.managedServicesEaPartner) {
            this.proposalStoreService.mspInfo.managedServicesEaPartner = false;
          }
      }
    }
  }

  changeMsp(event) {
    if(this.proposalStoreService.isReadOnly){
      return;
    }

    if (event.target.id === 'yes') {
      this.proposalStoreService.mspInfo.mspProposal = true;
      this.showMspInfo = true;
      this.proposalStoreService.mspInfo.managedServicesEaPartner = true;
    } else {
      this.proposalStoreService.mspInfo.mspProposal = false;
      this.showMspInfo = false;
      this.proposalStoreService.mspInfo.managedServicesEaPartner = false;
    }
    if (this.isEditProposal) {
      if (this.eaService.features.MSEA_REL && this.isSoldThroughMsp !== this.proposalStoreService.mspInfo?.managedServicesEaPartner && this.proposalStoreService.proposalData?.buyingProgramTransactionType) {
        this.updateMspSelection.emit(true);
      } else {
        this.updateMspSelection.emit(); 
      }
    }
  }

  changeEntitlement(event) {
    if(this.proposalStoreService.isReadOnly){
      return;
    }
    
    if (event.target.id === this.constantsService.PROVIDER) {
      this.proposalStoreService.mspInfo.entitlementType = this.constantsService.PROVIDER_ENTITLED;
      this.isProviderEntitled = this.constantsService.PROVIDER_ENTITLED;
    } else {
      this.proposalStoreService.mspInfo.entitlementType = this.constantsService.MANAGED_SERVICES;
      this.isProviderEntitled = this.constantsService.MANAGED_SERVICES;
    }
    if (this.isEditProposal) {
        this.updateMspSelection.emit();
    }
  }
}
