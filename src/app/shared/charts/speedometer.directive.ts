import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appSpeedometer]'
})
export class SpeedometerDirective implements OnInit, OnChanges {

  @Input() data;
  @Input() color = ['#EC932F', '#F3F3F3', '#FFFFFF']
  @Input() width = 200;
  @Input() height = 220;
  @Input() internalDepth = 45;
  public chartData = [{ 'name': 'a', 'value': 33.5 }, { 'name': 'b', 'value': 33.5 }, { 'name': 'c', 'value': 33.5 }];
  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html((d) => {
      return '<div></div>';
    });

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.drawChart();
  }

  ngOnInit() {
    this.data = 10;
    this.chartData[0]['value'] = this.data * 67 / 100;
    this.chartData[1]['value'] = 67 - this.chartData[0]['value'];
    this.drawChart();
  }

  drawChart() {
    let tooltip = d3.select('body').append('div').attr('class', 'toolTip');
    let len = this.chartData.length;
    let radius = Math.min(this.width, this.height) / 2;
    let arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - this.internalDepth)
      .padAngle(.02);

    let pie = d3.pie()
      .sort(null)
      .value(function (d) { return d[Object.keys(d)[1]]; });
    let rotate = 155 / Math.PI * 180;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ') rotate(' + rotate + ')');

    let g = svg.selectAll('.arc')
      .data(pie(this.chartData))
      .enter().append('g')
      .attr('class', 'arc');

    const self = this;

    g.append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) { return self.color[i]; })

    g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);

    g.append('line')
      .style('stroke', '#000000')
      .style('stroke-width', 5)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', Math.cos(this.chartData[0]['value'] - Math.PI / 2) * (radius))
      .attr('y2', Math.sin(this.chartData[0]['value'] - Math.PI / 2) * (radius));
  }
}

