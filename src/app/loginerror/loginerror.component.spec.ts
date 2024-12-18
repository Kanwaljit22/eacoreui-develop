import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LoginerrorComponent } from "./loginerror.component";

describe('LoginerrorComponent', () => {
    let component: LoginerrorComponent;
    let fixture: ComponentFixture<LoginerrorComponent>;



    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LoginerrorComponent],
            providers: [],
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(LoginerrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should have the correct errorMessage', () => {
        expect(component.errorMessage).toBe('You are not authorized to access this tool.');
      });

      it("Should create component", () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });


});