import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from '@app/qualifications/qualifications.service';

@Component({
  selector: 'app-subscription-access',
  templateUrl: './subscription-access.component.html',
  styleUrls: ['./subscription-access.component.scss']
})
export class SubscriptionAccessComponent implements OnInit {

  constructor(  
    public activeModal: NgbActiveModal,
    public qualService: QualificationsService) { }

  ngOnInit() {
  }

   // method to close the modal and reset all the values
   cancel() {
    this.activeModal.close({
      continue: false
    });
  }

}
