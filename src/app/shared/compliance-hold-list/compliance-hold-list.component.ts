import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compliance-hold-list',
  templateUrl: './compliance-hold-list.component.html',
  styleUrls: ['./compliance-hold-list.component.scss']
})
export class ComplianceHoldListComponent implements OnInit {

  constructor() { }

  @Input() complianceHoldData: any;

  ngOnInit() {
    // console.log(this.complianceHoldData)
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
    return '--';
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

//  method to set mlbRequestedStartDate for oders
  requestedStartDateRenderer(value) {
    if (value) {
      let requestedStartDates = new Map(Object.entries(value));
      let requestedStartDatesArray = new Array();
      requestedStartDates.forEach((value: any, key: any) => {
        requestedStartDatesArray.push(value);
      });
      if (requestedStartDatesArray.length > 1) {
        return requestedStartDatesArray.join(', ');
      } else {
        return requestedStartDatesArray[0];
      }
    }
    return '';
  }


}
