import { Component, OnInit, Input  } from '@angular/core';
import { LinkedSubscriptionService } from './linked-subscription.service';
import { AppDataService } from '../services/app.data.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-linked-subscription',
  templateUrl: './linked-subscription.component.html',
  styleUrls: ['./linked-subscription.component.scss']
})
export class LinkedSubscriptionComponent implements OnInit {
  showSubscriptionData = false;
  @Input() subscriptionData = [];
  constructor(private linkedSubscriptionService : LinkedSubscriptionService,
               private appDataService : AppDataService,
               private messageService : MessageService)
               { }
               

  ngOnInit() {
  }

  getSubRefDetails(subRefId:any){
  if(!this.appDataService.subSummaryUrl){
    this.linkedSubscriptionService.getSubRefDetails().subscribe((res:any)=>{
      if(res && res.data && !res.error){
  
        try{
           this.appDataService.subSummaryUrl=res.data;
           window.open(this.appDataService.subSummaryUrl+subRefId,'_blank');
         }
        catch(error){
          this.messageService.displayUiTechnicalError(error);
        }
      }
      else {
        this.messageService.displayMessagesFromResponse(res);
      }
    
    });
   }
   else{
    window.open(this.appDataService.subSummaryUrl+subRefId,'_blank');
   }
 
}
}
