import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { ArchitectureBreakdownComponent } from "./architecture-breakdown.component"
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { MessageService } from "../services/message.service";
import { ArchitectureBreakdownService } from "./architecture-breakdown.service";
import { AppDataService } from "../services/app.data.service";
import { Renderer2 } from "@angular/core";
import { of } from "rxjs";

describe('ArchitectureBreakdownComponent', () => {
    let component: ArchitectureBreakdownComponent;
    let fixture : ComponentFixture<ArchitectureBreakdownComponent>;

    class MockProductSummaryService{}
    class MockMessageService{
        displayUiTechnicalError (err){}
        displayMessagesFromResponse(err){}
    }
    class MockArchitectureBreakdownService{
        getTopPartnerData(data){
            return of({myProspectInfo:'test', error:false})
        }
        getPartnerDetailsByCust(data){
            return of({
                data:[{partnerName:'test',partnerKey:'test'}]
            })
        }
    }
    class MockAppDataService {
        validateResponse(res){
            return res;
        }
        subHeaderData={favFlag:false,moduleName:'test',subHeaderVal:''}
        customerID = "123";
        customerName = "test";
        isQualOrPropListFrom360Page = true;
        archName = "test";
        get getAppDomain() {
           return '';
        }
        userInfo = {
          userId: "123",
        };
      }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports:[],
            declarations:[ArchitectureBreakdownComponent],
        providers:[
            {provide:ProductSummaryService, useClass:MockProductSummaryService},
            {provide:MessageService,useClass:MockMessageService},
            {provide:ArchitectureBreakdownService,useClass:MockArchitectureBreakdownService },
            {provide:AppDataService,useClass:MockAppDataService},
            Renderer2]
        }).compileComponents()
    }));


    beforeEach(()=>{
        fixture = TestBed.createComponent(ArchitectureBreakdownComponent);
        component = fixture.componentInstance;    
        component.customerData = {customerName:'test'};
        component.partnerData={partnerId:'123'};
    })

    it("should call ngOnInit", () => {
        jest.spyOn(component,'getPartnerDropdownData' )
        jest.spyOn(component,'getTopPartnerData' )
        component.ngOnInit();
        expect(component.getPartnerDropdownData).toBeCalled()
        expect(component.getTopPartnerData).toBeCalled()
    });

    it("should call ngOnDestroy", () => {
        const renderer = fixture.debugElement.injector.get(Renderer2)
        jest.spyOn(renderer,'removeClass' )
        component.ngOnDestroy();
        expect(component.renderer.removeClass).toBeCalled()
    });

    it("should call showDrop", () => {
        component.showArchDrop =false;
        component.showDrop();
        expect(component.showArchDrop).toBeTruthy()
    })

    it("should call changePartner", () => {
        jest.spyOn(component,'getTopPartnerData' )
        component.changePartner('test');
        expect(component.showArchDrop).toBeFalsy()
        expect(component.partnerData).toBe('test')
        expect(component.getTopPartnerData).toBeCalled()
    });

    it("should call getPartnerDropdownData", () => {
        // jest.spyOn(component,'getTopPartnerData' )
        const service = fixture.debugElement.injector.get(ArchitectureBreakdownService);
        jest.spyOn(service, 'getPartnerDetailsByCust').mockReturnValue(of({data:[{partnerName:'test',partnerKey:'test'}]}))
        component.getPartnerDropdownData();

        component['architectureBreakdownService'].getPartnerDetailsByCust({}).subscribe((res:any) => {
        
            expect(component.partnerDropdown).toBeTruthy()
        })
    })

    it("should call getPartnerDropdownData b1", () => {
        const service = fixture.debugElement.injector.get(ArchitectureBreakdownService);
        jest.spyOn(service, 'getPartnerDetailsByCust').mockReturnValue(of(null))
        component.getPartnerDropdownData();

        component['architectureBreakdownService'].getPartnerDetailsByCust({}).subscribe((res) => {
        })
    })

    it("should call getTopPartnerData", () => {
        const service = fixture.debugElement.injector.get(ArchitectureBreakdownService);
        jest.spyOn(service, 'getTopPartnerData').mockReturnValue(of({myProspectInfo:'test', error:false}))
        component.getPartnerDropdownData();

        component['architectureBreakdownService'].getTopPartnerData({}).subscribe((res) => {
         
        })
    })

    it("should call getTopPartnerData b1", () => {
        const service = fixture.debugElement.injector.get(ArchitectureBreakdownService);
        jest.spyOn(service, 'getTopPartnerData').mockReturnValue(of({ error:false}))
        component.getPartnerDropdownData();

        component['architectureBreakdownService'].getTopPartnerData({}).subscribe((res) => {
         
        })
    })

    it("should call getTopPartnerData b2", () => {
        const service = fixture.debugElement.injector.get(ArchitectureBreakdownService);
        jest.spyOn(service, 'getTopPartnerData').mockReturnValue(of({ error:true}))
        component.getPartnerDropdownData();

        component['architectureBreakdownService'].getTopPartnerData({}).subscribe((res) => {
         
        })
    })
})