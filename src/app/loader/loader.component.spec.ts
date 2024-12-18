import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { EventEmitter } from '@angular/core';


fdescribe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  class MockAppDataService{
    userInfo = {accessLevel:0 ,authorized : false , partnerAuthorized: false};
    userInfoObjectEmitter = new EventEmitter<any>();
    authMessage = { text :'Testing'}
    findUserInfo(){}
    peRecalculateMsg="dummy";
  }

  class MockLocaleService{
    getLocalizedString(value){}
  }
  

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers:[BlockUiService, {provide:LocaleService, useClass: MockLocaleService}, {provide:AppDataService, useClass: MockAppDataService}  ],
      declarations: [ LoaderComponent ]
    })
    .compileComponents();
  }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngOnIt', () => {
    const spy = fixture.debugElement.injector.get(LocaleService);
    const spy1 = fixture.debugElement.injector.get(AppDataService);
    const locale = jest.spyOn(spy, "getLocalizedString").mockReturnValue("test");
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.generatingEAConf).toBe("test");
    expect(component.validatingOrderingRule).toBe("test");
    expect(component.computingPa).toBe("test");
    expect(component.peRecalculateMsg).toBe(spy1.peRecalculateMsg);
    
    
  });
});
