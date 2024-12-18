import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from "@angular/core/testing";
import { ProposalCreateTutorialComponent } from "./proposal-create-tutorial.component";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { ListProposalService } from "../list-proposal/list-proposal.service";
import { AppDataService, SessionData } from "@app/shared/services/app.data.service";
import { SubHeaderComponent } from "vnext/commons/sub-header/sub-header.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LocaleService } from "@app/shared/services/locale.service";
import { AppRestService } from "@app/shared/services/app.rest.service";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { CopyLinkService } from "@app/shared/copy-link/copy-link.service";
import { PermissionService } from "@app/permission.service";

//test-covered
describe('ProposalCreateTutorialComponent', () => {
    let component: ProposalCreateTutorialComponent;
    let fixture: ComponentFixture<ProposalCreateTutorialComponent>;



    const MockAappDataService = { getSessionObject: jest.fn(()=>{return{qualificationData:{qualID:false}} as SessionData}) }
    const MockQualificationService = { qualification: { qualID: false } }

    const MockLocaleService = {}

    const MockListProposalService = { prepareSubHeaderObject: jest.fn() }
    const MockAppRestService ={}
    const MockMessageService = {}
    const MockCopyLinkService = {}
    const MockConstantsService = {}
    const MockPermissionService = {}
    const MockBlockUiService = {}

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AppRestService, useValue: MockAppRestService }, { provide: MessageService, useValue: MockMessageService }, { provide: CopyLinkService, useValue: MockCopyLinkService }, { provide: PermissionService, useValue: MockPermissionService }, { provide: BlockUiService, useValue: MockBlockUiService }, { provide: ConstantsService, useValue: MockConstantsService }, { provide: LocaleService, useValue: MockLocaleService }, { provide: ListProposalService, useValue: MockListProposalService }, { provide: QualificationsService, useValue: MockQualificationService }, { provide: AppDataService, uselValue: MockAappDataService }],
            declarations: [ProposalCreateTutorialComponent],
            imports: [HttpClientTestingModule]
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(ProposalCreateTutorialComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize the qualification object with the session data if the qualID is not set',() => {
       const app1= fixture.debugElement.injector.get(AppDataService);
        const appdate = jest.spyOn(app1, 'getSessionObject');

        component.ngOnInit();
       
            expect(appdate).toHaveBeenCalled();
    
       
        
   });


    it('should call the prepareSubHeaderObject method with the correct parameters', () => {
        const appdate1 = jest.spyOn(MockListProposalService, 'prepareSubHeaderObject');
        component.ngOnInit();
        expect(appdate1).toHaveBeenCalled();
       
        });
});
