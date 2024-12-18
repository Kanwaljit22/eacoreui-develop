import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { AccountHealthInsighService } from '../account-health-insight/account.health.insight.service';
import { ShortNumberPipe } from '@app/shared/pipes/short-number.pipe';

@Directive({
  selector: '[appVerticalBarChart]'
})
export class VerticalBarChartDirective implements OnInit, OnChanges {

  @Input() data: any;
  @Input() barWidth;
  @Input() margin = { top: 15, right: 0, bottom: 50, left: 30 };
  @Input() colors = ['#115E7C', '#1BB28C'];
  @Input() leftYLabel = 'Values in Counts';
  @Input() currentValue: string;
  @Input() height;
  public width: number;
  public legends = [];
  private table: any;
  tip: any;

  constructor(public element: ElementRef, private accountHealthInsighService: AccountHealthInsighService,
    private numberPipe: ShortNumberPipe
    // private textWrapingService: D3TextWrapServiceService,
    // public numberFormatService: NumberFormatService,
    // public utilService: UtilityService
  ) { }

  createTip() {
    return d3Tip()
      .attr('class', 'tooltip top')
      .offset([-10, 0])
      .html((d) => {
        let val = this.numberPipe.transform(d.value);
        return ` <div class="tooltip-arrow icon-arrow-up"></div>
      <div class="tooltip-inner">${val}</div>`;
      });
  }

  ngOnInit() {
    //this.data = [{ 'name': 'Q4 FY16', value: 350000 }, { 'name': 'Q1 FY17', value: 550000 }, { 'name': 'Q2 FY17', value: 850000 }, { 'name': 'Q3 FY17', value: 880000 }, { 'name': 'Q4 FY17', value: 550000 }, { 'name': 'Q1 FY18', value: 810000 }, { 'name': 'Q1 FY19', value: 150000 }];
    this.legends = ['Renewals in past', 'Upcoming Renewals'];
    this.accountHealthInsighService.loadRenewalData.subscribe((data: any) => {
      this.data = data;
      this.drawChart();
    });
    this.tip = this.createTip();
  }

  ngOnChanges() {
    //  this.legends = ['Renewals in past', 'Upcoming Renewals'];
    //   this.drawChart();
    // //  this.createlegends();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //   this.data = [{ 'name': 'Q4 FY16', value: 350000 }, { 'name': 'Q1 FY17', value: 550000 }, { 'name': 'Q2 FY17', value: 850000 }, { 'name': 'Q3 FY17', value: 880000 }, { 'name': 'Q4 FY17', value: 550000 }, { 'name': 'Q1 FY18', value: 810000 }, { 'name': 'Q1 FY19', value: 150000 }];
    //  this.legends = ['Renewals in past', 'Upcoming Renewals'];
    //   this.drawChart();
  }

  hasEveryValue(el, index, arr) {
    // Do not test the first array element, as you have nothing to compare to
    if (index === 0) {
      return true;
    } else {
      // do each array element value match the value of the previous array element
      return (el.value === arr[index - 1].value);
    }
  }

  drawChart() {

    this.data.forEach(element => {
      if (element.currentQuarter) {
        this.currentValue = element.name;
      }
    });
    const self = this;
    const ele = this.element.nativeElement.offsetWidth;
    this.width = ele - this.margin.left - this.margin.right;
    this.height = (this.height < 1) ? 240 : this.height;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'verticalBarChart');

    //  const width = +svg.attr('width') - this.margin.left - this.margin.right;
    const height = +svg.attr('height') - this.margin.top - this.margin.bottom - 15;

    svg.call(self.tip);

    const x = d3.scaleBand().range([0, this.width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    if (this.data) {
      if (this.data.every(this.hasEveryValue) === false) {
        y.domain([0, d3.max(this.data, d => d.value)]).nice();
      } else {
        y.domain([0, 1000]);
      }
      x.domain(this.data.map(d => d.name)).padding(0.8);
    }

    // const ticks = y.ticks();
    // const lastTick = ticks[ticks.length - 1],
    // newLastTick = lastTick + (ticks[1] - ticks[0]);
    // if (lastTick < y.domain()[1]) {
    // ticks.push(newLastTick);
    // }
    // y.domain([y.domain()[0], newLastTick]);

    g.append('g')
      .attr('class', 'x axis tickhide')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x)
        .tickPadding(5)
        .tickSizeOuter(0));

