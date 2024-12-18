import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TcoListService } from './tco-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTcoComponent } from '@app/modal/create-tco/create-tco.component';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { DeleteProposalComponent } from '@app/modal/delete-proposal/delete-proposal.component';
import { MessageService } from '@app/shared/services/message.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tco-list',
  templateUrl: './tco-list.component.html',
  styleUrls: ['./tco-list.component.scss']
})
export class TcoListComponent implements OnInit, OnDestroy {
  percentageComplete: number;
  showGeneratePopUp = false;
  tcoGenerated = false;
  makeCopy = false;
  copyCreated = false;
  tcoToCopy: any;
  tcoToGenerate: any;
  tcoListData: any;
  currencyCode = '';
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  displayNew = false;
  disableMode = false;
  disableCreate = true;
  public subscribers: any = {};
  showCreateMessage = false;
  showRoAccessMessage = false;
  partnerFlow = false;
  includedPartialIbSubscription:Subscription;

  constructor(private tcoListService: TcoListService, private router: Router, private modalVar: NgbModal,
    public proposalDataService: ProposalDataService, private qualService: QualificationsService,
    private createProposalService: CreateProposalService, public blockUiService: BlockUiService,
    private route: ActivatedRoute, private tcoApiCallService: TcoApiCallService,
    public utilitiesService: UtilitiesService, public localeService: LocaleService,
    public constantsService: ConstantsService, private messageService: MessageService, private tcoDataService: TcoDataService,
    public appDataService: AppDataService, public permissionService: PermissionService) { }

  ngOnInit() {

    window.scroll(0, 0);
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.tcoListing;
    this.appDataService.showActivityLogIcon(true);
    // console.log(' partnerdeal' , (<any>this.qualService.qualification).partnerDeal );
    if (this.tcoDataService.isHeaderLoaded) {
      this.disableCreate = !this.tcoDataService.tcoCreateAccess;
      // if ro super user and don't have access to the propoosal set disable mode to disable links
      if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
        this.disableMode = true;
        this.showCreateMessage = false;
        this.showRoAccessMessage = false;
      } else if (this.appDataService.isReadWriteAccess && this.disableCreate && !this.appDataService.roSalesTeam) {
        this.showCreateMessage = true;
        this.showRoAccessMessage = false;
        this.disableMode = false;
      } else if (this.appDataService.isReadWriteAccess && this.disableCreate && this.appDataService.roSalesTeam) {
        this.showCreateMessage = false;
        this.showRoAccessMessage = true;
        this.disableMode = false;
      } else {
        this.disableMode = false;
        this.showCreateMessage = false;
        this.showRoAccessMessage = false;
      }
    }
    // Get proposal id from session incase of refresh screen
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    if (this.proposalDataService.proposalDataObject.proposalId) {
      sessionObj.proposalDataObj = this.proposalDataService.proposalDataObject;
    } else {
      this.proposalDataService.proposalDataObject.proposalId = sessionObj.proposalDataObj.proposalId;
    }
    // set userReadWriteAccess and create Access to session obj
    sessionObj.createAccess = !this.disableCreate;
    this.appDataService.setSessionObject(sessionObj);
    this.includedPartialIbSubscription = this.appDataService.includedPartialIbEmitter.subscribe((includedPartialIb) =>{
      this.appDataService.includedPartialIb = includedPartialIb;
     });

    setTimeout(() => {
      this.appDataService.custNameEmitter.emit({ qualName: this.qualService.qualification.name.toUpperCase(),
        qualId: this.qualService.qualification.qualID,
        proposalId: this.proposalDataService.proposalDataObject.proposalId, 'context': 'TCO LIST' });
    });

