import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TcoBarChartComponent } from './tco-bar-chart.component';
import { EaRestService } from "ea/ea-rest.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { TcoService } from 'vnext/tco/tco.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';

interface SVGTextElement extends HTMLElement {
  getComputedTextLength?: () => number;
}

class MockEaRestService {
  getApiCall() {
    return of({
      data: [
        { year: "Network Infrastructure", BAU: 90, EA: 110 }
      ]
    });
  }
}
describe('TcoBarChartComponent', () => {
  let component: TcoBarChartComponent;
  let fixture: ComponentFixture<TcoBarChartComponent>;
  let eaRestServiceMock: any;
  let routeMock: any;

  beforeEach(async () => {
    eaRestServiceMock = { getApiCall: jest.fn() };
    routeMock = { params: of({ proposalId: '123' }) };
  
    const originalCreateElementNS = document.createElementNS;

    jest.spyOn(document, "createElementNS").mockImplementation((namespaceURI, qualifiedName) => {
      const element = originalCreateElementNS.call(document, namespaceURI, qualifiedName);
  
      if (qualifiedName === "tspan") {
        (element as any).getComputedTextLength = jest.fn(() => 50);
      }
  
      return element;
    });
    
    await TestBed.configureTestingModule({
      declarations: [TcoBarChartComponent, LocalizationPipe],
      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        { provide: ActivatedRoute, useValue: routeMock },
        VnextService,
        LocalizationService,
        VnextStoreService,
        ProjectStoreService,
        UtilitiesService,
        CurrencyPipe,
        ProposalStoreService,
        TcoService,
        TcoStoreService
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(TcoBarChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch data and update chart on ngOnInit', () => {
    const mockData1 = [{ year: "Network Infrastructure", BAU: 90, EA: 110 }];
    eaRestServiceMock.getApiCall.mockReturnValueOnce(of({ data: mockData1 }));

    component.ngOnInit();

    expect(component.data1).toEqual(mockData1);
  });

  test('should switch to data2 on showNextData call', () => {
    component.currentData = component.data1;
    component.showNextData();
    expect(component.currentData).toBe(component.data2);
  });

  test('should call createChart on currentData change', () => {
    const createChartSpy = jest.spyOn(component, 'createChart');
    component.currentData = component.data2;
    component.showPreviousData();
    fixture.detectChanges()

    expect(createChartSpy).toHaveBeenCalled();
  });

  test('should render chart with correct dimensions', () => {
    const mockData = [{ year: "Network Infrastructure", BAU: 80, EA: 100 }];
    component.currentData = mockData;

    fixture.detectChanges();
    const svgElement = fixture.nativeElement.querySelector('#chart1');
    expect(svgElement.getAttribute('width')).toBe((component.width + component.margin.left + component.margin.right).toString());
    expect(svgElement.getAttribute('height')).toBe((component.height + component.margin.top + component.margin.bottom).toString());
  });

  test('should display tooltip on bar hover', () => {
    const mockData = [{ year: "Network Infrastructure", BAU: 80, EA: 100 }];
    component.currentData = mockData;
    fixture.detectChanges();

    component.createChart();
    
    const rectElement = fixture.nativeElement.querySelector('#chart1 rect');
    const tooltipElement = fixture.nativeElement.querySelector('#tooltip1');

    rectElement.dispatchEvent(new MouseEvent('mouseover'));
    fixture.detectChanges();
    expect(tooltipElement.style.opacity).toBe('1');
  });

  test('should hide tooltip on mouseout', () => {
    const mockData = [{ year: "Network Infrastructure", BAU: 80, EA: 100 }];
    component.currentData = mockData;
    fixture.detectChanges()

    component.createChart();
    
    const rectElement = fixture.nativeElement.querySelector('#chart1 rect');
    const tooltipElement = fixture.nativeElement.querySelector('#tooltip1');

    rectElement.dispatchEvent(new MouseEvent('mouseout'));
    fixture.detectChanges();
    expect(tooltipElement.style.opacity).toBe('0');
  });
});
