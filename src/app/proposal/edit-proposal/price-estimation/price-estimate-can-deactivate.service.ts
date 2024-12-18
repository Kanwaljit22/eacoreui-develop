import { Router } from '@angular/router';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { PriceEstimationComponent } from './price-estimation.component';
import { TcoWarningComponent } from '@app/modal/tco-warning/tco-warning.component';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PriceEstimateCanDeactivateGuard implements CanDeactivate<PriceEstimationComponent> {

  constructor(public priceEstimationService: PriceEstimationService, private modalVar: NgbModal, private router: Router
  ) { }
  canDeactivate(target: PriceEstimationComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    let currentRoute = this.router;
    let urlToNavigate = nextState.url;
    // if (this.priceEstimationService.isContinue) {
    //     const modalRef = this.modalVar.open(TcoWarningComponent, {
    //         windowClass: 'infoDealID'
    //       });
    //       modalRef.result.then(result => {
    //         if (result.continue === true) {
    //             this.priceEstimationService.isContinue = false;
    //             // this.priceEstimationService.recalculatePrice(function(){currentRoute.navigate([urlToNavigate])});
    //             this.priceEstimationService.recalculateAll()
    //             .subscribe((response: any) => {
    //               if (response) {
    //                 if (response.messages && response.messages.length > 0) {
    //                   this.priceEstimationService.messageService.displayMessagesFromResponse(
    //                     response
    //                   );
    //                 }
    //                 if (!response.error) {
    //                   this.priceEstimationService.recalculateAllEmitter.emit(
    //                     true
    //                   );
    //                   if (
    //                     this.priceEstimationService.proposalDataService.proposalDataObject
    //                       .proposalData.status ===
    //                     this.priceEstimationService.constantsService.QUALIFICATION_COMPLETE
    //                   ) {
    //                     this.priceEstimationService.createProposalService.updateProposalStatus();
    //                   }
    //                   this.priceEstimationService.isContinue = false;
    //                   currentRoute.navigate([urlToNavigate]);
    //                 }
    //               }
    //             });
    //         } else {
    //           this.priceEstimationService.isContinue = false;
    //             currentRoute.navigate([urlToNavigate]);
    //         }
    //       });
    //  }
    //  else{
    return true;
    // }
  }
}
