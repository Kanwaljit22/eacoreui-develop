import { TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuthGuardService } from "./auth-guard.service";
import { LocaleService } from "./locale.service";
import { AppDataService } from "./app.data.service";
import { MessageService } from "./message.service";
import { ConstantsService } from "./constants.service";
import { Router } from "@angular/router";

describe("AuthGuardService", () => {
  let service: AuthGuardService;
  const url = "https://localhost:4200/";

  class MockLocaleService {
    getLocalizedString(value) {}
    getLocalizedMessage(){return 'test'}
  }

  
  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }
  class MockAppDataService{
    setMessageObject=jest.fn()
    customerID='123';
    customerName='test';
    isQualOrPropListFrom360Page=true;
   get getAppDomain(){
        return url;
      }
      userInfo ={
        userId:"123"
      }
  }

  class MockMessageService {
    displayMessages=jest.fn()
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        Router,
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: AppDataService,useClass: MockAppDataService },
        { provide: MessageService, useClass:MockMessageService },
        { provide: ConstantsService, useClass:MockConstantsService }
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(AuthGuardService);
  }));

  it("should call canActivate", () => {
   
    service.canActivate('test' as any , 'test' as any)
  });

  it("should call canActivate b1", () => {
    service.appDataService.proxyUser=false
    localStorage.setItem('isAdmin', 'true')
    service.canActivate('test' as any , 'test' as any)
    localStorage.removeItem('isAdmin')
  });

  it("should call canActivate b1", () => {
    service.appDataService.proxyUser=true
    localStorage.setItem('isAdmin', 'true')
    service.canActivate('test' as any , 'test' as any)
    localStorage.removeItem('isAdmin')
  });
});
