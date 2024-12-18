import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '../../shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { EditQualificationService } from './edit-qualification.service';

@Component({
  selector: 'app-edit-qualification',
  templateUrl: './edit-qualification.component.html',
  styleUrls: ['./edit-qualification.component.scss']
})
export class EditQualificationComponent implements OnInit {
  qualifiactionName = '';
  eaQualDescription = '';
  qualificationNameError = false;
  errorMessage: string;
  isUpdate = false; // this flag is use for enable and disable update button.
  initialQualName: string;
  initialDescription: string;
  proposalNameError = false;
  propsalName = '';
  proposalName = '';
  proposalDescription = '';
  initialProposalName: string;
  initialProposalDescription: string;


  constructor(public localeService: LocaleService, public editQualificationService: EditQualificationService,
    public createProposalService: CreateProposalService, public proposalDataService: ProposalDataService,
    public activeModal: NgbActiveModal, public qualService: QualificationsService, public appDataService: AppDataService,
    public messageService: MessageService, public constantsService: ConstantsService, public renderer: Renderer2) { }

  ngOnInit() {
    if (this.appDataService.editModal === this.constantsService.QUALIFICATIONS) {

      this.qualifiactionName = this.qualService.qualification.name;
      this.eaQualDescription = this.qualService.qualification.eaQualDescription;
      this.initialDescription = this.eaQualDescription;
      this.initialQualName = this.qualifiactionName;
    } else if (this.appDataService.editModal === this.constantsService.PROPOSALS) {
      this.proposalName = this.proposalDataService.proposalDataObject.proposalData.name;
      this.proposalDescription = this.proposalDataService.proposalDataObject.proposalData.desc ?
      this.proposalDataService.proposalDataObject.proposalData.desc : '';
      this.initialProposalDescription = this.proposalDescription;
      this.initialProposalName = this.proposalName;
    }
  }


  // This method is use to check wheather name or Description is changed or not.
  isQualValueChanged(event) {
    if (this.qualifiactionName.trim() !== '') {
      if (this.qualifiactionName.trim() !== this.initialQualName) {
        this.isUpdate = true;
      } else if (this.initialDescription !== this.eaQualDescription.trim()) {
        this.isUpdate = true;
      } else {
        this.isUpdate = false;
      }
    } else {
      this.isUpdate = false;
    }
    // disable the update button if roSupeUser = true
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isUpdate = !this.appDataService.userInfo.roSuperUser;
    } else if (this.appDataService.roadMapPath) {
      this.isUpdate = !this.appDataService.roadMapPath;
    } else if (this.appDataService.roSalesTeam) {
      this.isUpdate = !this.appDataService.roSalesTeam;
    }
  }

  isProposalValueChanged(event) {
    // only RW Super user or who are part of the team can edit the name of the proposal
    if (this.appDataService.userInfo.rwSuperUser || this.appDataService.isReadWriteAccess) {
      if (this.proposalName.trim() !== '') {
        if (this.proposalName.trim() !== this.initialProposalName) {
          this.isUpdate = true;
        } else if (this.initialProposalDescription !== this.proposalDescription.trim()) {
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        this.isUpdate = false;
      }
    }
  }

  updateQual() {
    if (this.initialQualName !== this.qualifiactionName) {
      this.qualService.qualification.name = this.qualifiactionName;
      this.qualService.qualification.name = this.qualifiactionName;
      if (this.initialDescription !== this.eaQualDescription) {
        this.qualService.qualification.eaQualDescription = this.eaQualDescription;
      }
      this.updateQualificationDetail();
      this.activeModal.close({
        updatedQualName: this.qualifiactionName,
        updatedQualDesc: this.eaQualDescription
      });
    } else if (this.initialDescription !== this.eaQualDescription) {
      this.qualService.qualification.eaQualDescription = this.eaQualDescription;
      this.updateQualificationDetail();
      this.activeModal.close({
        updatedQualName: this.qualifiactionName,
        updatedQualDesc: this.eaQualDescription
      });
    } else {
      this.activeModal.close({
        updatedQualName: this.qualifiactionName,
        updatedQualDesc: this.eaQualDescription
      });
    }
  }


  updateQualificationDetail() {
    const reqObj = this.qualService.getQualInfo();
    // reqObj['qualStatus'] =  this.constantsService.IN_PROGRESS_STATUS;
    this.qualService.updateQual(reqObj).subscribe((res: any) => {
      if (!res.error) {
        try {
          this.qualService.qualification.qualStatus = res.qualStatus;
          this.appDataService.subHeaderData.subHeaderVal[2] = res.qualStatus;
          this.qualService.qualification.qualID = res.qualId;
          this.qualService.updateSessionQualData();
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.qualService.qualification.name = this.initialQualName;
        this.qualService.qualification.eaQualDescription = this.initialDescription;
        this.messageService.displayMessagesFromResponse(res);
      }
    }, error => {
      this.messageService.displayUiTechnicalError(error);
    }
    );
  }

  updateQualOrProposalFromModal(editModal) {
    let json = {};
    if (editModal === this.constantsService.PROPOSALS) {
      json = {
        'name': this.proposalName.trim(),
        'desc': this.proposalDescription
      };
    } else if (editModal === this.constantsService.QUALIFICATIONS) {
      json = {
        'name': this.qualifiactionName,
        'desc': this.eaQualDescription
      };
    }

    this.editQualificationService.updateQualOrProposalFromModal(json).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        try {
          if (editModal === this.constantsService.PROPOSALS) {
            this.activeModal.close({
              updatedProposalName: this.proposalName,
              updatedProposalDesc: this.proposalDescription
            });
          } else if (editModal === this.constantsService.QUALIFICATIONS) {
            this.activeModal.close({
              updatedQualName: this.qualifiactionName,
              updatedQualDesc: this.eaQualDescription
            });
            // this.qualService.updateSessionQualData();
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        if (editModal === this.constantsService.QUALIFICATIONS) {
          this.qualService.qualification.name = this.initialQualName;
          this.qualService.qualification.eaQualDescription = this.initialDescription;
        } else if (editModal === this.constantsService.PROPOSALS) {
          this.proposalDataService.proposalDataObject.proposalData.name = this.initialProposalName;
          this.proposalDataService.proposalDataObject.proposalData.desc = this.initialProposalDescription;
        }
        this.activeModal.close({
        });
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

}
