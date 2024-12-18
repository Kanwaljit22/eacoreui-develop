import { Component, OnInit, Input } from '@angular/core';
import { ManageComplianceHoldNewService } from './manage-compliance-hold-new.service';
import { AccountHealthInsighService } from '../account-health-insight/account.health.insight.service';

@Component({
  selector: 'app-manage-compliance-hold-new',
  templateUrl: './manage-compliance-hold-new.component.html',
  styleUrls: ['./manage-compliance-hold-new.component.scss']
})
export class ManageComplianceHoldNewComponent implements OnInit {

  constructor(private manageComplianceHoldService: ManageComplianceHoldNewService, 
    private accountHealthInsighService: AccountHealthInsighService) { }
  complianceHoldData  = [];
  isResponseLoaded = false;
  @Input() onAccountHealthPage = false;
  complianceDataReleasedFromHold = []; // to store orders released from hold

  ngOnInit() {
    this.complianceDataReleasedFromHold = [];
    this.getComplianceHoldData();
  }

  getComplianceHoldData(){
    this.manageComplianceHoldService.getComplianceHoldData().subscribe((res: any) => {
      if(res && !res.error && res.data){
        this.isResponseLoaded = true;
        if(res.data.complianceHoldList){
          this.accountHealthInsighService.hasComplianceHoldData = true;
          this.complianceHoldData = res.data.complianceHoldList;
        }
        if(this.onAccountHealthPage && this.complianceHoldData.length > 3){
          this.complianceHoldData.length = 3;
        } else if(!this.onAccountHealthPage && this.complianceHoldData.length){ // if not account health page and compliance hold data present set released and hold data
          this.complianceDataReleasedFromHold = this.complianceHoldData.filter(data => data.complianceHold.status === "COMPLETE");
          this.complianceHoldData = this.complianceHoldData.filter(data => data.complianceHold.status !== "COMPLETE");
          // console.log(this.complianceHoldData, this.complianceDataReleasedFromHold);
        }
      } else {
        //display msg
      }
    });
  }

  getAccountManager(managerData){
  
    if(managerData.ciscoAccountManager && managerData.ciscoAccountManager.length > 0){
     return managerData.ciscoAccountManager[0] +'('+managerData.ciscoAccountManager[1]+')';
    }
    return '--';
  }

  getSpecialistdata(SpecialistData){
    let SpecialistArray = []
    if(SpecialistData.dedicatedSoftwareSalesSpecialist && SpecialistData.dedicatedSoftwareSalesSpecialist.length > 0){
      for(let i = 0; i < SpecialistData.dedicatedSoftwareSalesSpecialist.length; i++){
        SpecialistArray.push(SpecialistData.dedicatedSoftwareSalesSpecialist[i].name + ' (' + SpecialistData.dedicatedSoftwareSalesSpecialist[i].ccoId + ')');
      }
      return SpecialistArray.join(', ');
    }

    return '--';
  }


  // method to set smart account names
  accountNamesRenderer(value) {
    if (value) {
      let accountNames = new Map(Object.entries(value));
      let accountNamesArray = new Array();
      accountNames.forEach((value: any, key: string) => {
        accountNamesArray.push(value.value);
      });
      if (accountNamesArray.length > 1) {
        return accountNamesArray.join(', ');
      } else {
        return accountNamesArray[0];
      }
    }
    return '';
  }

}
