import { Component,Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

import { LocalizationService } from 'vnext/commons/services/localization.service';
import { IReferrerQuotes } from 'vnext/project/project-store.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-select-a-quote',
  templateUrl: './select-a-quote.component.html',
  styleUrls: ['./select-a-quote.component.scss']
})
export class SelectAQuoteComponent implements OnInit{

  @Input() associatedQuotes:Array<IReferrerQuotes>;
  @Input() dealId: string;
  selectedQuote:IReferrerQuotes;
  displayQuoteName = false;
  
  constructor(public ngbActiveModal: NgbActiveModal, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService) {
  }

   ngOnInit(): void {
   }

  
  close() {
    this.ngbActiveModal.close({
      selectedQuote : this.selectedQuote
    });
 }

 updateQuoteDetail(quoteDetails:IReferrerQuotes){
   this.selectedQuote = quoteDetails
 }

}