    // g.selectAll('.x .tick text')
    //   .call(this.textWrapingService.wrapAxisText, d3);

    g.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y).ticks(3).tickFormat(function (d) {
        let val = d3.format(',.1s')(d);
        val = val.replace('k', 'K');
        return val;
      })
        .tickSizeInner([-this.width]).tickSizeOuter(0));

    const gVal = g.selectAll('.bar')
      .data(this.data)
      .enter();

    g.append('rect')
      .attr('class', 'shaded')
      .attr('x', x(self.currentValue) + (self.barWidth / 2) + x.bandwidth())
      .attr('y', 0)
      .attr('width', x(x.domain()[x.domain().length - 1]) - x(self.currentValue) + (self.barWidth / 2) + x.bandwidth())
      .attr('height', height)
      .attr('fill', '#C3CE3D')
      .attr('opacity', 0.1)
      .attr('y2', y(d3.max(this.data, d => d.value)));

    // g.append('rect')
    // .attr('x', x(this.currentValue) - 15)
    // .attr('y', y(0) - 12)
    // .attr('rx', 6)
    // .attr('ry', 6)
    // .attr('width', this.barWidth - 2)
    // .attr('height', 17)
    // .attr('stroke', 'black')
    // .attr('stoke-width', 1)
    // .attr('fill', '#000')
    // .attr('opacity', 0.3)
    // .attr('class', 'x-l-legend-bbc1')
    // .style('text-anchor', 'middle');

    // g.append('text')
    // .attr('x',function(d, i) {
    //   if (self.barWidth === 55) {
    //     return x(self.currentValue) + 10
    //   } else {
    //      return x(self.currentValue) + 5
    //   }})
    // .attr('y', y(0))
    // .attr('class', 'current-text')
    // .attr('fill', '#fff')
    // .style('text-anchor', 'middle')
    // .text('Current');

    const triangle = d3.symbol()
      .type(d3.symbolTriangle)
      .size(30);
    const triangleX = x(self.currentValue) + (x.bandwidth()) / 2;
    const triangleTopY = 0;

    g.append('line')
      .style('stroke', 'black')
      .attr('class', 'current-quarter')
      .attr('x1', function (d, i) {
        return x(self.currentValue) + (x.bandwidth()) / 2;
      })
      .attr('y1', y(0))
      .attr('x2', function (d) {
        return x(self.currentValue) + (x.bandwidth()) / 2;
      });

    g.append('path')
      .attr('d', triangle)
      .attr('stroke', 'black')
      .attr('fill', 'black')
      .attr('transform', function () {
        return 'translate(' + triangleX + ',' + triangleTopY + ') rotate(180)';
      });

    gVal.append('rect')
      .attr('class', 'rect-bar')
      .attr('x', d => x(d.name) + (x.bandwidth() - this.barWidth) / 2)
      .attr('height', d => y(0) - y(d.value))
      .attr('y', d => y(d.value))
      .attr('width', this.barWidth)
      .attr('fill', (d, i) => {
        if (i <= this.data.findIndex(x => x.name === this.currentValue)) {
          return this.colors[0];
        }
        return this.colors[1];
      })
      .on('mouseover', function (d) {
        self.tip.show(d, this);
      })
      .on('mouseout', function (d) {
        self.tip.hide(d, this);
      });

    g.append('line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '3')
      .attr('x1', function (d, i) {
        return x(self.currentValue) + (self.barWidth / 2) + x.bandwidth();
      })
      .attr('y1', y(0))
      .attr('x2', function (d) {
        return x(self.currentValue) + (self.barWidth / 2) + x.bandwidth();
      });

    this.createlegends();
  }

  createlegends() {
    let svg = d3.select(this.element.nativeElement);
    const thisInstance = this;
    this.table = svg.append('table');
    const legend = this.table.attr('class', 'renewal-legend');
    const tr = legend.append('tbody').append('tr');
    const td = tr.selectAll('td').data(this.legends).enter().append('td');
    const div = td.append('div')
    div.append('svg').attr('width', '10').attr('height', '10').append('rect')
      .attr('width', '10').attr('height', '10')
      .attr('fill', (d, i) => this.colors[i]);

    div.append('text')
      .attr('class', 'clear-link')
      .text(d => d);
    // .text(function (d, i) {
    //   return d.charAt(0).toUpperCase() + d.slice(1); // code added to make first letter of string to uppercase
    // });
  }
}
