import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { SmartAccountComponent } from './smart-account.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

class MockEaRestService {
  postApiCall(){
    return of({
      
    })
  }
  getApiCallJson(){
    return of({
      
    })
  }
  getApiCall() {
    return of({
      data: {
        smartAccounts: [{
          smartAccName: 'test'
        }],
        hasEa2Entity: false
      }
    })
  }
}


describe('SmartAccountComponent', () => {
    let component: SmartAccountComponent;
    let fixture: ComponentFixture<SmartAccountComponent>;
    
    const routerSpy = {'Router': jest.fn().mockReturnValue('navigateByUrl')};

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ SmartAccountComponent,LocalizationPipe ],
          imports: [HttpClientModule, RouterTestingModule],
          providers: [{provide:EaRestService, useClass: MockEaRestService}, EaStoreService, LocalizationService, EaService, ProposalStoreService, DataIdConstantsService]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(SmartAccountComponent);
        component = fixture.componentInstance;
        component.dealId = '123',
        component.proposalId = '123'
        let val: Promise<boolean>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
      const func = jest.spyOn(component, 'getParamDetails');
      component.ngOnInit()
      expect(func).toHaveBeenCalled();
    });

    it('should call getParamDetails', () => {
      component.sid = '123'
      component.getParamDetails()
    });

    it('should call setSmartAccount', () => {
      const smartAcc = {
        smrtAccntName: 'test'
      }
      component.setSmartAccount(smartAcc)
      expect(component.showSmartAccounts).toBeFalsy();
    });


    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          proposalId: '123',
          hasEa2Entity: false
        }
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      const func = jest.spyOn(component, 'routeToPage').mockReturnValue();
      component.proposalId = '123'
      component.dealId ='123'
      component.getSmartAccountData()
      expect(func).toHaveBeenCalledWith('ea/project/proposal/123')
    });

    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          
          hasEa2Entity: true,
          proposalId: '123'
        }
      }
      let val: Promise<true>;
      
      jest.spyOn(component.router, 'navigate').mockReturnValue(val);
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      component.proposalId = '123'
      component.dealId ='123'
      component.getSmartAccountData()
      expect(component.router.navigate).toHaveBeenCalledWith(['qualifications/proposal/123']);
    });

    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          qualificationId: '123',
          hasEa2Entity: true
        }
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      let val: Promise<true>;
      
      jest.spyOn(component.router, 'navigate').mockReturnValue(val);
      component.proposalId = '123'
      component.quoteId ='123'
      component.getSmartAccountData()
      expect(component.router.navigate).toHaveBeenCalledWith(['qualifications/123']);
    });

    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          smartAccounts: '',
          hasEa2Entity: true
        }
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      component.proposalId = '123'
      component.quoteId ='123'
      component.getSmartAccountData()
      expect(component.disableEA3 ).toBeTruthy();
    });

    it('should call getSmartAccountData4',  fakeAsync(() => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          smartAccounts: 'test',
          hasEa2Entity: true
        }
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      component.proposalId = '123'
      component.quoteId ='123'
      component.getSmartAccountData()
      tick(350);
      expect(component.displayPopup ).toBeTruthy();
      flush();
    }));

    it('should call routeToPage', () => {
     const url = 'http://localhost:9876/ea/project/123';
     component.routeToPage(url);

    })

    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        data: {
          hasEa2Entity: false,
          projectId: '123',
          smartAccounts: [{
            smrtAccntName: 'test'
          }]
        }
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      jest.spyOn(component, 'routeToPage').mockReturnValue();
      component.proposalId = '123'
      component.sid ='123'
      component.getSmartAccountData()
      expect(component.routeToPage).toHaveBeenCalledWith('ea/project/123');
    });

    it('should call getSmartAccountData', () => {
      const service = fixture.debugElement.injector.get(EaRestService);
      const data = {
        error: true
      }
      jest.spyOn(service, 'getApiCall').mockReturnValue(of(data));
      component.proposalId = '123'
      component.sid ='123'
      component.getSmartAccountData()
    });

    it('should call redirectToExternalLanding', () => {
      component.dealId = '123'
      jest.spyOn(component, 'routeToPage').mockReturnValue();
      component.redirectToExternalLanding()
      expect(component.routeToPage).toHaveBeenCalledWith('qualifications/external/landing?did=123');
    });

    it('should call goToEamp', () => {
      component.showEa2 = true;
      component.isOnlyDealPresent = true;
      component.dealId = '123'
      let val: Promise<true>;
      jest.spyOn(component.router, 'navigateByUrl').mockReturnValue(val);
      component.goToEamp()
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('prospects', Object({ replaceUrl: true }))
    });

    it('should call goToEamp', () => {
      component.showEa2 = true;
      component.isOnlyDealPresent = false;
      component.proposalId = '123'
      let val: Promise<true>;
      jest.spyOn(component.router, 'navigateByUrl').mockReturnValue(val);
      component.goToEamp()
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('qualifications/external/landing?pid=123', { replaceUrl: true })
    });

    it('should call goToEamp', () => {
      component.showEa2 = false;
      component.dealId = '123'
      component.goToEamp()
    });

    it('should call goToVnext', () => {
      component.quoteId = '123';
      component.dealId = '123'
      jest.spyOn(component, 'routeToPage').mockReturnValue();
      component.goToVnext()
      // expect(component.routeToPage).toHaveBeenCalledWith('ea/project/create?did=123');
    });

    it('should call goToVnext', () => {
      component.dealId = '123';
      component.selectedSmartAccount = ''
      jest.spyOn(component, 'routeToPage').mockReturnValue();
      component.goToVnext()
      // expect(component.routeToPage).toHaveBeenCalledWith('ea/project/create?did=123');
    });

      it('should call selectView', () => {
        component.disableEA3 = false;
        const val = true;
        component.selectView(val)
        expect(component.showEa2).toBe(val);
      });

      it('should call selectView', () => {
        component.disableEA3 = true;
        const val = false;
        component.selectView(val)
      });

      it('should call requestNewSmartAccount', () => {
        jest.spyOn(component.eaService, 'redirectToNewSmartAccount')
        component.requestNewSmartAccount()
        expect(component.eaService.redirectToNewSmartAccount).toHaveBeenCalled();
      });
      
 });