import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EditDealIdComponent } from '../../modal/edit-deal-id/edit-deal-id.component';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-edit-warning',
  templateUrl: './edit-warning.component.html',
  styleUrls: ['./edit-warning.component.scss']
})
export class EditWarningComponent implements OnInit {
  confirmEdit = false;

  constructor(public localeService: LocaleService, private modalVar: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  continueEdit() {
    this.activeModal.close();
    const modalRef = this.modalVar.open(EditDealIdComponent, { windowClass: 'editDeal' });
  }

}
