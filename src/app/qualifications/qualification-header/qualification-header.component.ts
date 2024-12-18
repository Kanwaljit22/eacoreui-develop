
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { element } from 'protractor';
import { AppDataService } from '../../shared/services/app.data.service';
import { HeaderService } from '../../header/header.service';
import { MessageService } from '../../shared/services/message.service';
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EditQualificationComponent } from '../../modal/edit-qualification/edit-qualification.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';


@Component({
  selector: 'app-qualification-header',
  templateUrl: './qualification-header.component.html',
  styleUrls: ['./qualification-header.component.scss']
})
export class QualificationHeaderComponent implements OnInit {

  createQualification = false;
  errorDealID = false;
  qualEADealId: string;
  qualEAQualificationName: string;
  resultMatch = false;
  resultFound = false;
  newQualData: any = [];
  eaQualDescription: string;
  archName: any;
  customerName: any;
  customerId: any;
  errorMessage: string;

  constructor(public qualService: QualificationsService, private messageService: MessageService,
    private router: Router, private modalVar: NgbModal,
    public appDataService: AppDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  editQualificationName() {
    const modalRef = this.modalVar.open(EditQualificationComponent, { windowClass: 'searchLocate-modal' });
    modalRef.componentInstance.qualifiactionName = this.qualService.qualification.name;
    modalRef.componentInstance.eaQualDescription = this.qualService.qualification.eaQualDescription;
    modalRef.result.then(result => {
      try {
        this.qualService.qualification.name = result.updatedQualName;
        this.qualService.qualification.eaQualDescription = result.updatedQualDesc;
        // If qualification name and qualification description are same as previous then we don't need to make ajax call.
        let reqObj = this.qualService.getQualInfo();
        this.qualService.updateQual(reqObj).subscribe((response: any) => {
          if (response) {
            if (response.messages && response.messages.length > 0) { // If any message present in response need to display.
              this.messageService.displayMessagesFromResponse(response);
            }
            if (!response.error) { // If no error in response, update qualification name and description in qual object.
              this.qualService.qualification.name = response.qualName;
              this.qualService.qualification.eaQualDescription = response.description;
            }
          }
        });
      } catch (error) {
        console.error(error.ERROR_MESSAGE);
        this.messageService.displayUiTechnicalError(error);
      }
    });
  }

}
