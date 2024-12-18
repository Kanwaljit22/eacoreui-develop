// import { WhoInvolvedService } from './../../qualifications/who-involved/who-involved.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddSpecialistService } from './add-specialist.service';
import { ProductSummaryService } from '../../dashboard/product-summary/product-summary.service';

import { AppDataService } from '../../shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';

@Component({
  selector: 'app-add-specialist',
  templateUrl: './add-specialist.component.html',
  styleUrls: ['./add-specialist.component.scss']
})
export class AddSpecialistComponent implements OnInit {
  specialistData = [];
  selectedCategories = [];
  checkedCategories = [];
  headerSpecialist = false;
  previouslySelectedCategories = [];
  allChecked = false;
  searchSpecialist: any;
  searchArray = ['name', 'archName'];


  constructor(public localeService: LocaleService,
    public involvedService: WhoInvolvedService,
    public activeModal: NgbActiveModal,
    public productSummaryService: ProductSummaryService,
    private messageService: MessageService,
    public configService: AppDataService,
    public qualService: QualificationsService,
    public appDataService: AppDataService,
    public constantsService: ConstantsService,
    private renderer: Renderer2,
    public blockUiService: BlockUiService
  ) { }

  ngOnInit() {
    if (this.involvedService.checkedCategories.length > 0 &&
      (this.involvedService.checkedCategories.length === this.involvedService.previouslySelectedSpecialist.length)) {
      // all specialist are selected , disable check all feature
      this.allChecked = true;
    }
    this.previouslySelectedCategories = this.involvedService.previouslySelectedSpecialist;
    this.selectedCategories = this.previouslySelectedCategories;
    this.involvedService.getSpecialistData().subscribe(
      (response: any) => {

        this.blockUiService.spinnerConfig.unBlockUI();

        if (response && !response.error) {
          try {

            const tempSpecilaistData = response.data;
            for (let i = 0; i < tempSpecilaistData.length; i++) {
              // Add default values for access and email
              tempSpecilaistData[i].access = this.constantsService.RW;
              tempSpecilaistData[i].notification = 'Y';
            }

            this.specialistData = tempSpecilaistData;
            /**Check if categories are selected previously if yes select the respective checkboxes */
            if (this.previouslySelectedCategories.length > 0) {
              // Filter ccoids from previosusly added specialists
              const previuoslySelectedCcoIds = this.previouslySelectedCategories.map(function (category) {
                return category.ccoId;
              });

              for (let j = 0; j < this.specialistData.length; j++) {
                const ccoId = this.specialistData[j].ccoId;
                if (previuoslySelectedCcoIds.includes(ccoId)) {
                  // mark previously selected specialist
                  this.specialistData[j].specialist = true;
                  this.specialistData[j].previouslyAdded = true; // disables checkbox for  previously added Specialist
                }
              }
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      },
      error => {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.messageService.displayUiTechnicalError(error);
      }
    );
  }

  checkAll(val) {
    for (let i = 0; i < this.specialistData.length; i++) {
      this.specialistData[i].specialist = val;
      if (val) {
        this.checkedCategories.push(this.specialistData[i]);
      } else {
        this.checkedCategories.splice(this.specialistData[i]);
      }
    }
    this.involvedService.checkedCategories = this.checkedCategories;
  }

  selectSpecialist(i) {
    if (i.specialist === true) {
      this.checkedCategories.push(i);
    } else {
      this.checkedCategories.splice(i, 1);
    }
    if ((this.checkedCategories.length + this.previouslySelectedCategories.length) === this.specialistData.length) {
      // all boxes are checked check the checkall box
      this.headerSpecialist = true;
    } else {
      this.headerSpecialist = false;
    }
  }

  addSpecialist() {

    for (let i = 0; i < this.checkedCategories.length; i++) {
      this.selectedCategories.push(this.checkedCategories[i]);
    }

    this.involvedService.previouslySelectedSpecialist = this.selectedCategories;

    // If Software specialist has been added before, delete it before making API all
    const addedCategories = this.selectedCategories.filter(function (category) {
      return category.previouslyAdded !== true;
    });

    const addContactRequest = {
      'data': addedCategories
    };
    this.involvedService.contactAPICall(
      WhoInvolvedService.METHOD_ADD_CONTACT,
      this.qualService.qualification.qualID,
      addContactRequest,
      WhoInvolvedService.TYPE_SSP,
      this.appDataService.userInfo.userId)
      .subscribe((res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          // add this property to check if specialist has been previously added so that we can disable checkbox when adding contacts again
          res.data[i].previouslyAdded = true;
        }

        this.involvedService.previouslySelectedSpecialist = res.data;
        // If specialist added and qualification status is validated then change status to In progress.
        // if (this.qualService.qualification.qualStatus !== 'In Progress') {
        // this.qualService.updateQualStatus();
        // }
        this.activeModal.close({
          locateData: this.involvedService.previouslySelectedSpecialist
        });
      });
  }

  cancelAdd() {
    this.activeModal.dismiss('Cross click');
    this.qualService.qualification.softwareSalesSpecialist = this.previouslySelectedCategories;
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }
}
