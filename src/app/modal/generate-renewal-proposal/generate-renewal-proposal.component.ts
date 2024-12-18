import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-generate-renewal-proposal',
  templateUrl: './generate-renewal-proposal.component.html',
  styleUrls: ['./generate-renewal-proposal.component.scss']
})
export class GenerateRenewalProposalComponent implements OnInit {

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
