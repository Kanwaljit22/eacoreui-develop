import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DealCellComponent } from "./deal-cell.component";
import { LocaleService } from "@app/shared/services/locale.service";


describe('DealCellComponent',()=>{
    let component: DealCellComponent;
    let fixture: ComponentFixture<DealCellComponent>;

const mockLocaleServiceValue = {
    getLocalizedString :jest.fn().mockReturnValue({key:'jest' , value :'test'})
}
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ DealCellComponent ],
          providers:[
            {provide: LocaleService , useValue:mockLocaleServiceValue}
          ],
          imports:[],
          
        })
        .compileComponents();
      }));
    
      beforeEach(() => {
        fixture = TestBed.createComponent(DealCellComponent);
        component = fixture.componentInstance;
      });


      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should call agInit', () => {
          component.agInit('test');
          fixture.detectChanges();
          expect(component.params).toBe('test');
      });


      it('should call refresh',async  () => {
        component.params = {context:{parentChildIstance:{
            downloadLoccDoc:(p1,p2,p3) => {},
            getQualListForDeal:(data)=>{}
        }}}
        component.download({});
        component.goToEaQual({});
        const res = component.refresh();
        expect(res).toBeFalsy();
    });
    
    it('should call download', () => {
        component.params = {context:{parentChildIstance:{
            downloadLoccDoc:(p1,p2,p3) => {}
        }}};
        const downloadLoccDoc = jest.spyOn(component.params.context.parentChildIstance , 'downloadLoccDoc')
        component.download({});
        expect(downloadLoccDoc).toBeCalled();
      });


      it('should call goToEaQual', () => {
        component.params = {context:{parentChildIstance:{
            getQualListForDeal:(data)=>{}
        }}};

        const getQual = jest.spyOn(component.params.context.parentChildIstance , 'getQualListForDeal')
        component.goToEaQual({});
        expect(getQual).toHaveBeenCalled();
      });

});