    this.percentageComplete = 0;
    // start the chain to call api's parallel
    this.blockUiService.spinnerConfig.startChain();
    this.getTCOListData();
    // check if header is loaded else call header api
    if (!this.tcoDataService.isHeaderLoaded) {
      let json = {
        'data': {
          'id': this.proposalDataService.proposalDataObject.proposalId,
          'qualId': this.qualService.qualification.qualID
        }
      };
      this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, json);
      this.tcoDataService.isHeaderLoaded = true;
    }
    // after the header called while reloading the page check & set disable mode and readwrite access
    this.subscribers.tcoData = this.appDataService.tcoData.subscribe((data: any) => {
      this.disableMode = data.disableMode;
      this.appDataService.isReadWriteAccess = data.isRwAccess;
      this.disableCreate = !data.tcoCreateAccess;
      // method to call and show create disable message
      this.showDisableCreate();
      // set userReadWriteAccess and create Access to session obj
      sessionObj.isUserReadWriteAccess = this.appDataService.isReadWriteAccess;
      sessionObj.createAccess = !this.disableCreate;
      this.appDataService.setSessionObject(sessionObj);
    });

    this.partnerFlow = this.appDataService.isPatnerLedFlow;

  }

  // method to call and show create disable message
  showDisableCreate() {
    if (this.appDataService.isReadWriteAccess && this.disableCreate && !this.appDataService.roSalesTeam) {
      this.showCreateMessage = true;
      this.showRoAccessMessage = false;
    } else if (this.appDataService.isReadWriteAccess && this.disableCreate && this.appDataService.roSalesTeam) {
      this.showCreateMessage = false;
      this.showRoAccessMessage = true;
    } else {
      this.showCreateMessage = false;
      this.showRoAccessMessage = false;
    }
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    // unsubscribe to the subscription of tco data
    if (this.subscribers.tcoData) {
      this.subscribers.tcoData.unsubscribe();
    }
    this.includedPartialIbSubscription.unsubscribe();
  }
  // This method will get tco list
  getTCOListData() {

    this.tcoApiCallService.getTcolist(this.proposalDataService.proposalDataObject.proposalId).subscribe((response: any) => {
      // if header loaded before theis api , stop the chain and unblock UI
      if (this.tcoDataService.isHeaderLoaded) {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
      if (response && !response.error) {
        this.tcoListData = response;
        // Set currency code from first object
        if (this.tcoListData && this.tcoListData.length > 0) {
          if (this.tcoListData[0].currencyCode) {
            this.currencyCode = this.tcoListData[0].currencyCode;
          }
        } else {
          this.displayNew = true;
        }
      }
    });
  }

  // This method will duplicate tco
  duplicate(tcoID, tcoName) {
    // Sets appropriate fields for Duplication pop-up
    this.makeCopy = true;
    this.tcoToCopy = tcoName;

    this.tcoApiCallService.duplicateTco(tcoID).subscribe((response: any) => {
      if (response && !response.error) {

        try {
          this.getTCOListData();
          // Closes the 'Creating' pop-up
          this.makeCopy = false;
          // Opens the 'Created Successfully' pop-up
          this.copyCreated = true;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      }
    });
  }

  closeDuplicate() {
    this.copyCreated = false;
  }

  closeGenerate() {
    this.tcoGenerated = false;
  }

  // This method will open tco modelling
  openTCOModelling(tco) {

    this.tcoDataService.tcoDataObj = tco;
    this.tcoDataService.tcoId = tco.id;
    this.tcoDataService.loadReviewFinalize = false;
    this.router.navigate(['../' + this.tcoDataService.tcoId], { relativeTo: this.route });
  }

  // This method will delete tco
  delete(tcoID) {

    const modalRef = this.modalVar.open(DeleteProposalComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.message = this.localeService.getLocalizedMessage('modal.DELETE_TCO_MESSAGE');

    modalRef.result.then((result) => {
      if (result.continue) {
        this.tcoApiCallService.deleteTco(tcoID).subscribe((response: any) => {
          if (response && !response.error) {
            try {
              this.getTCOListData();
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          }
        });
      }
    });
  }

  // This method will edit tco
  edit(tco) {
    const modalRef = this.modalVar.open(CreateTcoComponent, { windowClass: 'create-tco' });
    modalRef.componentInstance.isUpdateTCO = true;
    modalRef.componentInstance.headerMessage = this.localeService.getLocalizedString('tco.list.edit.UPDATE_NEW_TCO');
    modalRef.componentInstance.tcoName = tco.name;

    modalRef.result.then((result) => {
      if (result.tcoUpdate) {

        // Set updated name
        if (result.updatedName) {
          tco.name = result.updatedName;
        }
        this.tcoApiCallService.updateTco(tco).subscribe((response: any) => {
          if (response && !response.error) {
          }
        });
      }
    });

  }

  // This method will create tco
  createTco() {
    const modalRef = this.modalVar.open(CreateTcoComponent, { windowClass: 'create-tco' });
    modalRef.componentInstance.isUpdateTCO = false;
    modalRef.componentInstance.headerMessage = this.localeService.getLocalizedString('tco.list.edit.CREATE_NEW_TCO');

    modalRef.result.then((result) => {
      if (result.tcoCreated === true) {
        this.router.navigate(['../' + this.tcoDataService.tcoId], { relativeTo: this.route });
      }
    });
  }

  goToDocCenter() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/document']);
  }

  goToBom() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  // This method will download tco  ppt
  generateTCO(tcoID, tcoName) {

    this.tcoToGenerate = tcoName;
    this.showGeneratePopUp = true;

    this.tcoApiCallService.download(tcoID).subscribe((res: any) => {
      if (res && !res.error) {
        this.generateFileName(res);
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // This method will generate filename
  generateFileName(res) {

    let x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; // res.headers.get('content-disposition').substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) // IE & Edge
    {
      this.showGeneratePopUp = false;
      this.tcoGenerated = true;
      // msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);

    } else {
      this.showGeneratePopUp = false;
      this.tcoGenerated = true;
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }

  }

  // This method will be used to restore default
  restoreDefault(tcoID) {

    this.tcoApiCallService.restore(tcoID).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.getTCOListData();
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  disableEdit(tco) {
    if (!tco.permissions && !tco.permissions.featureAccess) {
      return true;
    }
    if (tco.permissions.featureAccess.some(permission => permission.name === PermissionEnum.TCOEdit)) {
      return false;
    } else {
      return true;
    }
  }

  disableDelete(tco) {
    if (!tco.permissions && !tco.permissions.featureAccess) {
      return true;
    }
    if (tco.permissions.featureAccess.some(permission => permission.name === PermissionEnum.TCODelete)) {
      return false;
    } else {
      return true;
    }
  }

  disableDuplicate(tco) {
    if (!tco.permissions && !tco.permissions.featureAccess) {
      return true;
    }
    if (tco.permissions.featureAccess.some(permission => permission.name === PermissionEnum.TCODuplicate)) {
      return false;
    } else {
      return true;
    }
  }

}
