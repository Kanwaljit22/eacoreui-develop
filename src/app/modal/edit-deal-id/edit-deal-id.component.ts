import { BlockUiService } from './../../shared/services/block.ui.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IbSummaryService } from '../../ib-summary/ib-summary.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';


@Component({
  selector: 'app-edit-deal-id',
  templateUrl: './edit-deal-id.component.html',
  styleUrls: ['./edit-deal-id.component.scss']
})
export class EditDealIdComponent implements OnInit {

  confirmEdit = false;
  dealIDData: any = {};
  qualEAQualificationName = '';
  qualEADealId = '';
  eaQualDescription = '';
  errorDealID = false;
  resultFound = true;
  resultMatch = false;
  disableUpdateBtn = true;
  disableLookupBtn = true;
  errorMessage: string;
  qualificationNameError = false;
  oldQualName = '';
  duplicateQualNameErrorMessage: string;
  errorQualName = false;

  constructor(public localeService: LocaleService, public qualService: QualificationsService, public activeModal: NgbActiveModal, public renderer: Renderer2, public productSummaryService: ProductSummaryService,
    public appDataService: AppDataService,public messageservice: MessageService,
    private blockUiService: BlockUiService, public constansService: ConstantsService, public involvedService: WhoInvolvedService,
    public utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
    // console.log(this.qualService.qualification);
    this.qualEADealId = this.qualService.qualification.dealId;
    this.dealIDData = this.qualService.qualification.dealInfoObj;
    this.qualEAQualificationName = this.qualService.qualification.name;
    this.eaQualDescription = this.qualService.qualification.eaQualDescription;
    this.oldQualName = this.qualEAQualificationName;
    // this.resultMatch = this.qualService.resultMatch;
    this.disableLookupBtn = (this.qualEADealId !== this.qualService.qualification.dealId && this.qualEADealId.trim() !== '') ? false : true;
  }

  matchDealId() {
    this.disableUpdateBtn = (this.qualEADealId !== this.qualService.qualification.dealId) ? false : true;
    this.eaQualDescription = this.qualService.qualification.eaQualDescription;
    this.resultMatch = !this.resultMatch;
    this.disableUpdateBtn = !this.resultMatch;
    if (!this.disableUpdateBtn) {
     this.updateQualName();
    }

  }

  updateDealLookUpID() {
    this.resultFound = false;
    this.resultMatch = false;
    this.disableLookupBtn = (this.qualEADealId !== this.qualService.qualification.dealId && this.qualEADealId.trim() !== '') ? false : true;
    this.disableUpdateBtn = true;
  }

  showLookup(dealId: string) {
    const dealLookUpRequest = {
      'archName': this.appDataService.archName,
      'userId': this.appDataService.userId,
      'dealId': this.utilitiesService.removeWhiteSpace(this.qualEADealId),
      'customerId': this.appDataService.customerID
    };
    this.productSummaryService.showProspectDealLookUp(dealLookUpRequest)
      .subscribe((response: any) => {
        if (!response.error && !response.messages && response.data) {
          this.dealIDData = response.data.dealDetails;
          // this.qualEAQualificationName = response.data.optyName;
          this.resultFound = true;
          this.errorDealID = false;
          this.qualificationNameError = false;
          // this.qualService.qualification.dealInfoObj = this.dealIDData;
          // this.qualService.qualification.dealId = response.data.dealId;
        } else { // In this scenario we need to display message below the text box.
          // this.blockUiService.spinnerConfig.unBlockUI();
          this.errorMessage = 'No details found associated with the Deal Id. Please enter a valid Deal Id.';
          this.errorDealID = true;
          this.qualificationNameError = true;
        }
      });
  }


  public setQualificationValues() {
    this.qualService.qualification.dealInfoObj = this.dealIDData;
    this.qualService.qualification.dealId = this.dealIDData.dealId;
    // this.qualService.qualification.status = this.dealIDData.dealStatus;
    if (this.dealIDData.accountManager) {
      this.qualService.qualification.accountManager = this.dealIDData.accountManager;
      this.qualService.qualification.accountManagerName = this.dealIDData.accountManager.firstName + ' ' +
      this.dealIDData.accountManager.lastName;
      this.qualService.emailID = this.dealIDData.accountManager.emailId;
    } else {
      this.qualService.qualification.accountManager.firstName = '';
      this.qualService.qualification.accountManager.lastName = '';
      this.qualService.qualification.accountManager.emailId = '';
      this.qualService.qualification.accountManager.userId = '';
      this.qualService.qualification.accountManagerName = '';
    }

    this.qualService.qualification.name = this.qualEAQualificationName;
    this.qualService.qualification.eaQualDescription = this.eaQualDescription;
    this.qualService.qualification.accountAddress = this.dealIDData.accountAddress;
    this.qualService.qualification.accountName = this.dealIDData.accountName;
    this.qualService.qualification.address = this.dealIDData.accountAddressDetail;
    this.qualService.qualification.customerInfo.preferredLegalName = this.dealIDData.accountName;
    this.appDataService.subHeaderData.custName = this.qualService.qualification.name;
    this.appDataService.subHeaderData.subHeaderVal[0] = this.qualService.qualification.dealId;
    this.appDataService.subHeaderData.subHeaderVal[1] = this.qualService.qualification.accountManagerName;
    this.appDataService.subHeaderData.subHeaderVal[2] = this.qualService.qualification.qualStatus;
  }

