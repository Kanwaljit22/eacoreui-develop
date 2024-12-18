import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { EventEmitter, Renderer2 } from "@angular/core";
import { Subject, of } from "rxjs";
import { LocaleService } from "@app/shared/services/locale.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { PermissionService } from "@app/permission.service";
import { BreadcrumbsService } from "@app/core/breadcrumbs/breadcrumbs.service";
import { ProposalArchitectureComponent } from "./proposal-architecture.component";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { ProposalArchitectureService } from "./proposal-architecture.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ConstantsService } from "../services/constants.service";
import { UtilitiesService } from "../services/utilities.service";
import { AppDataService } from "../services/app.data.service";



describe('ProposalArchitectureComponent',() => {
    let component:ProposalArchitectureComponent;
    let fixture : ComponentFixture<ProposalArchitectureComponent>;
    const url = "https://localhost:4200/";

    const mockLocaleServiceValue = {
        getLocalizedString: jest.fn().mockReturnValue({ key: 'jest', value: 'test' }),
        getLocalizedMessage:jest.fn().mockReturnValue('Test Error')
      }
      class MockBreadcrumbsService {
        showOrHideBreadCrumbs(value) { }
    }
    
    class MockQualificationsService {
        qualification = { qualID: '123' };
        loaData={partnerBeGeoId:'123',customerGuId:'123' }
        viewQualSummary(data) { }
        loadUpdatedQualListEmitter = new EventEmitter();
        reloadSmartAccountEmitter = new EventEmitter();
        listQualification() { return of({}) }
    }


    class MockCreateProposalService {
        mspPartner=true;
        eligibleArchs=[];
        prepareSubHeaderObject = jest.fn().mockReturnValue(of({}));
        getProposalHeaderData = jest.fn().mockReturnValue(of({}));
        proposalArchQnaEmitter= new EventEmitter()
      }

      class MockProposalDataService {
        selectedArchForQna='test'
        validateBillingModel=jest.fn()
        proposalDataObject = { proposalId: '123',  proposalData: { groupName: "test" } }
      }
    
      class MockConstantsService {
        DNA='test'
        SECURITY = "test";
        TCO_METADATA_IDS = { markupMargin: "markupMargin" as string } as any;
        TCO_MARGIN = "test";
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

        numberOnlyKey=jest.fn();
        restrictBlankSpces=jest.fn();
     }

     class MockPermissionService {
        isProposalPermissionPage = jest.fn();
      }

      const mockAppDataService = {
        isReadWriteAccess:false, 
        roadMapPath:'test',
        isReload: true,
        engageCPSsubject: new Subject(),
        createQualEmitter: new EventEmitter(),
        userInfoObjectEmitter: new EventEmitter(),
        agreementDataEmitter: new EventEmitter(),
        deleteAgreementDataEmitter: new EventEmitter(),
        reloadSmartAccountEmitter: new EventEmitter(),
        userInfo: {roSuperUser:true ,userId: '123', distiUser: true, accessLevel: 0, authorized: false, partnerAuthorized: false },
        findUserInfo: () => { },
        changeSmartAccountLink: () => of({}),
         getAppDomain(){
            return url;
          }
    }

      class MockProposalArchitectureService{
        getQuestionnaireForProposalId=jest.fn().mockReturnValue(of({error:false, data:{test:''}}));
        createPageResetEmitter = new EventEmitter();
        makeFinalObjectForEditQuestionnaire=jest.fn();
        architectureListObject={isParentQuestion:false,answers:[{defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :{}}]};
        getProposalArchitectures=jest.fn().mockReturnValue(of(this.architectureListObject))
        questions=[{answers:[{id:'test',selected:'', description:'test'}]}]
        getArchitectureDataNew=jest.fn().mockReturnValue(of({error:false, data:{test:''}}));
        getArchitectureData=jest.fn().mockReturnValue(of({error:false, data:{test:''}}));
        isToEnableUpdateButton=jest.fn().mockReturnValue(of({error:false, data:{test:''}}));
        getArchQuestionsforParentIds=jest.fn().mockReturnValue(of(this.questions))
    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations:[ProposalArchitectureComponent],
            providers:[
                {provide:LocaleService, useValue:mockLocaleServiceValue},
                {provide:AppDataService, useValue:mockAppDataService},
                Renderer2,
                {provide:ProposalArchitectureService, useClass:MockProposalArchitectureService},
                {provide:CreateProposalService, useClass:MockCreateProposalService},
                {provide:ProposalDataService, useClass:MockProposalDataService},
                {provide:ConstantsService, useClass:MockConstantsService},
                {provide:UtilitiesService, useClass:MockUtilitiesService},
                {provide:QualificationsService, useClass:MockQualificationsService},
                {provide:PermissionService, useClass:MockPermissionService},
                {provide:BreadcrumbsService, useClass:MockBreadcrumbsService}
            ],
            imports:[HttpClientTestingModule]
        }).compileComponents()
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProposalArchitectureComponent);
        component = fixture.componentInstance;
        component.myDropArchitecture ={};
        component.myDropArchitecture.close = jest.fn() as any
        fixture.detectChanges();
    });

    it('should call ngOnInit',() => {
        component.type ='edit';
        component.disableSelection = true;
        component.ngOnInit()
        component.proposalArchitectureService.createPageResetEmitter.emit()
    })

    it('should call ngOnInit b1',() => {
        const service = fixture.debugElement.injector.get(ProposalArchitectureService);
        jest.spyOn(service, 'getQuestionnaireForProposalId').mockReturnValue(of({error:true}))
        component.ngOnInit()
    });

    it('should call getArchitectureList',() => {
        component.isRenewalFlow =true;
        component.getArchitectureList()
    });


    it('should call getDefaultSelectedArchitecture',() => {
        component.isRenewalFlow =true;
        component.getDefaultSelectedArchitecture()
    });

    it('should call getArchData',() => {
        component.getArchData()
    });

    it('should call getArchDataNew',() => {
        component.getArchDataNew()
    });

    it('should call changeExistence',() => {
        component.architectureShow =false
        component.changeExistence({type:'radio',answers:[{questionnaire:[],selected :true}]},{parentId :'test', })
    });

    it('should call selectMSP',() => {
        component.architectureShow =false;
        const anss =[{defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :{}}];
        const ans = {value:'',selected:true }
        component.selectMSP(anss, ans)
    });

    it('should call selectMSP',() => {
        component.architectureShow =false;
        component.oldMSPSelectedValue =false
        const anss =[{defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :{}}];
        const ans = {value:'Yes',selected:true }
        component.selectMSP(anss, ans)
    });


    it('should call checkPurchaseAuthorization',() => {
        const name ='test';
        const data ={archs:[{code:'test'}], test:'test'};
        component.checkPurchaseAuthorization(name, data)
    }); 

    it('should call checkPurchaseAuthorization b1',() => {
        const name ='test';
        const data ={};
        component.checkPurchaseAuthorization(name, data)
    }); 

    it('should call checkPurchaseAuthorization b2',() => {
        const name ='test';
        const data ={archs:[{code:''}], test:'test'};
        component.checkPurchaseAuthorization(name, data)
    }); 

    it('should call onArchitectureChange',() => {
        const dropdownArchs ={answers:[{defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :{}}]};
        const selectedarch ={name:'test',questionnaire:[],description:'test',parentId :[1,2]};
         component.myDropArchitecture={close:jest.fn() as any};
        component.onArchitectureChange(dropdownArchs, selectedarch);
    }); 

    it('should call isShowMSPQuestion',() => {
        component.isShowMSPQuestion();
    }); 

    it('should call getCreateFinalQuestionerObject',() => {
        const obj ={
            answers:[
            {
                defaultSelected :true,
                parentId:['test'],
                name:'SEC',
                selected:'',
                questionnaire :[{
                    answers:[
                    {
                        defaultSelected :true,
                        parentId:'test',
                        name:'SEC',
                        selected:'',
                        questionnaire :null
                    }
                ]
            }]
            }
        ]
    };
        const response = [{
            id:'parentId',
            defaultSelected :true,
            parentId:['test'],
            name:'SEC',
            selected:'',
            questionnaire :[{
                answers:[
                {
                    defaultSelected :true,
                    parentId:'test',
                    name:'SEC',
                    selected:'',
                    questionnaire :[{
                        answers:[
                        {
                            defaultSelected :true,
                            parentId:'test',
                            name:'SEC',
                            selected:'',
                            questionnaire :null
                        }
                    ]
                }]
                }
            ]
        }]
        }]
        component.getCreateFinalQuestionerObject(response,obj);
    }); 


    it('should call onProductDiscountChange',fakeAsync(() => {
        component.myDropProductDiscount = { close : jest.fn()}
        component.onProductDiscountChange('test');
        tick(0)
    }));

    it('should call onServiceDiscountChange',fakeAsync(() => {
        component.myDropServiceDiscount = { close : jest.fn()}
        component.onServiceDiscountChange('test');
        tick(0)
    }));

    it('should call onServiceDiscountChange',() => {
        component.myDropServiceDiscount = { close : jest.fn()}
        const renderer = fixture.debugElement.injector.get(Renderer2);
        jest.spyOn(renderer, 'selectRootElement').mockReturnValue({focus:jest.fn()})
        component.focusInput('test');
    });

    it('should call changeLevelOpt',() => {
        component.changeLevelOpt({value:'test'},'test');
    });

    it('should call textFinishedediting',() => {
        component.textFinishedediting({minValue:3},{description:[1],isMinimumValueEntered:2,selected:false, });
    });

    it('should call restrictNumebrOrBlankSpces',() => {
        component.restrictNumebrOrBlankSpces('e',{key:'sec_content_user_count'}, {});
    });

    it('should call restrictNumebrOrBlankSpces b1',() => {
        component.restrictNumebrOrBlankSpces('e',{key:''}, {});
    });

    it('should call restrictNumebrOrBlankSpces b1',() => {
        component.restrictNumebrOrBlankSpces('e',{key:''}, {});
    });

    it('should call keyupAction',() => {
        component.architectureShow = false
        component.keyupAction({}, {});
    });

    it('should call dropDownAction',() => {
        component.architectureShow = false;
        const a ={answers:[{id:'test',selected:'', description:'test'}]};
        const b = {defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :null}
        component.dropDownAction(a, b);
    });

    it('should call childDropDownAction',() => {
        component.architectureShow = false;
        const a ={answers:[{id:'test',selected:'', description:'test'}]};
        const b = {defaultSelected :true,parentId:'test',name:'SEC',selected:'',questionnaire :null}
        component.childDropDownAction(a, b);
    });

    it('should call isMandatoryRadioButtonIsSelected',() => {
        const a =[{selected:true}];
        component.isMandatoryRadioButtonIsSelected(a);
    });

    it('should call getSelectedDroDownValue',() => {
        const a ={answers:[{id:'test',selected:'', description:'test'}]};;
        component.getSelectedDroDownValue(a);
    });

    it('should call isAnyArchitecturSelected',() => {
        component.isAnyArchitecturSelected();
    });

    it('should call scrollBottom',fakeAsync(() => {
        window.pageYOffset=1;
        jest.spyOn(window,'scrollTo')
        component.scrollBottom();
        tick(200)
    }));

    
    
})