import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DocumentCenterService } from '../document-center/document-center.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MessageService } from '../shared/services/message.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualSummaryService } from '../qualifications/edit-qualifications/qual-summary/qual-summary.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { QualificationsService } from '../qualifications/qualifications.service';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
import { BreadcrumbsService } from '../../app/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { Subscription } from 'rxjs';
import { PermissionService } from '@app/permission.service';

@Component({
  selector: 'app-document-center',
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.scss']
})
export class DocumentCenterComponent implements OnInit, OnDestroy {

  architecture: any;
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  selectedOptions: IMultiSelectOption[];
  customerSuccessNote = false;
  subscription: Subscription;
  proposalStatus = '';
  customerSuccessMsg = '';
  showSalesConnect = false; // make it true when to show document central for salesconnect

  constructor(public localeService: LocaleService, public documentCenter: DocumentCenterService,
    public qualService: QualificationsService, public permissionService: PermissionService,
    public appDataService: AppDataService, public proposalDataService: ProposalDataService,
    public _sanitizer: DomSanitizer, private router: Router, private breadcrumbsService: BreadcrumbsService,
    public qualSummaryService: QualSummaryService, public renderer: Renderer2, public messageService: MessageService,
    public constantsService: ConstantsService, private route: ActivatedRoute, public blockUiService: BlockUiService) { }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.documentCenter;
    this.appDataService.showActivityLogIcon(true);
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    // check the session and session has proposal status then set it to show/hide tco tab
    if (sessionObject && sessionObject.proposalDataObj && JSON.stringify(sessionObject.proposalDataObj) !== '{}') {
      this.proposalStatus = sessionObject.proposalDataObj.proposalData.status;
    }
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);

    if (this.router.url.includes('/group')) {
      this.appDataService.isGroupSelected = true;
    } else {
      this.appDataService.isGroupSelected = false;
    }

    this.subscription = this.appDataService.headerDataLoaded.subscribe(() => {
      this.architecture = this.proposalDataService.proposalDataObject.proposalData.architecture;
      if (this.proposalStatus === '') {
        this.proposalStatus = this.proposalDataService.proposalDataObject.proposalData.status;
      }
      if (!(this.appDataService.isGroupSelected && this.proposalDataService.isSecurityIncludedinCrossArch ||
        this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.SECURITY)) {
        this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(
          h => h.type !== ConstantsService.FULL_CUSTOMER_BOOKING_REPORT);
      }
    });

    if (!this.proposalDataService.proposalDataObject.proposalId || !this.qualService.qualification.qualID) {

      // Get proposal id from request parameter
      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          const proposalId = params.get('proposalId');
          if (proposalId !== undefined && proposalId.length > 0) {
            this.proposalDataService.proposalDataObject.proposalId = parseInt(proposalId);
          }
        }
      });

      if (!sessionObject || this.proposalDataService.proposalDataObject.proposalId !== sessionObject.proposalDataObj.proposalId) {
        // Redirect to proposal summary incase of new tab or proposal id updated in the url
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
        return; // Return so that next code will not be executed incase of navigate
      }


      this.qualService.qualification.customerInfo = {
        'accountName': '',
        'address': '',
        'smartAccount': '',
        'preferredLegalName': '',
        'scope': '',
        'affiliateNames': '',
        'repName': '',
        'repTitle': '',
        'repEmail': '',
        'filename': '',
        'repFirstName': '',
        'repLastName': '',
        'phoneCountryCode':'',
        'dialFlagCode': '',
        'phoneNumber':''
      };
      this.qualService.qualification.legalInfo = {
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      };

      let customerContact: any;
      if (sessionObject.qualificationData.customerContact) {
        customerContact = sessionObject.qualificationData.customerContact;
      } else if (sessionObject.qualificationData.customerInfo) {
        customerContact = sessionObject.qualificationData.customerInfo;
      }

      this.qualService.qualification.legalInfo = customerContact.preferredLegalAddress;
      this.qualService.qualification.customerInfo.preferredLegalName = customerContact.preferredLegalName;
      this.qualService.qualification.customerInfo.repName = customerContact.repName;
      this.qualService.qualification.customerInfo.repEmail = customerContact.repEmail;
      this.qualService.qualification.customerInfo.repTitle = customerContact.repTitle;
      this.qualService.qualification.customerInfo.affiliateNames = customerContact.affiliateNames;


      this.qualService.qualification.qualID = sessionObject.qualificationData.qualID ?
      sessionObject.qualificationData.qualID : sessionObject.qualificationData.id;
      this.qualService.qualification.name = sessionObject.qualificationData.name ?
      sessionObject.qualificationData.name : sessionObject.qualificationData.qualName;
      this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;
      this.appDataService.userInfo.roSuperUser = sessionObject.userInfo.roSuperUser;
      this.appDataService.userInfo.rwSuperUser = sessionObject.userInfo.rwSuperUser;
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
    }

    // Only show document center when status complete and user has read write access
    if (!(this.appDataService.isReadWriteAccess || this.appDataService.userInfo.roSuperUser || this.proposalDataService.is2TUsingDistiSharedPrposal)) {
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
      return; // Return so that next code will not be executed incase of navigate
    }
    this.appDataService.isProposalIconEditable = false;
    this.appDataService.isReadWriteAccess = true;

    this.selectedOptions = [{
      'id': 1,
      'name': ConstantsService.SCP
    },
    {
      'id': 2,
      'name': ConstantsService.SUPP_TERMS
    },
    {
      'id': 3,
      'name': ConstantsService.LETTER_AGREEMENT
    }
    ];
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true,
      showCheckAll: false
    };
    this.myTexts = {
      defaultTitle: ConstantsService.SCP
    };

    const json = {
      'data': {
        'id': this.proposalDataService.proposalDataObject.proposalId,
        'qualId': this.qualService.qualification.qualID
      }
    };

    if (sessionObject.proposalDataObj.proposalData.status !== this.constantsService.COMPLETE_STATUS) {
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
      return; // Return so that next code will not be executed incase of navigate
    }
  }

  ngOnDestroy() {
    this.proposalDataService.is2TUsingDistiSharedPrposal = false;
    this.appDataService.showActivityLogIcon(false);
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.showFinancialSummary = false;
    this.subscription.unsubscribe();
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  salesReadiness() {
    const screenName = 'salesReadiness';
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/' + screenName]);
  }

  goToPreviewquotePage() {
    if (this.appDataService.isGroupSelected === true) {
     this.router.navigate(
       ['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalData.groupId + '/bom' + '/group']);
    } else {
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
    }
  }

  hideCustomerMsg() {
    this.customerSuccessNote = false;
  }

  isStatusNotCompleteToAllowDownload() {
    let allowDownload = false;
    if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.IN_PROGRESS_STATUS ||
      (this.appDataService.isGroupSelected && this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch)) {
      allowDownload = true;
    }
    return allowDownload;
  }

  changeCustomerSuccessMsg(val: any) {
    this.customerSuccessMsg = val['msg'];
    this.customerSuccessNote = val['note'];
  }

  openIBAssessment() { 
    this.documentCenter.getIBAssessmentURL().subscribe((res: any) => {
      if (res && res.data && !res.error) {
        if (res.data.ibAssessmentRedirectionUrl) {
          window.open(res.data.ibAssessmentRedirectionUrl, '_blank');
        }
      } else {
        if (res.error) {
          this.messageService.displayMessagesFromResponse(res);
        } else {
          this.messageService.displayUiTechnicalError();
        }
      }
      
    })

   
  }
}
