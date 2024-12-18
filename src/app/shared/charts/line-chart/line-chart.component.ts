// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ColorsService } from '../../services/colors.service';
import { UtilitiesService } from '../../services/utilities.service';
// import { UpdateChartAmountService } from '../../services/update-chart-amount.service';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
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
  private show = 6;
  private start = 0;
  private start_max = 0;
  private data_new;
  private sF: Array<any>;
  private mF: Array<any>;
  private x: any;
  private y: any;
  private table: any;
  private chartType: string;
  private pD: Array<any>;
  private qmy: any;
  @Input() private active: Array<any>;
  // @Input() private expanded: boolean;
  // @Input() private currentquarter: Array<any>;
  // @Input() private currentmonth: Array<any>;
  // @Input() private currentyear: Array<any>;
  // @Input() private averageline: Array<any>;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onActiveChange: EventEmitter<any> = new EventEmitter<any>();

  // tslint:disable-next-line:max-line-length
  constructor(private colorsService: ColorsService, private utilitiesService: UtilitiesService) { }
  barDoubleAverage: any;

  ngOnInit() {
    // this.calcData();
    // this.createLineChart();
    // this.createLegends();
    // resize chart for reponsive layout
    // const thisInstance = this;
    // window.addEventListener('resize', function (event) {
    //   setTimeout(() => {
    //     thisInstance.createLineChart();
    //   //  thisInstance.createLegends();
    //   }, 20);
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.chart) {
    //   // this.updateChart();
    // }
    // if (this.chart && changes.expanded) {
    //   this.createLineChart();
    //  // this.createLegends();
    // }
    if (changes.data) {
      this.calcData();
      this.createLineChart();
      this.createLegends();
    }
  }

  getColor(d) {
    return this.colors[d];
  }

  calcData() {
    if (this.data) {
      this.chartType = 'line';
      this.keys = this.utilitiesService.getUniqueKeys(this.data);
      this.show = this.show < this.data.length ? this.show : this.data.length;
      this.data_new = this.data.slice(this.start, this.show + this.start);
      this.colors = this.colorsService.getColors(this.keys);
      const fData = <any>[];
      this.data_new.forEach(function (d) {
        const o = <any>{};
        o.state = d.quarter;
        o.freq = {};
        const areas = d.areas;
        areas.forEach(function (e) {
          const b = e.freq;
          for (const prop in b) {

            if (b.hasOwnProperty(prop)) {
              if (typeof o.freq[prop] !== 'undefined') {
                o.freq[prop] += b[prop];
                // o.freq[prop] += b.Plan;
              } else {
                o.freq[prop] = b[prop];
                // o.freq[prop] = b.Plan;

              }
            }
          }
        });
        fData.push(o);
      });


      // this.pD = this.keys.map(function (d) {
      //   return {
      //     state: d, freq: fData.map(function (t) {
      //       return {
      //         key: t.state,
      //         value: t.freq[d]
      //       };
      //     }), total: d3.sum(fData.map(function (t) {
      //       return t.freq[d];
      //     }))
      //   };
      // });

      const keys = this.keys;

      fData.forEach(function (d) {
        d.total = 0;
        const freq = d.freq;
        for (const prop in freq) {
          if (freq.hasOwnProperty(prop)) {
            d.total += freq[prop];
          }
        }
      });

      const sF = <any>[];
      const mF = <any>[];
      const yColumn = <any>[];
      fData.forEach(function (d) {
        for (const prop in d.freq) {
          if (d.freq.hasOwnProperty(prop)) {
            if (!yColumn[d.state]) {
              yColumn[d.state] = 0;
            }
            sF.push({
              state: d.state,
              total: d.total,
              key: prop,
              start: yColumn[d.state] ? (yColumn[d.state] + 0) : yColumn[d.state],
              end: yColumn[d.state] + d.freq[prop],
              value: d.freq[prop]
            });
            yColumn[d.state] += d.freq[prop];
          }
        }
      });
      this.sF = sF;

      this.mF = keys.map(function (d) {
        return {
          type: d,
          values: fData.map(function (t) {
            return {
              state: t.state,
              value: t.freq[d] || 0
            };
          })
        };
      });
    }
  }

  toggleSelection(d, thisInstance) {
    const type = d.key ? d.key : d;
    const active = thisInstance.utilitiesService.getActive(thisInstance.active, type, d3);
    this.onActiveChange.emit(active);
  }

  createLineChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = 255;

    const thisInstance = this;
    // svg element appended
    const svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.height = this.height - this.margin.top - this.margin.bottom;

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // created the scales for x
    const x = d3.scaleBand().rangeRound([0, this.width])
      .domain(this.sF.map(function (d) {
        return d.state;
      }));

    const xAxis = d3.axisBottom(x);

    this.chart.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    this.chart.selectAll('.x.axis .tick text')
      .attr('x', 4)
      .attr('dx', '0.71em');

    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    const y = this.y;

    const max = d3.max(this.sF, function (d) {
      return d.value;
    });


    y.domain([0, max + (max * 1)]);

    this.yAxis = d3.axisLeft(y)
      .tickFormat(function (d) {
        return d;
      })
      .ticks(4)
      .tickSize(-this.width);


    this.chart.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 4)
      .style('text-anchor', 'end')
      .text('');

    /* -- define the area code starts --*/
    const area = d3.area()
      .x(function (d) { return x(d.state) + (x.bandwidth() + 10) / 2; })
      //  .y0(this.height)
      .y1(function (d) { return y(d.value); })
      .curve(d3.curveCatmullRom.alpha(0.5));
    /* -- code ends --*/

    const lineFunc = d3.line()

      .x(function (d) {
        return x(d.state) + (x.bandwidth() + 10) / 2;
      })
      .y(function (d) {
        return y(d.value);
      });
    // .curve(d3.curveCatmullRom.alpha(0.5));
    // .curve(d3.curveCardinal);

    /*-- area fill code added --*/
    // this.chart.append('path')
    //   .data(this.mF)
    //   .attr('class', 'area')
    //   .attr('d', function (d) {
    //     console.log('fill area',d);
    //     var tmpObj = [];
    //     for (var i = 0; i < d.values.length; i++) {
    //       if (d.values[i].value)
    //         tmpObj.push(d.values[i]);
    //     }
    //     return area(tmpObj);
    //   })
    //   .style('fill', '#EBECEE');
    /*-- area fill code ends --*/

    const bars = this.chart.selectAll('.line')
      .data(this.mF)
      .enter().append('g')
      .attr('class', 'line');

    bars.append('path')
      .attr('class', 'line')
      .attr('d', function (d) {
        const tmpObj = [];
        for (let i = 0; i < d.values.length; i++) {
          if (d.values[i].value) {
            tmpObj.push(d.values[i]);

          }
        }
        return lineFunc(tmpObj);
      })
      .style('stroke-width', '2px')
      .style('stroke', (d, i) => {
        const colors = {
          'ALC': '#267278',
          'BAU': '#65338D',
          'EA': '#D21F75',
          'C1': '#4770B3'
        };
        return colors[d.type];
      })
      .attr('fill', 'none')
      .style('stroke-opacity', '1');

    bars.selectAll('.dot')
      .data(this.sF)
      .enter().append('circle')
      .attr('class', function (d, i) {
        return 'front front_' + i;
      })
      .attr('r', 4)
      .attr('cx', function (d) {
        return x(d.state) + (x.bandwidth() + 10) / 2;
      })
      .attr('cy', function (d) {
        return y(d.value);
      })
      .style('fill', (d, i) => {
        const colors = {
          'ALC': '#267278',
          'BAU': '#65338D',
          'EA': '#D21F75',
          'C1': '#4770B3'
        };
        return colors[d.key];
      })
      // .style('fill', function (d) {
      //   if (!d.value) {
      //     return 'transparent';
      //   }
      // })
      .style('fill-opacity', '1');


    // // average line
    // const avgColor = '#333333';
    // const xx = this.x;
    // const yx = this.y;

    // this.chart.append('line')
    //   .attr('x1', 0)
    //   .attr('y1', y(this.averageline))
    //   .attr('x2', x.range()[1])
    //   .attr('y2', y(this.averageline))
    //   .attr('stroke-width', 2)
    //   .attr('stroke', avgColor)
    //   .attr('stroke-dasharray', 3, 3);

    // this.chart.append('text')
    //   .attr('class', 'average-line')
    //   .attr('x', '30')
    //   .attr('y', y(this.averageline) - 10)
    //   .style('fill', avgColor);

  }


  createLegends() {
    const element = this.chartContainer.nativeElement;
    const thisInstance = this;
    const len = this.keys.length;
    let legendClass = '';
    if (len > 3) {
      legendClass = 'threePlus';
    } else if (len === 3) {
      legendClass = 'three';
    } else if (len === 2) {
      legendClass = 'two';
    } else if (len === 1) {
      legendClass = 'one';
    }

    this.table = d3.select(element).append('table');
    const legend = this.table.attr('class', 'legend ' + legendClass);
    const tr = legend.append('tbody').append('tr');
    const td = tr.selectAll('td').data(this.keys).enter().append('td');
    const div = td.append('div').on('click', function (d) {
      thisInstance.toggleSelection(d, thisInstance);
    });

    div.attr('class', function (d, i) {
      return 'lineLegends' + i;
    }).append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('width', '8').attr('height', '8')
      .attr('fill', function (d, j) {
        const colors = {
          'ALC': '#267278',
          'BAU': '#65338D',
          'EA': '#D21F75',
          'C1': '#4770B3'
        };
        return colors[d];
      });

    div.append('text')
      .text(function (d) {
        return d;
      });


    /* --bar double chart total average code-- */
    // const barDoubleTotal = d3.sum(this.pD.map(function (t) {
    //   return t.total;
    // }));
    // let val = d3.format(',.3s')(this.averageline);
    // val = (val.replace('M', 'M'));
    // this.dataChart.currentBarFun(val)
    /*-- code ends --*/
  }


}


