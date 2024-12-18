import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-download-customer-scope',
  templateUrl: './download-customer-scope.component.html',
  styleUrls: ['./download-customer-scope.component.scss']
})
export class DownloadCustomerScopeComponent {
  @Input() downloadVersionData = [];
  selectedVersion: any;
  noDataFound = false;

  constructor(public messageService: MessageService,public ngbActiveModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, private eaRestService: EaRestService, public vNextService: VnextService, public eaIdStoreService: EaidStoreService, public elementIdConstantsService: ElementIdConstantsService) {
  }

  close() {
    this.messageService.disaplyModalMsg = false;
    this.ngbActiveModal.close({
    });
  }

  selectVersion(data) {
    this.selectedVersion = data;
  }

  download() {
    this.messageService.disaplyModalMsg = false;
    this.ngbActiveModal.close({
      selectedVersion: this.selectedVersion
    });
    
  }

}