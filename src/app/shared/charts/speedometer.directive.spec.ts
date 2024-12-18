import { SpeedometerDirective } from './speedometer.directive';
import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

describe('SpeedometerDirective', () => {
  let directive: SpeedometerDirective;
  let element: ElementRef;

  beforeEach(() => {
    element = new ElementRef(document.createElement('div'));
    directive = new SpeedometerDirective(element);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set default values', () => {
    expect(directive.color).toEqual(['#EC932F', '#F3F3F3', '#FFFFFF']);
    expect(directive.width).toBe(200);
    expect(directive.height).toBe(220);
    expect(directive.internalDepth).toBe(45);
  });

  it('should update chartData on ngOnInit', () => {
    directive.ngOnInit();
    expect(directive.chartData[0].value).toBe(6.7);
    expect(directive.chartData[1].value).toBe(60.3);
  });

  it('should call drawChart on ngOnInit', () => {
    jest.spyOn(directive, 'drawChart');
    directive.ngOnInit();
    expect(directive.drawChart).toHaveBeenCalled();
  });

  it('should call drawChart on ngOnChanges', () => {
    jest.spyOn(directive, 'drawChart');
    directive.ngOnChanges();
    expect(directive.drawChart).toHaveBeenCalled();
  });

  it('should create SVG elements in drawChart', () => {
    directive.chartData = [{ 'name': 'a', 'value': 33.5 }, { 'name': 'b', 'value': 33.5 }, { 'name': 'c', 'value': 33.5 }];
    directive.drawChart();
    const svg = element.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    const arcs = svg.querySelectorAll('.arc');
    expect(arcs.length).toBe(3);
  });

  it('should set correct colors in drawChart', () => {
    directive.chartData = [{ 'name': 'a', 'value': 33.5 }, { 'name': 'b', 'value': 33.5 }, { 'name': 'c', 'value': 33.5 }];
    directive.drawChart();
    const paths = element.nativeElement.querySelectorAll('path');
    expect(paths[0].getAttribute('fill')).toBe('#EC932F');
    expect(paths[1].getAttribute('fill')).toBe('#F3F3F3');
    expect(paths[2].getAttribute('fill')).toBe('#FFFFFF');
  });

  it('should create tooltip div in drawChart', () => {
    directive.chartData = [{ 'name': 'a', 'value': 33.5 }, { 'name': 'b', 'value': 33.5 }, { 'name': 'c', 'value': 33.5 }];
    directive.drawChart();
    const tooltip = document.querySelector('.toolTip');
    expect(tooltip).toBeTruthy();
  });
});
