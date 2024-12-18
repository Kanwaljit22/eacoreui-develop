import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LinkSmartAccountService } from './link-smart-account.service';

@Component({
  selector: 'app-link-smart-account',
  templateUrl: './link-smart-account.component.html',
  styleUrls: ['./link-smart-account.component.scss']
})
export class LinkSmartAccountComponent implements OnInit, OnDestroy {

  smartAccountData = [];
  linkNewSmartAccount = [];
  searchValue = '';
  displayContent = false;
  showSelectedValues = false;
  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService,
    public linkSmartAccountService: LinkSmartAccountService, private appDataService: AppDataService) { }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.linkSmartAccountService.showTable = false;
    this.linkSmartAccountService.smartAccountData = [];
  }

  getData() {
    this.linkSmartAccountService.getData().subscribe((response: any) => {

      if (response && response.data) {
        this.linkSmartAccountService.smartAccountData = response.data;
        this.linkSmartAccountService.showTable = true;
      }
      this.displayContent = true;
    });
  }

  linkSmartAccount(smartAccount) {
    smartAccount.linked = !smartAccount.linked;
    const data = {
      'smartAccountStatus': smartAccount.account_status,
      'guName': this.appDataService.customerName,
      'smartAccountName': smartAccount.account_name,
      'smartAccountDomain': smartAccount.domain,
      'smartAccountId': smartAccount.account_identifier,
      'smartAccountType': smartAccount.account_type,
      'prospectKey': this.appDataService.customerID,
      'linked': smartAccount.linked
    }
    let presentInArray = false;
    for (let i = 0; i < this.linkNewSmartAccount.length; i++) {
      // if in search view we will get account_identifier and if in verify view we will get smartAccountId
      if (this.linkNewSmartAccount[i].smartAccountId === smartAccount.account_identifier ||
        this.linkNewSmartAccount[i].smartAccountId === smartAccount.smartAccountId) {
        // if removing from selected view, update linked flag in the original array
        if (this.showSelectedValues) {
          for (let i = 0; i < this.linkSmartAccountService.smartAccountData.length; i++) {
            if (this.linkSmartAccountService.smartAccountData[i].account_identifier === smartAccount.smartAccountId) {
              this.linkSmartAccountService.smartAccountData[i].linked = smartAccount.linked;
              break;
            }
          }
        }
        this.linkNewSmartAccount.splice(i, 1);
        if (this.linkNewSmartAccount.length === 0) {
          this.showSelectedValues = false;
        }
        presentInArray = true;
        break;
      }
    }
    if (!presentInArray) {
      this.linkNewSmartAccount.push(data);
    }
  }

  addSmartAccount() {
    const requestObj = {
      'data': this.linkNewSmartAccount
    };
    this.linkSmartAccountService.addSmartAccount(requestObj).subscribe((res: any) => {
      if (res && !res.error) {
        this.appDataService.reloadSmartAccountEmitter.emit();
        this.close();
      }
    });
  }

  close() {
    this.activeModal.close();
  }

  verify() {
    this.showSelectedValues = !this.showSelectedValues;
  }
  search(value) {
    const val = value.toLowerCase();
    if (val.length < 3) {
      // this.involvedService.suggestionsArrFiltered = [];
    }
    if (val.length >= 3) {
      this.linkSmartAccountService.lookUpAccount(val).subscribe((res: any) => {
        this.smartAccountData = res.data;
      });
    }
  }

}
