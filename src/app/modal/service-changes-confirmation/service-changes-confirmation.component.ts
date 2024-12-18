import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service-changes-confirmation',
  templateUrl: './service-changes-confirmation.component.html',
  styleUrls: ['./service-changes-confirmation.component.scss']
})
export class ServiceChangesConfirmationComponent implements OnInit {
  mangeServiceConfirmation: boolean;
  message = '';
  isFromSummaryPage = false;

  constructor(public activeModal:NgbActiveModal) { }

  ngOnInit() {
    if (this.mangeServiceConfirmation) {
      this. message = 'Service Specialist';
    } else {
      this. message = 'Partner Information';
    }
  }

  close() {
    this.activeModal.close();
  }

}
