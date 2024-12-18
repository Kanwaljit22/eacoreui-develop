import { UtilitiesService } from '@app/shared/services/utilities.service';
import { Component, OnInit } from '@angular/core';
import { NgbModalOptions,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOptionsComponent } from '@app/modal/purchase-options/purchase-options.component';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
@Component({
  selector: 'app-ea-purchases',
  templateUrl: './ea-purchases.component.html',
  styleUrls: ['./ea-purchases.component.scss']
})
export class EaPurchasesComponent implements OnInit {

  message = '';
  partnerLedFlow  =  false;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  constructor(private modalVar: NgbModal ,public createProposalService: CreateProposalService,public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.partnerLedFlow = this.createProposalService.isPartnerDeal;
    if(this.partnerLedFlow) {
      this.message = 'to check your Cisco EA Authorizations.';
    } else {
      this.message = 'to check Cisco EA Authorizations for selected Partner.';
    }
  }

  openPurchase() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'purchase-options';
    const modalRef = this.modalVar.open(PurchaseOptionsComponent,  ngbModalOptionsLocal );   
  }

}
