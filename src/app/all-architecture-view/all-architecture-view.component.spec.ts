import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LocaleService } from "@app/shared/services/locale.service";
import { AllArchitectureViewComponent } from "./all-architecture-view.component";
import { Subject, of, throwError } from "rxjs";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { MessageService } from "@app/shared/services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ListProposalService } from "@app/proposal/list-proposal/list-proposal.service";
import { BreadcrumbsService } from "@app/core/breadcrumbs/breadcrumbs.service";
import { AllArchitectureViewService } from "./all-architecture-view.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { EventEmitter, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";



describe('AllArchitectureViewComponent', () => {
    let component: AllArchitectureViewComponent;
    let fixture: ComponentFixture<AllArchitectureViewComponent>;
    let httpTestingController;
    const url = "https://localhost:4200/";
    const mockLocaleServiceValue = {
        getLocalizedString: jest.fn().mockReturnValue({ key: 'jest', value: 'test' })
    }

    const mockAppDataService = {
        isReload: true,
        engageCPSsubject: new Subject(),
        createQualEmitter: new EventEmitter(),
        userInfoObjectEmitter: new EventEmitter(),
        agreementDataEmitter: new EventEmitter(),
        deleteAgreementDataEmitter: new EventEmitter(),
        reloadSmartAccountEmitter: new EventEmitter(),
        userInfo: { userId: '123', distiUser: true, accessLevel: 0, authorized: false, partnerAuthorized: false },
        findUserInfo: () => { },
        changeSmartAccountLink: () => of({}),
         getAppDomain(){
            return url;
          }
    }



    class MockQualificationsService {
        viewQualSummary(data) { }
        loadUpdatedQualListEmitter = new EventEmitter();
        reloadSmartAccountEmitter = new EventEmitter();
        listQualification() { return of({}) }
    }

    class MockBlockUiService {
        spinnerConfig = {
            blockUI: () => { }
        }
    }

    class MockBreadcrumbsService {
        showOrHideBreadCrumbs(value) { }
    }

    const mockMessageService = {
        displayUiTechnicalError(error) { },
        displayMessagesFromResponse(res) { }
    }

    class MockConstantService { }
    class MockListProposalService { }
    class MockAllArchitectureViewService {
        viewTabEmitter = new EventEmitter();
        getSmartAccountList() { return of({}) };
        getProposalListbyCustomer() { return of({ data: {} }) };
        getSubHeaderData() { return of({ data: {} }) };
        getAgreementsData(arg) { 
            const response = {
                data:{accounts:["test"]},
                error:false
            }
            return of(response) }
    }
    class MockActivatedRoute {
        params = [{ key: 'test', variable: 'landing', selected: 'qualifications' }]
    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AllArchitectureViewComponent],
            providers: [
                { provide: LocaleService, useValue: mockLocaleServiceValue },
                { provide: QualificationsService, useClass: MockQualificationsService },
                { provide: AppDataService, useValue: mockAppDataService },
                { provide: BlockUiService, useClass: MockBlockUiService },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: ListProposalService, useClass: MockListProposalService },
                { provide: BreadcrumbsService, useClass: MockBreadcrumbsService },
                { provide: AllArchitectureViewService, useClass: MockAllArchitectureViewService },
                Router,
                { provide: ConstantsService, useClass: MockConstantService }
            ],
            imports: [HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllArchitectureViewComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController)
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
        component.appDataService.insideAllArchView = true;
        component.appDataService.userInfo.accessLevel = 0;
        const appDataService = fixture.debugElement.injector.get(AppDataService);
        const allArchitectureViewService = fixture.debugElement.injector.get(AllArchitectureViewService);
        const qualService = fixture.debugElement.injector.get(QualificationsService);
        component.selectedTab = 'qualifications';
        component.appDataService.userInfo.isPartner = true;
        let val: Promise<true>;

        appDataService.subHeaderData = {
            moduleName: '',
            custName: '',
            subHeaderVal: ['TEST']
        };

        //Mocking
        jest.spyOn(component['router'], 'navigate').mockReturnValue(val);
        jest.spyOn(component, 'changeLindSmartAccount');
        jest.spyOn(component, 'getAgreementsData');
        jest.spyOn(component, 'onSelectProposal');
        jest.spyOn(component, 'onSelectQual');
        jest.spyOn(component, 'onSelectAgreement');
        jest.spyOn(component, 'getSmartAccountList');
        jest.spyOn(component, 'getQualList');
        jest.spyOn(appDataService, 'findUserInfo');
        jest.spyOn(appDataService['userInfoObjectEmitter'], 'subscribe');
        jest.spyOn(appDataService['agreementDataEmitter'], 'subscribe');
        jest.spyOn(appDataService['deleteAgreementDataEmitter'], 'subscribe');
        jest.spyOn(appDataService['reloadSmartAccountEmitter'], 'subscribe');
        jest.spyOn(allArchitectureViewService['viewTabEmitter'], 'subscribe');
        jest.spyOn(qualService['loadUpdatedQualListEmitter'], 'subscribe');




        component.ngOnInit();

        let subs = component.appDataService.userInfoObjectEmitter.subscribe((res: any) => {
            if (res.isPartner) {
                expect(component.isInternalUser).toBeFalsy();
                expect(component['router'].navigate).toBeCalled();
            } else {
                expect(component.isInternalUser).toBeTruthy();
            }
        });

        component.appDataService.agreementDataEmitter.subscribe((res: any) => {
            expect(component.getAgreementsData).toBeCalledWith(res.smartAccountId);
            expect(component.changeLindSmartAccount).toBeCalledWith(res);

        });

        component.appDataService.deleteAgreementDataEmitter.subscribe(() => {


        });

        component.appDataService.reloadSmartAccountEmitter.subscribe(() => {
            expect(component.getSmartAccountList).toBeCalled();
        });

        component.qualService.loadUpdatedQualListEmitter.subscribe(() => {
            expect(component.getQualList).toBeCalled();
        });

        component.allArchitectureViewService.viewTabEmitter.subscribe((tab: any) => {
            if (tab === 'proposals') {
                expect(component.onSelectProposal).toBeCalledWith(tab);
            } else if (tab === 'qualifications') {
                expect(component.onSelectQual).toBeCalledWith(tab);
            } else if (tab === 'agreements') {
                expect(component.onSelectAgreement).toBeCalledWith(tab);
            } else if (tab === 'compliance') {
                expect(component.onSelectAgreement).toBeCalledWith(tab)
            }

        });

        appDataService.userInfoObjectEmitter.emit({ isPartner: true });
        appDataService.userInfoObjectEmitter.emit({ isPartner: false });
        appDataService.agreementDataEmitter.emit({ smartAccountId: '123', smartAccountName: 'test' });
        appDataService.deleteAgreementDataEmitter.emit();
        appDataService.reloadSmartAccountEmitter.emit();

        allArchitectureViewService.viewTabEmitter.emit('proposals');
        allArchitectureViewService.viewTabEmitter.emit('qualifications');
        allArchitectureViewService.viewTabEmitter.emit('agreements');
        allArchitectureViewService.viewTabEmitter.emit('compliance');
        qualService.loadUpdatedQualListEmitter.emit();
        expect(component.appDataService.findUserInfo).toBeCalled();
        expect(component).toBeTruthy();
        subs.unsubscribe();
    });

    it('should call getSearchText', () => {
        component.getSearchText('test');
        expect(component.searchText).toBe('test')
    });


    it('should call onSelectCompliance', () => {
        component.onSelectCompliance('test');
        expect(component.selectedTab).toBe('test')
    });

    it('should call getSubHeaderData', (done) => {

        const allArchitectureViewService = fixture.debugElement.injector.get(AllArchitectureViewService);
        const messageService = fixture.debugElement.injector.get(MessageService);

        const errorResponse = new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: 'test 404 error'
        });

        jest.spyOn(allArchitectureViewService, 'getSubHeaderData').mockReturnValue(throwError(() => {
            return errorResponse;
        }));
        jest.spyOn(messageService, 'displayUiTechnicalError')

        component.getSubHeaderData();

        component.allArchitectureViewService.getSubHeaderData().subscribe(
            {
                next(value) {
                    done()
                },
                error: (err) => {
                    done();
                    expect(component.messageService.displayUiTechnicalError).toBeCalled()
                }
            })


    });


    it('should call createNewQual', () => {
        let val: Promise<true>;
        const appDataService = fixture.debugElement.injector.get(AppDataService);
        jest.spyOn(component['router'], 'navigate').mockReturnValue(val);
        component.architecture = 'test';
        appDataService.customerName = 'test';
        appDataService.customerID = '123';
        const obj = {
            architecture: 'test',
            customername: encodeURIComponent('test'),
            customerId: '123'
        }
        component.createNewQual();
        expect(component['router'].navigate).toBeCalledWith(['/qualifications', obj]);

    });

    it('should call onSelectAccountHealth', () => {
   
    component.proposalData = {
        data: {},
        isCreatedByMe: false,
        isProposalOnDashboard: false,
        isProposalInsideQualification: false,
        isToggleVisible: false,
        editIcon: false,
    }
     component.qualData ={   data:{},
        isCreatedByMe:false,
        isProposalOnDashboard: false,
        isProposalInsideQualification:false,
        isToggleVisible: false,
        editIcon: false}
        component.onSelectAccountHealth('test');
        expect(component.selectedTab).toBe('test')
        expect(component.searchText).toBe('');
        expect(component.placeholder).toBe('');
        expect(component.showQualList).toBe(false);
        expect(component.showProposalList).toBe(false);
        expect(component.showAggrementList).toBe(false);
        expect(component.qualData.isToggleVisible).toBe(false);
        expect(component.qualData.editIcon).toBe(false);
        expect(component.proposalData.isToggleVisible).toBe(false);
        expect(component.proposalData.editIcon).toBe(false);
        expect(component.proposalData.isProposalOnDashboard).toBe(true);
        expect(component.qualData.isProposalOnDashboard).toBe(true);
    });

});