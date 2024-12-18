import { MessageService } from '@app/shared/services/message.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';

@Component({
  selector: 'app-lookup-subscription',
  templateUrl: './lookup-subscription.component.html',
  styleUrls: ['./lookup-subscription.component.scss']
})
export class LookupSubscriptionComponent implements OnInit {

  subscriptionId = '';
  subscriptionObj: any;
  subscriptionData: any = [];
  isSubscriptionSelected = false;
  isSubscriptionListLoaded = false;
  selectedSubscription = {};
  noDataFound = false;
  constructor(private activeModal: NgbActiveModal, private createProposalService: CreateProposalService,
    private messageService: MessageService, public renderer: Renderer2, public appDataService: AppDataService) { }
    

  ngOnInit() {
  }
  subscriptionLookup() {
    // this.subscriptionObj = {};
    this.subscriptionData = [];
    this.createProposalService.subscriptionLookup(this.subscriptionId, false).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        this.subscriptionData = res.data;
        this.isSubscriptionListLoaded = true;
      } 
      else{
        if(!res.error && !res.data){
          this.noDataFound = true;
        }
      }
      this.messageService.displayMessagesFromResponse(res);
      
    })
  }
  selectSubscription(dataObj){
    this.subscriptionObj = dataObj
    this.isSubscriptionSelected = true;
    this.selectedSubscription = this.subscriptionObj;
  }
  close() {
    this.activeModal.close({
      continue: false
    });
  }
  done() {
    this.activeModal.close({
      dataObj: this.selectedSubscription,
      continue: true
    });
  }
  updateLookUpSubscription(event){
    this.subscriptionData = []
    this.subscriptionObj = this.selectedSubscription = {};
    this.isSubscriptionSelected = false;
    this.isSubscriptionListLoaded = false;
    this.noDataFound = false;
  }
  
  focusSubIdInput(val) {
    const element = this.renderer.selectRootElement('#'+ val);
    element.focus();
  }

}
