import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { RequestExceptionStatusService } from './request-exception-status.service';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';

@Component({
  selector: 'app-request-exception-status',
  templateUrl: './request-exception-status.component.html',
  styleUrls: ['./request-exception-status.component.scss']
})
export class RequestExceptionStatusComponent implements OnInit {
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  @Input() displayApprovalHistory = false; // to show status tab default
  @Input() exceptionStatusData: any;
  @Input() exceptionApprovalHistory: any = [];
  @Input() groupExceptionApproverHistory: any = [];
  @Input() public isShowSelectReason: any; // set to show submit for req approval button if any exceptions present
  constructor(public localeService: LocaleService, private requestExceptionSatusService: RequestExceptionStatusService, private messageService: MessageService, public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    //console.log(this.groupExceptionApproverHistory);
    //console.log(this.exceptionStatusData, this.exceptionApprovalHistory, this.isShowSelectReason);
    //this.approvalHistoryData(); // call this for approvalhistory
  }

  // setExceptionStatus(data) {
  //   if (data.length > 0) {
  //     for (const d of data) {
  //       if (d.status === "NEW" || d.status === "new") {
  //         this.isShowSelectReason = true;
  //         // console.log('test', d)
  //         return;
  //       }
  //     }
  //   }
  //   console.log(this.isShowSelectReason)
  // }

  // method to call and set approvalhistory if present
  approvalHistoryData(){
    this.requestExceptionSatusService.approverHistory().subscribe((res: any) => {
      if(res && !res.error){
        if(res.data){
          this.exceptionApprovalHistory = res.data;
        }else{
          this.exceptionApprovalHistory = [];
          this.displayApprovalHistory = false;
        }
        //console.log(res, this.exceptionApprovalHistory);
      } else {
        this.exceptionApprovalHistory = []
        this.displayApprovalHistory = false;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to switch status of requested exceptions and approval history
  switchShowStatus(value){
    this.displayApprovalHistory = value;
  }

  downloadPADocument(data) {
    this.requestExceptionSatusService.requestDocument(data.proposalId, data.documents[0].documentMappingId).subscribe((response:any) => {
      if(response && !response.error) {
        this.generateFileName(response);
      }
    });
  }

  generateFileName(res) {
    const x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; // res.headers.get('content-disposition').substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) {
      // IE & Edge
      // msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }
  convertRegionToString(regionArray){
    return regionArray.join(', ');
  }
}
