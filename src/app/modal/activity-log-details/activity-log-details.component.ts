import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-activity-log-details',
  templateUrl: './activity-log-details.component.html',
  styleUrls: ['./activity-log-details.component.scss']
})
export class ActivityLogDetailsComponent implements OnInit {

  @Input() jsonObj = {};
  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
