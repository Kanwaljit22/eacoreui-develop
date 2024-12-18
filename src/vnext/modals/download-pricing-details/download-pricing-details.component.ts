import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-pricing-details',
  templateUrl: './download-pricing-details.component.html',
  styleUrls: ['./download-pricing-details.component.scss']
})
export class DownloadPricingDetailsComponent {

  constructor( public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }

  download(type) {

    this.activeModal.close({
      type: type
    })
  }

}
