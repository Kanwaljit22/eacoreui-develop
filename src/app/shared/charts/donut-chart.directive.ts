import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appDonutChart]'
})
export class DonutChartDirective implements OnInit, OnChanges {

  @Input() data;
  @Input() color = ['#F47942', '#F3F3F3']
  @Input() width = 100;
  @Input() height = 100;
  @Input() internalDepth = 30;
  chartData: any;

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html((d) => {
      return '<div></div>';
    });

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    //  this.drawChart();
    this.chartData = [this.data, 100 - this.data];
    this.drawChart();
  }

  ngOnInit() {
    // let value = 30;
    // this.chartData = [this.data , 100 - this.data ];
    // this.drawChart();
  }

  drawChart() {
    let tooltip = d3.select('body').append('div').attr('class', 'toolTip');
    let len = this.chartData.length;
    let radius = Math.min(this.width, this.height) / 2;
    let angle = 0.8 * Math.PI;
    let arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - this.internalDepth)
      .padAngle(.02);

    let pie = d3.pie()
      .sort(null)
      .value(d => d)
      .startAngle(angle * -1)
      .endAngle(angle);

    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    let g = svg.selectAll('.arc')
      .data(pie(this.chartData))
      .enter().append('g')
      .attr('class', 'arc');

    const self = this;

    g.append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) { return self.color[i]; });

    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('y2', function (d) {
        if (d.index === 1) {
          return Math.sin(d.startAngle - Math.PI / 2) * (radius - 5);
        }
      })
      .attr('x2', function (d) {
        if (d.index === 1) {
          return Math.cos(d.startAngle - Math.PI / 2) * (radius - 5);
        }
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 5);

    g.append('circle')
      .attr('text-anchor', 'middle')
      .attr('r', 5)
      .attr('transform', function (d) {
        return 'translate(' + 0 + ')';
      })
      .attr('dy', '.50em');
  }
}