  updateQual() {
    let reqObj = this.qualService.getQualInfo();
    reqObj['qualName'] = this.qualEAQualificationName;
    reqObj['qualStatus'] = 'In Progress';
    reqObj['dealId'] = this.qualEADealId;
    reqObj['description'] = this.eaQualDescription;
    reqObj['customerContact']['preferredLegalAddress'] = this.dealIDData.accountAddressDetail;
    reqObj['customerContact']['preferredLegalName'] = this.dealIDData.accountName;
    if (this.dealIDData.accountManager) {
      reqObj['am'] = this.dealIDData.accountManager;
    } else {
      reqObj['am']['firstName'] = '';
      reqObj['am']['fullName'] = '';
      reqObj['am']['lastName'] = '';
      reqObj['am']['emailId'] = '';
      reqObj['am']['userId'] = '';
    }
    // if qualification name is not updated then dont call validateQualName
    if (this.oldQualName !== this.qualEAQualificationName) {
      this.qualService.qualification.name = this.qualEAQualificationName;
      this.qualService.validateQualName().subscribe((response: any) => {
        if (!response.error) {
          try {
            if (response.qualCount === 0) {
              this.qualService.updateQual(reqObj).subscribe((res: any) => {
                if (!res.error) {
                  try {

                    // add specialist when we change deal id
                    this.addSpecialist();

                    this.qualService.qualification.qualID = res.qualId;
                    this.qualService.qualification.qualStatus = res.qualStatus;
                    this.qualService.qualification.eaQualDescription = this.eaQualDescription;
                    this.setQualificationValues();
                    this.qualService.dealIdUpdateEmitter.emit();
                    this.qualService.updateSessionQualData();
                    this.activeModal.dismiss();
                  } catch (error) {
                    this.messageservice.displayUiTechnicalError(error);
                  }
                } else {
                  this.qualService.qualification.name = this.oldQualName;
                  this.messageservice.displayMessagesFromResponse(res);
                }
              }, error => {
                this.messageservice.displayUiTechnicalError(error);
              }
              );
            } else {
              this.errorQualName = true;
              this.qualService.qualification.name = this.oldQualName;
              this.duplicateQualNameErrorMessage = AppDataService.DUPLICATE_QUAL_NAME;
            }
          } catch (error) {
            this.qualService.qualification.name = this.oldQualName;
            this.messageservice.displayUiTechnicalError(error);
          }
        } else {
          this.qualService.qualification.name = this.oldQualName;
          this.messageservice.displayMessagesFromResponse(response);
        }
      },
        error => {
          this.messageservice.displayUiTechnicalError(error);
        }
      );
       } else {
      this.qualService.updateQual(reqObj).subscribe((response: any) => {
        if (response) {
          if (!response.error) {
            try {

              // add specialist when we change deal id
              this.addSpecialist();

              this.qualService.qualification.qualID = response.qualId;
              this.qualService.qualification.qualStatus = response.qualStatus;
              this.qualService.qualification.eaQualDescription = this.eaQualDescription;
              this.setQualificationValues();
              this.qualService.dealIdUpdateEmitter.emit();
              this.activeModal.dismiss();
            } catch (error) {
              this.messageservice.displayUiTechnicalError(error);
            }
          } else {
            this.messageservice.displayMessagesFromResponse(response);
          }
        }
      }, error => {
        this.messageservice.displayUiTechnicalError(error);
      });
    }
  }
  // to hide error message if qualification name is changed
  updateQualName() {
    this.errorQualName = false;
    if (this.qualEAQualificationName.trim() === '') {
      this.disableUpdateBtn = true;
    } else {
      this.disableUpdateBtn = false;
    }
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }





  // Add specialist when deal id changed
  addSpecialist() {

    const specialistToSave = [];

    const accountManager: any = {};
    accountManager.name = this.dealIDData.accountManager.firstName + ' ' + this.dealIDData.accountManager.lastName;
    accountManager.ccoId = this.dealIDData.accountManager.userId;
    accountManager.email = this.dealIDData.accountManager.emailId;
    accountManager.access = this.constansService.RW;
    accountManager.notification = 'Yes';
    accountManager.archname = AppDataService.ARCH_NAME;
    accountManager.webexNotification = 'Y';

    let alreadyAdded = false;
    for (let j = 0; j < this.qualService.qualification.extendedsalesTeam.length; j++) {
      if (accountManager.name === this.qualService.qualification.extendedsalesTeam[j].name) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      specialistToSave.push(accountManager);
    }

    const addContactRequest = {
      'data': specialistToSave
    };
    if (specialistToSave.length > 0) {
      this.involvedService.contactAPICall(
        WhoInvolvedService.METHOD_ADD_CONTACT,
        this.qualService.qualification.qualID,
        addContactRequest,
        WhoInvolvedService.TYPE_EST,
        this.appDataService.userInfo.userId).subscribe((res: any) => {
          if (!res.error) {
            this.qualService.qualification.extendedsalesTeam = res.data;
            // update qualification object in session
            this.qualService.updateSessionQualData();
          } else {
          }
        });
    } else {
    }
  }

}
