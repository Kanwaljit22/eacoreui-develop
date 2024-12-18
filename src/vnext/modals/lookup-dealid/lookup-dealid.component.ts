import { ProjectStoreService } from 'vnext/project/project-store.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'vnext/commons/message/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VnextService } from 'vnext/vnext.service';
import { Router } from '@angular/router';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';


@Component({
  selector: 'app-lookup-dealid',
  templateUrl: './lookup-dealid.component.html',
  styleUrls: ['./lookup-dealid.component.scss']
})
export class LookupDealidComponent implements OnInit, OnDestroy {
  dealId = '';

  constructor(private projectStoreService: ProjectStoreService, private eaService: EaService,
    private messageService: MessageService, private activeModal: NgbActiveModal, private vnextService:VnextService, private router: Router
    , public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('lookup-dealid');
    //for displaying msg on popup
    this.messageService.disaplyModalMsg = true;
  }
  ngOnDestroy(){
    this.messageService.disaplyModalMsg = false;
  }

  lookUpDeal() {
    this.messageService.modalMessageClear();
    const requestObj = { data: {
      dealId: this.dealId
    }
   }
   this.dealId = this.dealId.trim();
   this.router.navigateByUrl('eamp?did=' + btoa(this.dealId));
   this.activeModal.close();
    // this.vNextRestService.lookupDeal(requestObj).subscribe((response: any) => {
    //   if(this.vnextService.isValidResponseWithData(response)) {
    //     this.projectStoreService.projectData = response.data;
    //     this.activeModal.close(this.dealId);
    //   }
    // });
  }
}
