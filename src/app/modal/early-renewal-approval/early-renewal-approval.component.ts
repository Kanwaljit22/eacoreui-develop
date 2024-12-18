import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-early-renewal-approval',
  templateUrl: './early-renewal-approval.component.html',
  styleUrls: ['./early-renewal-approval.component.scss']
})
export class EarlyRenewalApprovalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  message: any;

  ngOnInit() {
  }

  continue(){
    this.activeModal.close({
      continue: true
    });
  }

  close(){
    this.activeModal.close({});
  }
}
