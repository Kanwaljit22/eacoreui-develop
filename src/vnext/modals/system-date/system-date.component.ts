import { Component, OnInit } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { EaRestService } from 'ea/ea-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
@Component({
  selector: 'app-system-date',
  templateUrl: './system-date.component.html',
  styleUrls: ['./system-date.component.scss']
})
export class SystemDateComponent implements OnInit{

  constructor(public dataIdConstantsService:DataIdConstantsService,
    public ngbActiveModal:NgbActiveModal,
    public localizationService:LocalizationService,
    public vNextService:VnextService, 
    public vnextStoreService:VnextStoreService,
    public blockUiService:BlockUiService,
    public eaRestService:EaRestService,
    public messageService:MessageService,
    public utilitiesService: UtilitiesService,
    public elementIdConstantsService: ElementIdConstantsService
    ){
    
  }



  lastSavedDate:any =  new Date();
  selectedDate:any = new Date();
  currentDate =  new Date();

  ngOnInit(){
     let sysDate:any = sessionStorage.getItem('sysDate') ? sessionStorage.getItem('sysDate')+"":"";
     sysDate= Number(sysDate) // Date in ms
     const formatedDate =  new Date(sysDate);
     this.lastSavedDate = sysDate !== this.currentDate.getTime() ? formatedDate : this.currentDate;
     this.selectedDate = new Date(this.vnextStoreService.systemDate) // Date in YYYY/MM/DD
  }


  close() {
    this.ngbActiveModal.close({
      // continue: false
    });
  }

  onDateSelection(event){}


  saveSystemDate(){
    const selectedDate = new Date(this.selectedDate);
 
    this.vnextStoreService.systemDate = this.vNextService.getFormatedDate(selectedDate); //Update date in UI
    let sysDate = sessionStorage.getItem('sysDate');
    this.lastSavedDate = new Date(Number(sysDate)); // Update min date
 
    const url = `home/configuration-time-stamp`;
    const request = { data : this.utilitiesService.formartDateIntoString(this.selectedDate)}
   this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
    if(!response.error){
      this.vNextService.refreshProposalData.next(true); // Refresh proposal data
    }else{
      this.messageService.displayMessagesFromResponse(response);
    }
    this.close();
  });
  }

}
