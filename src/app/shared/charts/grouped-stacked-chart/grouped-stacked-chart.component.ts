import {
  Component, OnInit, OnChanges, ViewChild, ElementRef, Input,
  ViewEncapsulation, Output, EventEmitter, SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';
import { ColorsService } from '../../services/colors.service';
import { UtilitiesService } from '../../services/utilities.service';
declare var $: any;

@Component({
  selector: 'app-grouped-stacked-chart',
  templateUrl: './grouped-stacked-chart.component.html',
  styleUrls: ['./grouped-stacked-chart.component.scss']
})
export class GroupedStackedChartComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, right: 20, bottom: 30, left: 60 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private transitionDuration = 500;
  private keys: Array<any>;
  private show = 4;
  public start = 0;
  public start_max = 0;
  private data_new;
  private sF: Array<any>;
  private y: any;
  private table: any;
  public tableData = [];
  @Input() private active: Array<any>;
  constructor(private colorsService: ColorsService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.cal();
    this.createChart();
    this.tableHeading();
  }


  ngOnChanges(changes: SimpleChanges) {

    this.cal();
    this.createChart()
    this.tableHeading();
    // if (this.chart) {
    //   this.updateChart();
    // }
  }
  getColor(d) {
    return this.colors[d];
  }

  cal() {
    //  this.keys = this.utilitiesService.getUniqueKeys(this.data);
    this.colors = this.colorsService.getColors(this.keys);
    this.show = this.show < this.data.length ? this.show : this.data.length;
    this.start_max = this.data.length - this.show;
    this.data_new = this.data.slice(this.start, this.show + this.start);
    // this.keys = this.utilitiesService.getUniqueKeys(this.this.data);
    // this.colors = this.colorsService.getColors(this.keys);

  }
  createChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = 310;

    const thisInstance = this;

    // var svg = d3.select(element).append('svg')
    //   .attr('width', this.width)
    //   .attr('height', this.height);

    this.height = this.height - this.margin.top - this.margin.bottom + 40;




    // var margin = {top: 20, right: 20, bottom: 30, left: 40},
    // width = 400 - margin.left - margin.right,
    // height = 200 - margin.top - margin.bottom;

    let x0 = d3.scaleBand()
      .rangeRound([0, this.width], 0.4);

    let x1 = d3.scaleOrdinal();

    let y = d3.scaleLinear()
      .range([this.height, 0]);

    let xAxis = d3.axisBottom(x0)
      .tickPadding(4);

    let yAxis = d3.axisLeft(y)
      .tickFormat(function (d) {
        return d;
      })
      .tickValues(ticks)
      .tickSize(-this.width);

    let color = d3.scaleOrdinal()
      .range(['#3B3689', '#50AED3', '#48B24F', '#E57438']);

    let svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    let yBegin;

    let innerColumns = {
      'column1': ['HW', 'HW Service', 'SW', 'SW Service'],
      'column2': ['HW2', 'HW Service2', 'SW2', 'SW Service2'],
      'column3': ['HW3', 'HW Service3', 'SW3', 'SW Service3'],
      'column4': ['HW4', 'HW Service4', 'SW4', 'SW Service4']
    }


    this.tableData.push(innerColumns['column1']);
    let columnHeaders = d3.keys(this.data[0]).filter(function (key) {
      return key !== 'PerformanceBand' && key !== 'total' && key !== 'columnDetails'; });
    color.domain(d3.keys(this.data[0]).filter(function (key) { return key !== 'PerformanceBand'; }));
    this.data.forEach(function (d) {
      // console.log(d);
      let yColumn = new Array();
      d.columnDetails = columnHeaders.map(function (name) {
        for (let ic in innerColumns) {
          // console.log('ic:',ic);
          if ($.inArray(name, innerColumns[ic]) >= 0) {
            if (!yColumn[ic]) {
              yColumn[ic] = 0;
            }
            yBegin = yColumn[ic];
            yColumn[ic] += +d[name];
            return { name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin, };
          }

        }
      });
      d.total = d3.max(d.columnDetails, function (d) {
        return d ? d.yEnd : false;
      });
    });



    x0.domain(this.data.map(function (d) { return d.PerformanceBand; }));
    // x1.domain(d3.keys(innerColumns)).scaleBand().rangeRound([0, x0.bandwidth()]);
    x1 = d3.scaleBand()
      .domain(d3.keys(innerColumns))
      .range([0, x0.bandwidth() - 120]);

    y.domain([0, d3.max(this.data, function (d) {
      return d.total;
    })]);

    var ticks = y.ticks();
    const lastTick = ticks[ticks.length - 1],
      newLastTick = lastTick + (ticks[1] - ticks[0]);
    if (lastTick < y.domain()[1]) {
      ticks.push(newLastTick);
    }
    y.domain([y.domain()[0], newLastTick]);

    svg.selectAll('.x.axis .tick text')
      .attr('x', 0)
      .attr('dx', '.71em');

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('');

    let project_stackedbar = svg.selectAll('.project_stackedbar')
      .data(this.data)
      .enter().append('g')
      .attr('class', 'g')
      .attr('transform', function (d) { return 'translate(' + x0(d.PerformanceBand) + ',0)'; });

    project_stackedbar.selectAll('rect')
      .data(function (d) { return d.columnDetails; })
      .enter().append('rect')
      .attr('width', 35)
      .attr('x', function (d) {
        return x1(d.column) + x1.bandwidth() - 60 / 2 + 50;
      })
      .attr('y', function (d) {
        return y(d.yEnd);
      })
      .attr('height', function (d) {
        return (y(d.yBegin) - y(d.yEnd));
      })
      .style('fill', function (d) { return color(d.name); });


  }

  moveRight() {
    if (this.start === this.start_max) {
      return;
    }
    this.start++;
    this.data_new = this.data.slice(this.start, this.show + this.start);
    this.cal();
    this.createChart();
    this.tableHeading();
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    this.data_new = this.data.slice(this.start, this.show + this.start);
    this.cal();
    this.createChart();
    this.tableHeading();
  }


  tableHeading() {
    // let ledgendsData = ['HW', 'HW Service', 'SW', 'SW Service'];

    const element = this.chartContainer.nativeElement;

    this.table = d3.select(element).append('table');
    const legend = this.table.attr('class', 'legend threePlus marginT50');
    const tr = legend.append('tbody').append('tr');
    const td = tr.selectAll('td').data(this.tableData[0]).enter().append('td');
    const div = td.append('div').on('click', function (d) {
      //   thisInstance.toggleSelection(d, thisInstance);
    });

    div.attr('class', function (d, i) {
      return 'lineLegends' + i;
    }).append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('width', '8').attr('height', '8')
      .attr('fill', function (d, j) {
        const colors = {
          'HW': '#3B3689',
          'HW Service': '#50AED3',
          'SW': '#48B24F',
          'SW Service': '#E57438'
        };
        return colors[d];
      });


    div.append('text')
      .text(function (d) {
        return d;
      });
  }


}
