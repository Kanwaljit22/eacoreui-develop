import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { PollerService } from 'ea/poller.service';
import { of } from 'rxjs';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { EaFlowComponent } from './ea-flow.component';

class MockEaRestService {

    getEampApiCall() {
      return of({
        data:{

        },
      })
    }
}

class MockpollerService {
    invokeOauthPollerservice() {
        return of({
        })
    }
}

xdescribe('EaFlowComponent', () => {
    let component: EaFlowComponent;
    let fixture: ComponentFixture<EaFlowComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ EaFlowComponent,LocalizationPipe ],
          imports: [HttpClientModule, RouterTestingModule],
          providers: [{provide:EaRestService, useClass: MockEaRestService}, {provide:PollerService, useClass: MockpollerService}, EaStoreService, EaPermissionsService, EaService]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(EaFlowComponent);
        component = fixture.componentInstance;
        let route = fixture.debugElement.injector.get(ActivatedRoute);
        route.snapshot.data.userData = {
            data : {

            },
            maintainace: {

            }
        }
        fixture.detectChanges();
        
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

   it('should call ngOnInit', () => {
    let route = fixture.debugElement.injector.get(ActivatedRoute);
    route.snapshot.data.userData = {
        data : {

        }
    }
    component.ngOnInit();

    route.snapshot.data.userData = {
        data: {
            permissions: {
                featureAccess: [{
                    permission: true
                }]
            }
        }
    }
    component.ngOnInit();
    });

    it('should call ngOnInit', () => {

        let service = fixture.debugElement.injector.get(EaStoreService)
        service.maintainanceObj = {
                  underMaintainance: true
            }
       sessionStorage.setItem('maintainanceObj', JSON.stringify(service.maintainanceObj));
       component.ngOnInit();
    })

    it('should call getMenuBarUrl', () => {
        const data = {
            error: true
        } 
        let service = fixture.debugElement.injector.get(EaRestService);
        jest.spyOn(service, 'getEampApiCall').mockReturnValue(of(data));
        component.getMenuBarUrl();
    })

    // it('should call checkForTrilium', () => {
    //     let data = {
    //         value: 'N'
    //     } 
    //     let service = fixture.debugElement.injector.get(EaRestService);
    //     jest.spyOn(service, 'getEampApiCall').mockReturnValue(of(data));
    //     component.checkForTrilium();
        
    // })

    // it('should call checkForTrilium', () => {
    //     let data = {
    //         value: 'Y'
    //     } 
    //     let service = fixture.debugElement.injector.get(EaRestService);
    //     jest.spyOn(service, 'getEampApiCall').mockReturnValue(of(data));
    //     component.checkForTrilium();
        
    // })

    it('should call getOauthToken', () => {
        let data = {
            data: {
                token: 'test'
            }
        } 
        let service = fixture.debugElement.injector.get(PollerService);
        jest.spyOn(service, 'invokeOauthPollerservice').mockReturnValue(of(data));
        component.getOauthToken();
        
    })
      
 });