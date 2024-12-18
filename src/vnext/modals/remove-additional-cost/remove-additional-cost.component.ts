import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';
import { TcoService } from 'vnext/tco/tco.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-remove-additional-cost',
  templateUrl: './remove-additional-cost.html',
  styleUrls: ['./remove-additional-cost.component.scss']
})
export class RemoveAdditionalCostComponent {
  public additionalCost: any

  constructor(
    public activeModal: NgbActiveModal, 
    private eaRestService: EaRestService, 
    public tcoStoreService: TcoStoreService,
    public tcoService: TcoService,
    public vnextService: VnextService
  ) {}

  removeCost(){
    const url = `proposal/tco/${this.tcoStoreService.tcoData.objId}/additional-cost/${this.additionalCost.id}`;
    this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.tcoStoreService.tcoData = response.data;
        this.tcoService.mapTcoData();
        this.tcoService.refreshGraph.next(true);
        this.close();
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
