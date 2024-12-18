import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing"
import { RecommendedContentService } from "./recommended-content.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { DocumentCenterRecommendedContentComponent } from "./document-center-recommended-content.component";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { Router } from "@angular/router";
import { of } from "rxjs";


describe('DocumentCenterRecommendedContentComponent', () => {
    let component:DocumentCenterRecommendedContentComponent;
    let fixture:ComponentFixture<DocumentCenterRecommendedContentComponent>;
    const url = "https://localhost:4200/";

    class MockAppDataService {
        userId = '123';
        customerID = '123';
        customerName = 'test';
        isQualOrPropListFrom360Page = true;
        get getAppDomain() {
            return url;
        }
        userInfo = {
            userId: "123",
            accessLevel :3
        }
    }

    class MockProposalDataService {
        proposalDataObject = { proposalData: { groupName: "test" , linkedProposalsList:[{architecture_code:'test'}] }, status:'test' }
      }
      
    class MockRouter{
        url  ={
            includes : (arg)=>{
                return true
            }
        }
    }
    class MockConstantService{
        DC=2;
        DNA=4;
        SECURITY=5;
        SALESCONNECT_DC="EA_DC";
        SALESCONNECT_DNA="EA_DNA";
        SALESCONNECT_SECURITY="EA_Security"
    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations:[DocumentCenterRecommendedContentComponent],
            providers:[
            RecommendedContentService,
            {provide:AppDataService, useClass:MockAppDataService},
            {provide:ProposalDataService, useClass:MockProposalDataService},
            {provide:ConstantsService, useClass:MockConstantService},
            {provide:Router, useClass:MockRouter}
        ],
            imports:[HttpClientTestingModule]
        }).compileComponents();

       fixture = TestBed.createComponent(DocumentCenterRecommendedContentComponent);
       fixture.detectChanges();
       component = fixture.componentInstance;
    }));



    it('should call ngOnInit', () => {
        const recommendedcontent_service = fixture.debugElement.injector.get(RecommendedContentService);
        
        jest.spyOn(component,'getTagsByArchitecture') ;
        jest.spyOn(recommendedcontent_service,'getRecommendedContentData').mockReturnValue(of({data:{recomendedContent:'test'}})) ;


        component.ngOnInit();

        component['recommendedcontent_service'].getRecommendedContentData('test').subscribe((res:any) => {
            expect(component.rcmdContentData).toBe('test');
            expect(component.apiCallComplete).toBe(true);
        })

        expect(component.getTagsByArchitecture).toBeCalled();
    });


    it('should call ngOnInit branch 1', () => {
        jest.spyOn(component,'getTagsByArchitecture') 
        const router = fixture.debugElement.injector.get(Router);
        router.url.includes = function (a){
          return false;
        }

        const appDataSer = fixture.debugElement.injector.get(AppDataService);
        appDataSer.userInfo.accessLevel = 4;
        appDataSer.isGroupSelected =false;
        component.ngOnInit();
        expect(component.getTagsByArchitecture).toBeCalled();
    });

    it('should call downloadDocuments', () => {
        window.open = jest.fn();
        jest.spyOn(window,'open') 
        component.downloadDocuments('test');
        expect(window.open).toBeCalledWith('test')
    });

    it('should call showSaleshubDetail', () => {
        window.open = jest.fn();
        jest.spyOn(window,'open') 
        component.showSaleshubDetail('test');
        expect(window.open).toBeCalledWith('test')
    });

    it('should call getTagsByArchitecture',() => {
        const res1 = component.getTagsByArchitecture(2);
        const res2 = component.getTagsByArchitecture(4);
        const res3 = component.getTagsByArchitecture(5);
        expect(res1).toBe("EA_DC")
        expect(res2).toBe("EA_DNA")
        expect(res3).toBe("EA_Security")
    });

    it('should call shareDocuments', () => {
        component.showCopy_saleshub =1;
        component.shareDocuments('test', 1, 'saleshub');
        expect( component.showCopy_saleshub).toBe(-1)
        expect( component.showCopy).toBe(-1)

    });

    it('should call shareDocuments b1', () => {
        component.showCopy =1;
        component.shareDocuments('test', 1, 'test');
        expect( component.showCopy_saleshub).toBe(-1)
        expect( component.showCopy).toBe(-1)
    });

    it('should call ngOnDestroy', () => {
       component.ngOnDestroy();
    });

    it('should call copy',fakeAsync( () => {
        document.execCommand = jest.fn();
        const event ={
            target:{
                innerHTML:'',
                style:{cursor:''},
                disabled :false,
                previousElementSibling:
                {
                    focus(){},
                    select(){}
                }
            },
        }
        component.copy(event);
        tick(2000)
        expect( component.showCopy).toBe(-1);
        expect( component.showCopy_saleshub).toBe(-1);
     }));
})