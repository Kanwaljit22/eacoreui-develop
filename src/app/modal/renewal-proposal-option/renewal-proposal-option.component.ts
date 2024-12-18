import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-renewal-proposal-option',
  templateUrl: './renewal-proposal-option.component.html',
  styleUrls: ['./renewal-proposal-option.component.scss']
})
export class RenewalProposalOptionComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  renewal(val) {
    if (val === 'renewal') {
      this.activeModal.close({
        renewal: true
      });
    } else {
      this.activeModal.close({
        renewal: false
      });
    }
  }

  close() {
      this.activeModal.close({
      });
  }

}
