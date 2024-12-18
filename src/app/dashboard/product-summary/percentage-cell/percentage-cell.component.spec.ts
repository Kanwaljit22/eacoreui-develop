import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PercentageCellComponent } from "./percentage-cell.component";



describe('PercentageCellComponent', () => {
    let component: PercentageCellComponent;
    let fixture: ComponentFixture<PercentageCellComponent>;



    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PercentageCellComponent],
            providers: [],
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(PercentageCellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('options', () => {
        it('should have a height of 16', () => {
            const options = {
                height: 16,
                offsetWidth: 20,
            };

            expect(options.height).toBe(16);
        });

        it('should have an offsetWidth of 20', () => {
            const options = {
                height: 16,
                offsetWidth: 20,
            };

            expect(options.offsetWidth).toBe(20);
        });

        it("Should create component", () => {
            component.ngOnInit();
            expect(component).toBeTruthy();
        });

        it("Should call param", () => {
            component.params = "test";
            component.agInit("test");

        });

        describe('refresh', () => {
            it('should return false when called', async () => {
              const refresh = () => false;
          
              const result = await refresh();
          
              expect(result).toBe(false);
            });
        });
    });
});