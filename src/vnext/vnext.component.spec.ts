import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { BlockUiService } from './commons/services/block-ui.service';
import { ConstantsService } from './commons/services/constants.service';
import { UtilitiesService } from './commons/services/utilities.service';
import { VnextStoreService } from './commons/services/vnext-store.service';
import { ProjectRestService } from './project/project-rest.service';
import { ProjectStoreService } from './project/project-store.service';
import { ProjectService } from './project/project.service';
import { ProposalStoreService } from './proposal/proposal-store.service';

import { VnextComponent } from './vnext.component';
import { VnextService } from './vnext.service';

describe('VnextComponent', () => {
  let component: VnextComponent;
  let fixture: ComponentFixture<VnextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VnextComponent ],
      providers: [ ProjectService,VnextService,ProjectStoreService,ProjectRestService,UtilitiesService,CurrencyPipe,EaRestService,
        BlockUiService,  EaStoreService,  ConstantsService,VnextStoreService,ProposalStoreService,ChangeDetectorRef],
        imports: [HttpClientModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VnextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
