import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { WithdrawExceptionRequestComponent } from './withdraw-exception-request.component';


//test-covered
describe('WithdrawExceptionRequestComponent', () => {
    let component: WithdrawExceptionRequestComponent;
    let fixture: ComponentFixture<WithdrawExceptionRequestComponent>;

    const activeModalMock = {
        close: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WithdrawExceptionRequestComponent],
            providers: [
                
                { provide: NgbActiveModal, useValue: activeModalMock }, LocaleService

            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WithdrawExceptionRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close activeModal with continue: true when continue() is called', () => {
        component.continue();
        expect(activeModalMock.close).toHaveBeenCalledWith({ continue: true });
    });

    it('should close activeModal with continue: false when cancel() is called', () => {
        component.cancel();
        expect(activeModalMock.close).toHaveBeenCalledWith({ continue: false });
    });

    

});
