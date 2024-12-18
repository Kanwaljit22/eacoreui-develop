import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { DocumentCenterComponent } from './document-center.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { SharedModule } from '@app/shared';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { ClickOutsideModule } from 'ng4-click-outside';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProposalRoutingModule } from 'vnext/proposal/proposal-routing.module';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

describe('DocumentCenterComponent', () => {
  let component: DocumentCenterComponent;
  let fixture: ComponentFixture<DocumentCenterComponent>;
  class MockEaRestService {

    postApiCall() {
      return of({
        data:{
            responseDataList: [
                {
                    "test": "test"
                }
            ],
            proposals: [{
                "test": "test"
            }],
            page: {
                "test": "test"
            },
            totalRecords: 12,
            approver: true
        },
      })
    }

    getApiCall(url) {
        return of({
          data:[{
            showFilters: false
          }]
        })
    }
}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCenterComponent ,LocalizationPipe ],
      imports: [ HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        FileUploadModule,
        NgxSliderModule,
        NgbTooltipModule],
      providers: [{provide:EaRestService, useClass: MockEaRestService}, 
        EaStoreService, LocalizationService,
         EaService, ConstantsService,VnextService,
         ProposalStoreService,ProjectService,
         UtilitiesService,VnextStoreService,ProjectStoreService,
         ProposalService,CurrencyPipe,ProjectRestService, 
         DataIdConstantsService,
         ElementIdConstantsService
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCenterComponent);
    component = fixture.componentInstance;
    component.proposalStoreService.loadCusConsentPage = true
    fixture.detectChanges();
  });
  afterEach(() => {
   // fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.proposalStoreService.loadCusConsentPage = true
    expect(component.displayMultiPartner).toBe(true);
  });

  it('should call showMultiPartnerConsent', () => {
    component.showMultiPartnerConsent()
    expect(component.displayMultiPartner).toBe(true);
  });

  it('should call showDocuments', () => {
    component.showDocuments()
    expect(component.displayLegalPackage).toBe(false);
  });

  it('should call showLegalPackage', () => {
    component.showLegalPackage()
    expect(component.displayLegalPackage).toBe(true);
  });
  it('should call roUser', () => {
    component.roUser()
    expect(component.editLegalPackage).toBe(false);
  });
  it('should call checkSmartAccount', () => {
    component.checkSmartAccount()
    expect(component.editLegalPackage).toBe(true);
  });
  it('should call rwUser', () => {
    component.rwUser()
    expect(component.editLegalPackage).toBe(true);
  });
  it('should call rwUser orderStatus === Booked', () => {
    component.eaStoreService.docObjData.orderStatus = 'Booked'
    component.rwUser()
    expect(component.editLegalPackage).toBe(false);
  });

  it('should call prepareData', () => {
    component.proposalStoreService.loadLegalPackage = true
    component.prepareData()
    expect(component.displayLegalPackage).toBe(true);
  });
  it('should call prepareData status not COMPLETE', () => {
    component.displayMultiPartner = false
    const backToDashboard = jest.spyOn(component, 'backToDashboard')
    component.proposalStoreService.proposalData = {status:'In progress',}
    component.prepareData()
    expect(backToDashboard).toHaveBeenCalled();
  });

  it('should call prepareData status  COMPLETE', () => {
    component.displayMultiPartner = false
    component.proposalStoreService.proposalData = {status:'COMPLETE',}
    component.prepareData()
    expect(component.displayDocCenterPage).toBe(true);
  });

  it('should call prepareData status  COMPLETE & proposalObjectId', () => {
    component.displayMultiPartner = false
    component.proposalStoreService.proposalData = {status:'COMPLETE'}
    component.eaStoreService.docObjData.proposalObjectId = '123'
    component.prepareData()
    expect(component.displayDocCenterPage).toBe(true);
  });

  it('should call prepareData status  COMPLETE, proposalObjectId & rwAccess', () => {
    component.displayMultiPartner = false
    component.eaStoreService.docObjData.accessType = "RW"
    component.proposalStoreService.proposalData.buyingProgram = "BUYING_PGRM_SPNA"
    component.eaService.features.SPNA_REL = true
    component.proposalStoreService.proposalData = {status:'COMPLETE'}
    component.eaStoreService.docObjData.proposalObjectId = '123'
    component.prepareData()
    expect(component.displayDocCenterPage).toBe(true);
  });
  it('should call checkProposalData', () => {
    component.proposalStoreService.proposalData = {objId: '123'}
    const prepareData = jest.spyOn(component, 'prepareData')
    component.checkProposalData()
    expect(prepareData).toHaveBeenCalled();
  });

});
