import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SuitesHeaderComponent } from "./suites-header.component";
import { EventEmitter } from "@angular/core";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ManageSuitesService } from "../manage-suites.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { ConstantsService } from "@app/shared/services/constants.service";


describe('SuitesHeaderComponent', () => {
    let component: SuitesHeaderComponent;
    let fixture: ComponentFixture<SuitesHeaderComponent>;
    let params:any;
    class MockAppDataService{
        customerID='123';
        customerName='test';
        isQualOrPropListFrom360Page=true;
        archName='test';
       get getAppDomain(){
            return '';
          }
          userInfo ={
            userId:"123"
          }
      }

      class MockProposalDataService{
        proposalDataObject = {
          proposalId:'123'
        }
      }

     class MockManageSuitesService{
        selectedAtoEmitter= new EventEmitter();
        cxSuiteSelectionEmitter= new EventEmitter();
        suitesData=[];
     }
     class MockUtilitiesService{
        getFloatValue(a){
            return 0.0;
        }
        formatValue(a){
            return 0;
        }
        isNumberKey(e){
            return true;
        }
     }
     class MockPermissionService{}

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SuitesHeaderComponent],
            imports:[ ],
            providers: [
                {provide:AppDataService, useClass:MockAppDataService},
                {provide:ManageSuitesService, useClass:MockManageSuitesService},
                {provide:ProposalDataService, useClass:MockProposalDataService},
                LocaleService,
                ConstantsService
                // {provide:PermissionService, useClass:MockPermissionService},
                // {provide:UtilitiesService, useClass:MockUtilitiesService},                
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SuitesHeaderComponent);
        component = fixture.componentInstance;

         params = {
            colDef: {headerName: 'Solutions & Suites', field: 'poolSuiteLineName', cellRenderer: 'agGroupCellRenderer', width: 630, suppressSizeToFit: true},
            column: 'status',
            value: 'test-value',
            data: {
              enrollmentId: 5,
              tiers: [{name: 'test'}],
              ato: [{atoProductName:'test',selected:false }],
              cxSuites: [{attachRate:'test'}]
            },
            node: {
              level: 2,
              setSelected:(params) => {
                
              }
            },
            modalVar:{open : function(){
                return { result : { then : (param) =>{  }} }
            }},
            context:{parentChildIstance:{headerCheckBoxHanldeEmitter: new EventEmitter(), headerCheckBoxAction:(arg)=>{}}}
          };
          
        component.agInit(params);
    
        fixture.detectChanges();
    });

    it("Should create component", () => {
        expect(component).toBeTruthy();
    });

    it("Should call checkValue", () => {
        component.isChecked = true;
        const mckcall = jest.spyOn(component.params.context.parentChildIstance,'headerCheckBoxAction')
        component.checkValue()
        expect(mckcall).toBeCalledWith(true);
    });

    it("Should call ngOnDestroy", () => {
        const mckcall = jest.spyOn(component.subscriberObject,'unsubscribe')
        component.ngOnDestroy()
        expect(mckcall).toBeCalled();
    });

    it("Should call agInit", (done) => {
        component.agInit(params);
        component.params.context.parentChildIstance.headerCheckBoxHanldeEmitter.subscribe((isToSelect:any) => {
            done();
            expect( component.isChecked).toBeTruthy();
            expect( component.disableCheckBox).toBeFalsy();

        });
        component.params.context.parentChildIstance.headerCheckBoxHanldeEmitter.emit(true);
    });
})