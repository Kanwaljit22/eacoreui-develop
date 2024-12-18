import { Component, OnInit } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-add-security-service-enroll',
  templateUrl: './add-security-service-enroll.component.html',
  styleUrls: ['./add-security-service-enroll.component.scss']
})
export class AddSecurityServiceEnrollComponent implements OnInit {

  isSecurityEnrollmentPresent = false; // set if security enrollment present in enrollments array
  isServiceEnrollmentPresent = false; // set if service enrollment present in enrollments array
  serviceEnrollmentObj: any; // set security enrollment obj
  securityEnrollmentObj: any; // set service enrollment obj
  selectedEnrollemntName = '';
  showSecurity = false;
  showService = false;

  constructor(public activeModal: NgbActiveModal , private modalVar:NgbModal,public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('add-security-service-enroll');
  }

  close() {
    this.activeModal.close({continue : false});
  }

  addEnrollment(enrollment){
    this.activeModal.close(
      {
        continue: true,
        enrollment: enrollment // send selected enrollment to enroll
      }
    );
  }



}


