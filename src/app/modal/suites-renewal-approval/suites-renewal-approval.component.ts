import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-suites-renewal-approval',
  templateUrl: './suites-renewal-approval.component.html',
  styleUrls: ['./suites-renewal-approval.component.scss']
})
export class SuitesRenewalApprovalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

    cancel(){

    this.activeModal.close({
      continue: false
    });

  }

  continue(){

    this.activeModal.close({
      continue: true
    });

  }

}
