import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-assign-smart-account',
  templateUrl: './assign-smart-account.component.html',
  styleUrls: ['./assign-smart-account.component.scss']
})
export class AssignSmartAccountComponent implements OnInit {
  searchDropdownArray = [
    {
      "id": "domain",
      "name": "Domain Identifier"
    },
    {
      "id": "email",
      "name": "Email Address"
    }
  ];
  selectedSmartAccOption = 'Select an Existing Account'
  optionsArr = ['Create New Account for your Customer', 'Select an Existing Account']
  searchPlaceHolder = 'Enter Smart Account Name and Domain Identifier(e.g., mycompany.com)';
  searchText = '';
  smartAccountData = [];
  showOptionDrop = false;
  selectedSearchType: any;
  showSearchDrop = false;
  selectedSmartAcc: any;
  showSmartAccounts= false;
  searchArray = ['smrtAccntName'];
  noSmartAccountFound = false;
  paginationObject: any;
  showEmailError = false;
  smartAccLookup = new Subject();
  url: any;

  constructor(public activeModal: NgbActiveModal, public localizationService: LocalizationService, public vnextService: VnextService, public projectStoreService: ProjectStoreService, public eaRestService: EaRestService, public messageService: MessageService, public eaService: EaService, public blockUiService: BlockUiService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('assign-smart-account');
    this.selectedSearchType = this.searchDropdownArray[0];
    this.paginationObject = {
      "currentPage": 1,
      "pageSize": 50,
      "noOfPages": 1,
      "noOfRecords": 50
    }

      this.smartAccLookup
      .pipe(switchMap(() => {
        this.blockUiService.spinnerConfig.noProgressBar();
        return this.eaRestService.getApiCallJson(this.url)

      }))
      .subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response, true)) {
          this.smartAccountData = response.data.smartAccounts;
          this.paginationObject = response.data.page;
          this.showSmartAccounts = true;
        } else {
          this.noSmartAccountFound = true;
          this.paginationObject = {
            "currentPage": 1,
            "pageSize": 50,
            "noOfPages": 1,
            "noOfRecords": 50
          }
          this.smartAccountData = [];
          this.showSmartAccounts = true;
        }

        if(this.searchText.length < 2) {
          this.smartAccountData = [];
          this.showSmartAccounts = false;
        }
      });
  }

  close(){
    this.activeModal.close();
  }

  getSmartAccountDetail(text) { 

    if (this.selectedSearchType.id === 'domain' && text.length >= 3) {
      this.blockUiService.spinnerConfig.noProgressBar();
      this.url = this.vnextService.getAppDomainWithContext + 'project/search-smart-accounts?' + this.selectedSearchType.id + '=' + text + '&page=' + this.paginationObject.currentPage;
    //  this.getSmartAccount();
      this.smartAccLookup.next(true);
    } else {
      this.showSmartAccounts = false;
      this.smartAccountData = [];
    }
   
  }

  getSmartAcc() {
    if (this.selectedSearchType.id === 'email') {
      this.blockUiService.spinnerConfig.noProgressBar();
      this.getSmartAccount();
    }
  }

  getSmartAccount() {
    this.searchText = this.searchText.trim();
    const url = this.vnextService.getAppDomainWithContext + 'project/search-smart-accounts?' + this.selectedSearchType.id + '=' + this.searchText + '&page=' + this.paginationObject.currentPage;
      // const url =  "assets/vnext/smartaccount.json";
      this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response, true)) {
          this.smartAccountData = response.data.smartAccounts;
          this.paginationObject = response.data.page;
          this.showSmartAccounts = true;
          this.showEmailError = false;
        } else {
          // to show error messages if any
          this.noSmartAccountFound = true;
          this.paginationObject = {
            "currentPage": 1,
            "pageSize": 50,
            "noOfPages": 1,
            "noOfRecords": 50
          }
          this.smartAccountData = [];
          this.showEmailError = this.selectedSearchType.id === 'email' ? true : false;
          this.showSmartAccounts = this.selectedSearchType.id === 'domain' ? true : false;;
        }
      });
  }

  selectOption(option) {
    this.selectedSmartAccOption = option;
    this.showOptionDrop = false;
    this.showSmartAccounts = false;
    this.smartAccountData = [];
  }

  selectType(type) {
    if(type.id !== this.selectedSearchType.id){
      this.showEmailError = false;
    }
    this.selectedSearchType = type;
    this.showSearchDrop = false;
    this.searchText = '';
    this.showSmartAccounts = false;
    this.searchPlaceHolder = type.id === 'email' ? 'Enter Email Address(e.g., mycompany@cisco.com)' : 'Enter Smart Account Name and Domain Identifier(e.g., mycompany.com)';
  }

  requestNewSmartAccount() {
    this.eaService.redirectToNewSmartAccount();
  }

  selectSmartAccount(smartAcc) {
   this.selectedSmartAcc = smartAcc
  }

  assign() {
    this.activeModal.close();
    const requestJson = {
   
      "data" : {
       "smrtAccntId": this.selectedSmartAcc.smrtAccntId,
       "smrtAccntName": this.selectedSmartAcc.smrtAccntName,
       "accountType": this.selectedSmartAcc.accountType,
       "programName": this.selectedSmartAcc.programName,
       "defaultVAId": this.selectedSmartAcc.defaultVAId,
       "defaultVAName": this.selectedSmartAcc.defaultVAName,
       "domain": this.selectedSmartAcc.domain,
       "defaultVAStatus": this.selectedSmartAcc.defaultVAStatus,
       "smrtAccntStatus":  this.selectedSmartAcc.smrtAccntStatus
    }   
   }
   
   const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/smart-accounts';
     this.eaRestService.putApiCall(url,requestJson).subscribe((response: any) => {
       if (this.vnextService.isValidResponseWithoutData(response, true)) {
             this.projectStoreService.projectData.smartAccount = this.selectedSmartAcc;
 
       } else {
         // to show error messages if any
         this.messageService.displayMessagesFromResponse(response);
       }
     });
  }

  clear() {
    this.searchText = '';
    this.showSmartAccounts = false;
    this.smartAccountData = [];
    this.showEmailError = false;
    this.paginationObject = {
      "currentPage": 1,
      "pageSize": 50,
      "noOfPages": 1,
      "noOfRecords": 50
    }
  }

  pageChange(event, value) {
    this.paginationObject.currentPage = event;
    this.getSmartAccount();
   }

}
