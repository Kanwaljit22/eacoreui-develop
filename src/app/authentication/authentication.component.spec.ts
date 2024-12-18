import { ComponentFixture, TestBed, inject, waitForAsync  } from '@angular/core/testing';
import { AuthenticationComponent } from './authentication.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BreadcrumbsService } from '@app/core/breadcrumbs/breadcrumbs.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import {  EventEmitter } from '@angular/core';


describe('AuthenticationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;

class MockBreadcrumbsService{
  showOrHideBreadCrumbs(value){}
}

class MockLocaleService{
  getLocalizedString (){}
}

class MockAppDataService{
  userInfo = {accessLevel:0 ,authorized : false , partnerAuthorized: false};
  userInfoObjectEmitter = new EventEmitter<any>();
  authMessage = { text :'Testing'}
  findUserInfo(){}
}

class MockQualificationsService{}

class MockBlockUiService{
  spinnerConfig = {
     blockUI : ()=>{}
  }
}

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationComponent ],
      providers:[
        {provide:BreadcrumbsService,useClass:MockBreadcrumbsService},
        {provide:LocaleService,useClass:MockLocaleService},
        {provide:AppDataService,useClass:MockAppDataService},
        {provide:QualificationsService,useClass:MockQualificationsService},
        {provide:BlockUiService, useClass:MockBlockUiService},
        WhoInvolvedService,
      ],
      imports:[HttpClientTestingModule],
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call ngOnint', () => {
     const appDserv =  fixture.debugElement.injector.get(AppDataService);
     const breadCServ =  fixture.debugElement.injector.get(BreadcrumbsService);
     const bfunc = jest.spyOn(breadCServ , 'showOrHideBreadCrumbs');
     const func = jest.spyOn(appDserv , 'findUserInfo');
     const subs=  jest.spyOn(appDserv.userInfoObjectEmitter, 'subscribe');
     fixture.detectChanges();
     component.ngOnInit();
     expect(func).toBeCalled();
     expect(bfunc).toBeCalled();
     expect(subs).toBeCalled();
     expect(component.authMessage).toEqual(appDserv.authMessage.text);
  });


  it("should call ngOnint with emitted value in userInfoObjectEmitter", inject(
    [AppDataService],
    (appDataService) => {
      appDataService.userInfoObjectEmitter.subscribe((message) => {
        expect(message).toBe("test");
      });
      fixture.detectChanges();
      component.ngOnInit();
      appDataService.userInfoObjectEmitter.emit('test');
    }
  ));

  it('should call ngOnint with authorized user', () => {
    let val: Promise<true>;
    const appDserv =  fixture.debugElement.injector.get(AppDataService);
    appDserv.userInfo={accessLevel:1 ,authorized : true , partnerAuthorized: true}
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    fixture.detectChanges();
    component.ngOnInit()
    expect(component["router"].navigate).toHaveBeenCalledWith(['']);
  });

});
