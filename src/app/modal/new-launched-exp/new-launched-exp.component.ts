import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-launched-exp',
  templateUrl: './new-launched-exp.component.html',
  styleUrls: ['./new-launched-exp.component.scss']
})
export class NewLaunchedExpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  continue() {
    this.activeModal.close({
      continue: true
    });
  }

}
