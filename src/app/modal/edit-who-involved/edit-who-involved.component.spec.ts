import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyPipe } from '@angular/common';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { RestApiService } from '@app/shared/services/restAPI.service';
import { APP_CONFIG, AppConfig } from '@app/app-config';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { EditWhoInvolvedComponent } from './edit-who-involved.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { EaRestService } from 'ea/ea-rest.service';
import { FormsModule, ReactiveFormsModule,FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { error } from 'console';




class MockAppDataService {

  customerID = "123";
  customerName = "test";
  isQualOrPropListFrom360Page = true;
  archName = "test";
  invalidDomains = [];
  emailValidationRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
  userInfo = {
    userId: "123",
    roSuperUser: true
  };

  createUniqueId() {
    return 'test'
  }

  getDetailsMetaData() {
    return { }

  }

  getSessionObject() {
    return this.userInfo
  }

  getAppDomain() {
    return '../../';
}

  assignColumnWidth(...a){
      return 100;
  }

  setSessionObject() {

  }

  pageContext = 'ProposalPriceEstimateStep'


  agreementCntEmitter = new EventEmitter<any>();
  headerDataLoaded = new EventEmitter();
  userInfoObjectEmitter = new EventEmitter<any>();
  deleteAgreementDataEmitter = new EventEmitter<any>();

  isTwoTierUser() {
    return false
  }

  getInvalidEmail() {}

  agreementDataEmitter = new EventEmitter<any>();

  linkedSmartAccountObj = { 'name': 'Not Assigned', 'id': '' };
}

class MockQualificationsService  {
    loaCustomerContactUpdateEmitter = new EventEmitter<any>();
    qualification = {
        dealId: '12323',
        title: 'test',
        qualID: '12132',
        prevChangeSubQualId: '12132',
        status: 'Active',
        dealInfoObj: {},
        name: 'test',
        accountManager: { 'firstName': 'test', 'lastName': 'test', 'emailId': 'test', 'userId': 'test' },
        customerInfo: {
          'accountName': 'test',
          'address': 'test11232',
          'smartAccount': 'test',
          'preferredLegalName': 'test',
          'scope': 'test',
          'affiliateNames': 'test',
          'repName': 'test',
          'repTitle': 'test',
          'repEmail': 'test@test.com',
          'filename': 'test',
          'repFirstName': 'test',
          'repLastName': 'test',
          'phoneCountryCode': 'test',
          'phoneNumber': 'test',
          'dialFlagCode': 'test'
        },
        legalInfo: {
          'addressLine1': 'test',
          'addressLine2': 'test3213',
          'city': 'test',
          'country': 'test',
          'state': 'test',
          'zip': '12132'
        },
        address: {
            'addressLine1': 'test',
            'addressLine2': 'test3213',
            'city': 'test',
            'country': 'test',
            'state': 'test',
            'zip': '12132'
        },
        cam:
        {
          'firstName': 'test',
          'lastName': 'test',
          'camEmail': 'test@test.com',
          'beGeoId': 0,
          'cecId': '',
          'role': ''
        }
      };
}


const NgbActiveModalMock = {
    close: jest.fn().mockReturnValue('close')
 }
 

describe('EditWhoInvolvedComponent', () => {
  let component: EditWhoInvolvedComponent;
  let fixture: ComponentFixture<EditWhoInvolvedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWhoInvolvedComponent ],
      providers: [ { provide:AppDataService, useClass: MockAppDataService}, MessageService,{ provide: NgbActiveModal, useValue: NgbActiveModalMock },{ provide:QualificationsService, useClass:MockQualificationsService},DocumentCenterService, WhoInvolvedService, UtilitiesService, CurrencyPipe, LocaleService, AppRestService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, RestApiService, { provide: APP_CONFIG, useValue: AppConfig }, EaService, ProposalDataService, ProposalPollerService, EaRestService],
      imports: [HttpClientTestingModule, FormsModule,ReactiveFormsModule, RouterTestingModule],
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWhoInvolvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('call ngOninit', () => {
    let contact : any = {
        'repName': 'test',
        'repTitle': 'title',
        'repEmail': 'email@test.com',
    }
    expect(component).toBeTruthy()

    component.isPartnerLed = true;
    component.isPriceEstimateStep = true;
    let documentCenterService = fixture.debugElement.injector.get(DocumentCenterService)
    documentCenterService.documentCenterData = [{
        representativeContainer:[
            [
                {
                    'heading': 'NAME',
                    'data': 'test'
                  },
                  {
                    'heading': 'TITLE',
                    'data': 'title'
                  },
                  {
                    'heading': 'EMAIL',
                    'data': 'email@test.com'
                  }
                  ,{
                    'heading': 'phoneNumber',
                    'data': 1322324324
                  },{
                    'heading': 'phoneCountryCode',
                    'data': 12
                  },{
                    'heading': 'dialFlagCode',
                    'data': 42132
                  }
              ],
              [
                {
                    'heading': 'NAME',
                    'data': 'test'
                  },
                  {
                    'heading': 'TITLE',
                    'data': 'title'
                  },
                  {
                    'heading': 'EMAIL',
                    'data': 'email@test.com'
                  }
                  ,{
                    'heading': 'phoneNumber',
                    'data': 1322324324
                  },{
                    'heading': 'phoneCountryCode',
                    'data': 12
                  },{
                    'heading': 'dialFlagCode',
                    'data': 42132
                  }
              ]
        ]
    }]
    component.ngOnInit()
    expect(component.custRepersentativeName).toBe("")

    component.loaCustomerContact = {
        'repName': "test",
        'repTitle': 'title',
        'repEmail': 'email@test.com',
    }
    component.ngOnInit();
    expect(component.custRepersentativeName).toBe('test')

    component.isPartnerLed = false;
    component.CustomerInfoIdx = 0;
    component.ngOnInit();
    expect(component.custRepersentativeName).toBe('test')

    component.isPartnerLed = false;
    component.CustomerInfoIdx = 1;
    component.ngOnInit();
    expect(component.custRepersentativeName).toBe('test')

    let appDataServic = fixture.debugElement.injector.get(AppDataService)
    appDataServic.pageContext = "test"
    component.CustomerInfoIdx = 0;
    component.ngOnInit();
    expect(component.custRepersentativeName).toBe('test')

   
    appDataServic.pageContext = "test"
    component.CustomerInfoIdx = 1;
     let qualSer = fixture.debugElement.injector.get(QualificationsService);
     qualSer.additionalCustomerContacts = [
        contact
     ]
    appDataServic.pageContext = "test"
    component.ngOnInit();
    expect(component.custRepersentativeName).toBe('test')
    
   })

   it('call updateCustomerContact', () => {
    component.phoneForm.get("phone").setValue({e164Number:'2132432221',dialCode:232, countryCode:111});
    component.isPartnerLed = true;
    component.form.get("custPreferredName").setValue("test");
    component.form.get("custRep").get("custRepName").setValue("test")
    component.form.get("custRep").get("custRepTitle").setValue("title");
    component.form.get("custRep").get("custRepEmailId").setValue("test@email.com");
    component.form.get("addressLine1").setValue("test");
    component.form.get("addressLine2").setValue("lane2");
    component.form.get("city").setValue("city");
    component.form.get("state").setValue("state");
    component.form.get("zip").setValue("zip");
    component.form.get("city").setValue("country");
    component.isPriceEstimateStep = false;
    component.custRepersentativeName = "custRepersentativeName";
    component.custRepersentativeTitle = "custRepersentativeTitle";
    component.custRepersentativeEmailId = "email@email.com";
    let documentCenterService = fixture.debugElement.injector.get(DocumentCenterService)
    let res = {
        data:{
            customerContact: {
                'firstName': 'test', 'lastName': 'test', 'emailId': 'test', 'userId': 'test'
            }
        }
    }
    let qualService = fixture.debugElement.injector.get(QualificationsService)
    qualService.loaData = {
        partnerBeGeoId:1232,
        customerGuId:121
    }
    jest.spyOn(documentCenterService, "updateFromLOAWhoInvolvedModal").mockReturnValue(of(res))
    
    component.updateCustomerContact();
    expect(component.custRepersentativeLegalName).toBe("test");

   })

   it('call addAdditionalCustomerContact', () => {
    component.phoneForm.get("phone").setValue({e164Number:'2132432221',dialCode:232, countryCode:111});
    component.CustomerInfoIdx = 2
    component.form.get("custPreferredName").setValue("test");
    component.form.get("custRep").get("custRepName").setValue("test")
    component.form.get("custRep").get("custRepTitle").setValue("title");
    component.form.get("custRep").get("custRepEmailId").setValue("test@email.com");
    component.form.get("addressLine1").setValue("test");
    component.form.get("addressLine2").setValue("lane2");
    component.form.get("city").setValue("city");
    component.form.get("state").setValue("state");
    component.form.get("zip").setValue("zip");
    component.form.get("city").setValue("country");
    component.isPriceEstimateStep = false;
    component.custRepersentativeName = "custRepersentativeName";
    component.custRepersentativeTitle = "custRepersentativeTitle";
    component.custRepersentativeEmailId = "email@email.com";
    let documentCenterService = fixture.debugElement.injector.get(DocumentCenterService)
    let res = {
        error:false
        
    }
    documentCenterService.documentCenterData = [{
        representativeContainer:[
            {
                'heading': 'NAME',
                'data': ''
              },
              [
                {
                    'heading': 'NAME',
                    'data': ''
                  },
                  {
                    'heading': 'TITLE',
                    'data': ''
                  },
                  {
                    'heading': 'EMAIL',
                    'data': ''
                  }
                  ,{
                    'heading': 'phoneNumber',
                    'data': ''
                  },{
                    'heading': 'phoneCountryCode',
                    'data': ''
                  },{
                    'heading': 'dialFlagCode',
                    'data': ''
                  }
              ]
        ]
    }]
    jest.spyOn(documentCenterService, "addCustomerContact").mockReturnValue(of(res))
    
    component.addAdditionalCustomerContact();

   })

   it('call updateAdditionalCustomerContact', () => {
    component.phoneForm.get("phone").setValue({e164Number:'2132432221',dialCode:232, countryCode:111});
    component.CustomerInfoIdx = 2
    component.form.get("custPreferredName").setValue("test");
    component.form.get("custRep").get("custRepName").setValue("test")
    component.form.get("custRep").get("custRepTitle").setValue("title");
    component.form.get("custRep").get("custRepEmailId").setValue("test@email.com");
    component.form.get("addressLine1").setValue("test");
    component.form.get("addressLine2").setValue("lane2");
    component.form.get("city").setValue("city");
    component.form.get("state").setValue("state");
    component.form.get("zip").setValue("zip");
    component.form.get("city").setValue("country");
    component.isPriceEstimateStep = false;
    component.custRepersentativeName = "custRepersentativeName";
    component.custRepersentativeTitle = "custRepersentativeTitle";
    component.custRepersentativeEmailId = "email@email.com";
    let qualService = fixture.debugElement.injector.get(QualificationsService);
    qualService.additionalCustomerContacts = [
        {
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
            'id':component.CustomerInfoIdx,
            'phoneNumber': '',
            'phoneCountryCode': '',
            'dialFlagCode': ''
        }
    ]
    let documentCenterService = fixture.debugElement.injector.get(DocumentCenterService)
    let res = {
        data:{
            'firstName': 'test', 'lastName': 'test', 'emailId': 'test', 'userId': 'test'
        }
    }
    documentCenterService.documentCenterData = [{
        representativeContainer:[
            {
                'heading': 'NAME',
                'data': ''
              },
              [
                {
                    'heading': 'NAME',
                    'data': ''
                  },
                  {
                    'heading': 'TITLE',
                    'data': ''
                  },
                  {
                    'heading': 'EMAIL',
                    'data': ''
                  }
                  ,{
                    'heading': 'phoneNumber',
                    'data': ''
                  },{
                    'heading': 'phoneCountryCode',
                    'data': ''
                  },{
                    'heading': 'dialFlagCode',
                    'data': ''
                  }
              ]
        ]
    }]
    jest.spyOn(documentCenterService, "updateCustomerContact").mockReturnValue(of(res))
    
    component.updateAdditionalCustomerContact();

   })

   
   it('call setCustRepresentativeDataFromDoc', () => {
    let documentCenterService = fixture.debugElement.injector.get(DocumentCenterService)
    documentCenterService.documentCenterData = [{
        representativeContainer:[
            {
                'heading': 'NAME',
                'data': ''
              },
              [
                {
                    'heading': 'NAME',
                    'data': 'test'
                  },
                  {
                    'heading': 'TITLE',
                    'data': 'title'
                  },
                  {
                    'heading': 'EMAIL',
                    'data': 'email@test.com'
                  }
                  ,{
                    'heading': 'phoneNumber',
                    'data': 1322324324
                  },{
                    'heading': 'phoneCountryCode',
                    'data': 12
                  },{
                    'heading': 'dialFlagCode',
                    'data': 42132
                  }
              ]
        ]
    }]
    
    component.setCustRepresentativeDataFromDoc(1);

   })

   it('call getCountryOfTransactions', () => {
    let involvedService = fixture.debugElement.injector.get(WhoInvolvedService)
    let res = {
        countries:[
            {
                countryName : "test",
                isoCountryAlpha2: "testAlpha"
            }
        ]
    }
    jest.spyOn(involvedService, "getCountryOfTransactions").mockReturnValue(of(res))
    
    component.getCountryOfTransactions();

   })

   it('call getStateList', () => {
    let involvedService = fixture.debugElement.injector.get(WhoInvolvedService)
    let res = {
        data:[
            {
                state : "test"
            }
        ]
    }
    jest.spyOn(involvedService, "getStateList").mockReturnValue(of(res))
    
    component.getStateList('test');

   })

   it('call nameValidation', () => {
    component.form.get("custRep").get("custRepName").setValue("")
    component.nameValidation();

   })

   it('call titleValidation', () => {
    component.form.get("custRep").get("custRepTitle").setValue("")
    component.titleValidation();

   })

   it('call emailValidation', () => {
    component.form.get("custRep").get("custRepEmailId").setValue("email@test.com")
    component.emailValidation();

   })

   it('call emailValidation', () => {
    component.domainValidation("email@test.com");

   })

   it('call setCustRepresentativeDataFromQual', () => {
    const data = {
        repName: "test",
        repEmail: "email@test.com",
        repTitle: "title"
    }
    component.setCustRepresentativeDataFromQual(data);

   })

   it('call onCOTChange', () => {
    const data = {
        countryName: "test",
        isoCountryAlpha2: "state"
    }
    component.onCOTChange(data);

   })

   it('call onStateChange', () => {
    const data = {
        state: "test",
        isoCountryAlpha2: "state"
    }
    component.onStateChange(data);

   })

   it('call preparePhoneValue', () => {
    const data = {
        phoneNumber: 92823211,
        phoneCountryCode: 12,
        dialFlagCode: 1233
    }
    component.preparePhoneValue(data);

   })
  

})