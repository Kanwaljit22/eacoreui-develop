import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-proxy-user',
  templateUrl: './proxy-user.component.html',
  styleUrls: ['./proxy-user.component.scss']
})
export class ProxyUserComponent implements OnInit, OnDestroy {
  cecId = '';
  public subscribers: any = {};
  displayMsg = ''

  constructor(public activeModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService,
    private eaService: EaService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.subscribers.updateProxySubject = this.eaService.updateProxySubject.subscribe((response:any) =>{
      if (this.eaService.isValidResponseWithoutData(response)){
        this.activeModal.close(this.cecId);
      } else if(response.messages?.length){
        this.displayMsg = response.messages[0]?.text;
      }
    })
  }

  switchToProxy() {
    if (this.cecId) {
      this.eaService.validateUserProxyAccess(this.cecId)
    } else {
      this.activeModal.close();
    }
  }

  close() {
    this.activeModal.close();
  }

  ngOnDestroy(){
    this.subscribers.updateProxySubject.unsubscribe();
  }

}
