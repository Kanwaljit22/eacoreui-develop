import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { ManageSuitesGroupCell } from "./group-cell.component";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ManageSuitesService } from "../manage-suites.service";
import { PermissionService } from "@app/permission.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { EventEmitter } from "@angular/core";


describe('ManageSuitesGroupCell', () => {
    let component: ManageSuitesGroupCell;
    let fixture: ComponentFixture<ManageSuitesGroupCell>;

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
            declarations: [ManageSuitesGroupCell],
            imports:[ ],
            providers: [
                {provide:AppDataService, useClass:MockAppDataService},
                {provide:ManageSuitesService, useClass:MockManageSuitesService},
                {provide:ProposalDataService, useClass:MockProposalDataService},
                {provide:PermissionService, useClass:MockPermissionService},
                {provide:UtilitiesService, useClass:MockUtilitiesService},                
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageSuitesGroupCell);
        component = fixture.componentInstance;

        let params = {
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
            }}
          };
          
        component.agInit(params);
    
        fixture.detectChanges();
    });


    it("Should create component", () => {
        expect(component).toBeTruthy();
    });


    it("Should call refresh", () => {
        expect(component.refresh()).toBeFalsy();
    });

    
    it("Should call openModal", () => {
        const mckOpen = jest.spyOn(component.params.modalVar, 'open');
        component.openModal();
        expect(mckOpen).toBeCalled();
    });

    it("Should call redirect", () => {
        const mckOpen = jest.spyOn(window, 'open');
        component.redirect('test');
        expect(mckOpen).toBeCalledWith('test');
    });


    it("Should call selectTier", () => {
         const obj ={
            displayName:'test',
            atoProductName:'test'
         }
         const manageServiceFake = fixture.debugElement.injector.get(ManageSuitesService);
         const mckEmit = jest.spyOn(manageServiceFake['selectedAtoEmitter'], 'emit');
         component.params.data.atos=[]
         component.selectTier(obj);

         expect(component.selectedTierValue).toBe('test')
         expect(component.showDropdown).toBe(false)
         expect(component.params.data['selectedAto']).toEqual(obj)
         expect(mckEmit).toBeCalled();
    });

    it("Should call tierOutside", () => {
        component.tierOutside('test');
        expect(component.showDropdown).toBe(false)
    });


    it("Should call selectCxsuite", () => {
        const localeParams = {};
        component.params.context={parentChildIstance:{selectCxSuite:(params) => {} }};

        const fakeCall = jest.spyOn(  component.params.context.parentChildIstance, 'selectCxSuite')
        component.selectCxsuite(localeParams);
        expect(fakeCall).toBeCalled();
    });


    it("Should call selectCxsuite branch 1", () => {
        const localeParams = {};
        component.params.context=null;
        const manageServiceFake = fixture.debugElement.injector.get(ManageSuitesService);
        const mckEmit = jest.spyOn(manageServiceFake['cxSuiteSelectionEmitter'], 'emit');
        component.selectCxsuite(localeParams);
        expect(mckEmit).toBeCalledWith({"selection": true});
    });


    it("Should call onClick", () => {
        component.readOnlyMode = false;
        component.onClick('test');
        expect(component.oldValue).toBe('test')
        expect(component.data).toBe('test')
        expect(component.edited).toBe(true)

    });


    it("Should call onClick b1", () => {
        component.readOnlyMode = true;
        component.onClick('test');
        expect(component.edited).toBe(false)
    });

    it("Should call onClickedOutside", () => {
    
        component.params.data.cxSuites = [{attachRate:'test'}];
        component.params.context={parentChildIstance:{checkCxAttachRateForSuites:() => {} }};
        component.edited = true;
        const checkCxAttachRateForSuitesFake = jest.spyOn(component.params.context.parentChildIstance,'checkCxAttachRateForSuites')
        component.onClickedOutside('', null , 'test');
        
        expect(component.edited).toBe(false);
        expect(component.params.data.cxSuites[0].attachRate).toBe(0);
        expect(checkCxAttachRateForSuitesFake).toBeCalled()

    });

    it("Should call onClickedOutside b1", () => {
        component.params.data.cxSuites = [{attachRate:'test'}];
        component.params.context=null;
        component.edited = true;
        const manageServiceFake = fixture.debugElement.injector.get(ManageSuitesService);
        const mckEmit = jest.spyOn(manageServiceFake['cxSuiteSelectionEmitter'], 'emit');
        component.onClickedOutside('', null , 'test');
        expect(mckEmit).toBeCalled();
    });

    it("Should call keyUp", () => {
        const event = {target:{value:200}};
        component.keyUp(event, '');
        expect(component.data).toBe(100.00);
        component.keyUp({target:{value:-1}}, '');
        expect(component.data).toBe(0.00);
        component.keyUp({target:{value:10}}, '');
        expect(component.data).toBe(0);
    });


})