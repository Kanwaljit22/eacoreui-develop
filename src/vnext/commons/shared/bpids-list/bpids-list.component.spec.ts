import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BpidsListComponent } from './bpids-list.component';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

describe('BpidsListComponent', () => {
  let component: BpidsListComponent;
  let fixture: ComponentFixture<BpidsListComponent>;
  
  const mockEaService = {};
  const mockDataIdConstantsService = {};
  const mockLocalizationService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BpidsListComponent],
      providers: [
        { provide: EaService, useValue: mockEaService },
        { provide: DataIdConstantsService, useValue: mockDataIdConstantsService },
        { provide: LocalizationService, useValue: mockLocalizationService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(BpidsListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize bpIDList and selectedRadioBpId', () => {
      component.allBpIDs = [{ eaId: 'id1' }, { eaId: 'id2' }, { eaId: 'id3' }];
      component.selectedBpID = { eaId: 'id1' };

      component.ngOnInit();

      expect(component.bpIDList).toEqual(component.allBpIDs);
      expect(component.selectedRadioBpId).toEqual(component.selectedBpID);
      expect(component.show).toEqual(3);
      expect(component.start_max).toEqual(0);
    });

    it('should set start_max if allBpIDs length is greater than show', () => {
      component.allBpIDs = new Array(10).fill({ eaId: 'id' });

      component.ngOnInit();

      expect(component.start_max).toBeGreaterThan(0);
    });
  });

  describe('checkBoxSelectBpid', () => {
    it('should toggle bpId selected state and emit selectedId', () => {
      const bpId = { selected: false };
      jest.spyOn(component.selectedId, 'emit');

      component.checkBoxSelectBpid(bpId);

      expect(bpId.selected).toBe(true);
      expect(component.selectedId.emit).toHaveBeenCalledWith(bpId);
    });
  });

  describe('selectBpId', () => {
    it('should toggle selectedRadioBpId and emit selectedId', () => {
      const event = { target: { value: 'id1', checked: true } };
      const id = { eaId: 'id1' };
      jest.spyOn(component.selectedId, 'emit');

      component.selectBpId(event as any, id);

      expect(component.selectedRadioBpId).toEqual(id);
      expect(component.selectedId.emit).toHaveBeenCalledWith(id);
    });

    it('should deselect selectedRadioBpId if same ID is clicked again', () => {
      const event = { target: { value: 'id1', checked: true } };
      component.selectedRadioBpId = { eaId: 'id1' };

      component.selectBpId(event as any, component.selectedRadioBpId);

      expect(component.selectedRadioBpId).toEqual({});
    });
  });

  describe('openBpIdDetails', () => {
    it('should emit openBpIdDetail with provided ID', () => {
      const id = { eaId: 'id1' };
      jest.spyOn(component.openBpIdDetail, 'emit');

      component.openBpIdDetails(id);

      expect(component.openBpIdDetail.emit).toHaveBeenCalledWith(id);
    });
  });

  describe('moveRight', () => {
    beforeEach(() => {
      component.allBpIDs = new Array(10).fill({ eaId: 'id' });
      component.start = 0;
      component.start_max = 3;
      component.viewIndex = 0;
      component.ngOnInit();
    });

    it('should increment start and viewIndex if not at start_max', () => {
      component.moveRight();

      expect(component.start).toBe(1);
      expect(component.viewIndex).toBe(2);
    });

    it('should call setPosition to update bpIDList', () => {
      jest.spyOn(component, 'setPosition');

      component.moveRight();

      expect(component.setPosition).toHaveBeenCalled();
    });

    it('should not increment if already at start_max', () => {
      component.start = component.start_max;

      component.moveRight();

      expect(component.start).toBe(component.start_max);
    });
  });

  describe('moveLeft', () => {
    beforeEach(() => {
      component.allBpIDs = new Array(10).fill({ eaId: 'id' });
      component.start = 2;
      component.viewIndex = 4;
      component.ngOnInit();
    });

    it('should decrement start and viewIndex if not at zero', () => {
      component.moveLeft();

      expect(component.start).toBe(1);
      expect(component.viewIndex).toBe(2);
    });

    it('should call setPosition to update bpIDList', () => {
      jest.spyOn(component, 'setPosition');

      component.moveLeft();

      expect(component.setPosition).toHaveBeenCalled();
    });

    it('should not decrement if already at zero', () => {
      component.start = 0;

      component.moveLeft();

      expect(component.start).toBe(0);
    });
  });

  describe('setPosition', () => {
    it('should update bpIDList based on viewIndex', () => {
      component.allBpIDs = [
        { eaId: 'id1' },
        { eaId: 'id2' },
        { eaId: 'id3' },
        { eaId: 'id4' },
        { eaId: 'id5' }
      ];
      component.viewIndex = 1;

      component.setPosition();

      expect(component.bpIDList).toEqual([
        { eaId: 'id2' },
        { eaId: 'id3' },
        { eaId: 'id4' }
      ]);
    });
  });
});
