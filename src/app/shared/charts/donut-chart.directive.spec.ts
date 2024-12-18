import { DonutChartDirective } from './donut-chart.directive';
import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

describe('DonutChartDirective', () => {
  let directive: DonutChartDirective;
  let element: ElementRef;

  beforeEach(() => {
    element = new ElementRef(document.createElement('div'));
    directive = new DonutChartDirective(element);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set default values', () => {
    expect(directive.color).toEqual(['#F47942', '#F3F3F3']);
    expect(directive.width).toBe(100);
    expect(directive.height).toBe(100);
    expect(directive.internalDepth).toBe(30);
  });

  it('should update chartData on ngOnChanges', () => {
    directive.data = 40;
    directive.ngOnChanges();
    expect(directive.chartData).toEqual([40, 60]);
  });

  it('should call drawChart on ngOnChanges', () => {
    jest.spyOn(directive, 'drawChart');
    directive.data = 40;
    directive.ngOnChanges();
    expect(directive.drawChart).toHaveBeenCalled();
  });

  it('should create SVG elements in drawChart', () => {
    directive.chartData = [40, 60];
    directive.drawChart();
    const svg = element.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    const arcs = svg.querySelectorAll('.arc');
    expect(arcs.length).toBe(2);
  });

  it('should set correct colors in drawChart', () => {
    directive.chartData = [40, 60];
    directive.drawChart();
    const paths = element.nativeElement.querySelectorAll('path');
    expect(paths[0].getAttribute('fill')).toBe('#F47942');
    expect(paths[1].getAttribute('fill')).toBe('#F3F3F3');
  });

  it('should create tooltip div in drawChart', () => {
    directive.chartData = [40, 60];
    directive.drawChart();
    const tooltip = document.querySelector('.toolTip');
    expect(tooltip).toBeTruthy();
  });
});
