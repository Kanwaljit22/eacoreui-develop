import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';


import { PeLandingComponent } from './pe-landing.component';


// class MockEaRestService {


//   getApiCall() {
//     return of({
//       data: {
//         smartAccounts: [{
//           smartAccName: 'test'
//         }],
//         hasEa2Entity: false
//       }
//     })
//   }
// }


xdescribe('PeLandingComponent', () => {
  let component: PeLandingComponent;
  let fixture: ComponentFixture<PeLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeLandingComponent, LocalizationPipe ],
      imports: [HttpClientModule, RouterTestingModule],
          providers: [EaRestService, EaStoreService, LocalizationService, EaService, ProposalStoreService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
