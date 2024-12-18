import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[appRectangularProgressBar]'
})
export class RectangularProgressBarDirective implements OnInit, OnChanges {

  @Input() data: any;
  @Input() barheight = 72;
  @Input() margin = { top: 35, right: 0, bottom: 50, left: 30 };
  @Input() colors = ['#2CB584', '#F3F3F3'];
  public width = 240;
  public height = 290;

  constructor(public element: ElementRef) { }

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html((d) => {
      const value = this.data.filter((item, index) => d.name === item.name);
      return `<div class='customPopover'>
      </div>`;
    });

  ngOnInit() {
    this.data = 30;
    this.drawChart();
  }

  ngOnChanges() {
    this.drawChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }

  drawChart() {
    const self = this;
    this.width = this.element.nativeElement.offsetWidth;
    this.height = (this.height < 1) ? 240 : this.height;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'rectangularBarChart');

    const width = +svg.attr('width') - this.margin.left - this.margin.right;
    const height = +svg.attr('height') - this.margin.top - this.margin.bottom - 15;

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const gVal = g.selectAll('.bar')
      .data([this.data * width / 100, (100 - this.data) * width / 100])
      .enter();

    gVal.append('rect')
      .attr('class', '')
      .attr('x', (d, i) => {
        if (i === 0) {
          return 0;
        }
        return this.data * width / 100;
      })
      .attr('height', this.barheight)
      .attr('y', 0)
      .attr('width', d => d)
      .attr('fill', (d, i) => {
        return this.colors[i];
      });

    g.append('line')
      .style('stroke', '#333333')
      .attr('x1', this.data * width / 100)
      .attr('y1', this.barheight)
      .attr('x2', this.data * width / 100)
      .attr('y2', -20);

    g.call(this.tip);

  }
}
