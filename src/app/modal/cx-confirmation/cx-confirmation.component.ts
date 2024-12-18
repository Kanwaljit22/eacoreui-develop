import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cx-confirmation',
  templateUrl: './cx-confirmation.component.html',
  styleUrls: ['./cx-confirmation.component.scss']
})
export class CxConfirmationComponent implements OnInit {
  isCheckboxSelected = false;

  constructor(public activeModal: NgbActiveModal , public router: Router) { }

  ngOnInit() {
  }

  checkboxSelection(){
    this.isCheckboxSelected = !this.isCheckboxSelected;
  }
  close() {
    this.activeModal.close();
  }

  continue() {
    this.activeModal.close({
      continue: true
    });
  }

  openProposalList() {
    
      this.activeModal.close();
      this.router.navigate(['qualifications/proposal']);
  }

}
