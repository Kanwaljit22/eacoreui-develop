import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddCaseIdComponent } from './add-case-id.component';
import { AppDataService } from '../../shared/services/app.data.service';
import { LocaleService } from '../../shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { AppRestService } from '../../shared/services/app.rest.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { CopyLinkService } from '../../shared/copy-link/copy-link.service';
import { PermissionService } from '../../permission.service';
import { ApproverTeamService } from '../../proposal/edit-proposal/approver-team/approver-team.service';
import { ProposalDataService } from '../../proposal/proposal.data.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProposalPollerService } from '../../shared/services/proposal-poller.service';

const NgbActiveModalMock = {
    close: jest.fn().mockReturnValue('close')
}

describe('AddCaseIdComponent', () => {
  let component: AddCaseIdComponent;
  let fixture: ComponentFixture<AddCaseIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCaseIdComponent ],
      providers: [AppDataService, LocaleService,  { provide: NgbActiveModal, useValue: NgbActiveModalMock }, Renderer2, AppRestService, MessageService, 
        BlockUiService, ConstantsService, CopyLinkService,
         PermissionService,ApproverTeamService,ProposalDataService,UtilitiesService,CurrencyPipe,ProposalPollerService],
      imports: [HttpClientModule, CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCaseIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call update', () => {
    component.caseId = '123454';
    component.update();
  });

  it('call close', () => {
    component.close()
  });

  
 it('call focusInput',() =>{
   component.focusInput('test')
 });


  it('call focusDescription', () => {
    component.focusDescription()
  });
  
  it('call isCaseIdValueChanged', () => {
    let event
    component.caseId = '1123'
    component.isCaseIdValueChanged(event)

    component.caseId = ''
    component.isCaseIdValueChanged(event)
  });
  
});
