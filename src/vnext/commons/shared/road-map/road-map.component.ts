import { LocalizationEnum } from './../../../../ea/commons/enums/localizationEnum';
import { Component, OnInit } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-road-map',
  templateUrl: './road-map.component.html',
  styleUrls: ['./road-map.component.scss']
})
export class RoadMapComponent implements OnInit {
  roadmapArr = [];
  currentStep = 0;

  constructor(public localizationService: LocalizationService, public vnextService: VnextService, public proposalStoreService: ProposalStoreService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      const valueFound = this.eaService.locationUpdateRequired(key)
      if (valueFound){
        this.loadRoadMapArray();
      }
    });
    this.loadRoadMapArray();
  }

  loadRoadMapArray() {
    this.roadmapArr = [ 
      {
        "id": 0,
        "name": this.localizationService.getLocalizedString('common.PROJECT')
      },
      {
        "id": 1,
        "name": this.localizationService.getLocalizedString('common.RENEWAL_SUBSCRIPTIONS')
      },
      {
        "id": 2,
        "name": this.localizationService.getLocalizedString('common.PROPOSAL_DETAILS')
      },
      {
        "id": 3,
        "name": this.localizationService.getLocalizedString('common.PRICE_ESTIMATION')
      },
      {
        "id": 4,
        "name": this.localizationService.getLocalizedString('common.PROPOSAL_SUMMARY')
      }
    ]
  }
  showRoadMap(map) {
    this.vnextService.roadmapSubject.next(map);
  }

  isClass(i) {
    if (this.vnextService.roadmapStep > i) {
      return 'completed'
    }
    else if (this.vnextService.roadmapStep === i || (this.proposalStoreService.proposalData.status === 'COMPLETE' && this.vnextService.roadmapStep < i) || (this.proposalStoreService.proposalData.objId && i === 3 )) {
      return 'active';
    } 
  }

}
