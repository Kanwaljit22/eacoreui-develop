import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeRoleComponent } from './change-role.component';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CurrencyPipe } from '@angular/common';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
}

describe('ChangeRoleComponent', () => {
  let component: ChangeRoleComponent;
  let fixture: ComponentFixture<ChangeRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRoleComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, AppRestService, LocaleService, AppDataService, MessageService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, CurrencyPipe],
      imports: [HttpClientModule, NgbDropdownModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('call ngOnInit', () => {
    component.ngOnInit()
    expect(component.selectedRole).toEqual('Select Role');
  });
  
  it('call changeRole', () => {
    let role = 'test'
    component.changeRole(role)
    expect(component.enableProceed).toBe(true)
  });
  
  it('call proceed', () => {
    let mock = {
        "data" : {

        }
    }
    const appDataService = fixture.debugElement.injector.get(AppDataService);
    appDataService.userInfo = {
        userId: 'test'
    }
    component.selectedRole = 'developer';
    const restService = fixture.debugElement.injector.get(AppRestService);
    jest.spyOn(restService, "applyUserRole").mockReturnValue(of(mock));
    component.proceed()
    expect(component.enableProceed).toBe(false)
  });
  
});
