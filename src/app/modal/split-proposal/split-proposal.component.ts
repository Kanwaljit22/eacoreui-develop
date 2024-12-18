import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '@app/permission.service';

@Component({
  selector: 'app-split-proposal',
  templateUrl: './split-proposal.component.html',
  styleUrls: ['./split-proposal.component.scss']
})
export class SplitProposalComponent implements OnInit {
  disableSplit = false;

  constructor(public activeModal: NgbActiveModal, private permissionService: PermissionService) { }

  ngOnInit() {
    // check for split flag and set the disable flag
    if (!this.permissionService.proposalSplit) {
      this.disableSplit = true;
    } else {
      this.disableSplit = false;
    }
  }

  continue() {
    this.activeModal.close({
      continue: true
    });
  }

  close() {
    this.activeModal.close({
    });
  }

}
