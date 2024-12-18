// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ColorsService } from '../../services/colors.service';
import { UtilitiesService } from '../../services/utilities.service';
import { constants } from 'os';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements OnInit, OnChanges {
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
  private y: any;
  private table: any;
  @Input() private active: Array<any>;
  // @Output() onActiveChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private colorsService: ColorsService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    // this.calcData();
    // this.createChart();
    // this.createLegends();
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.calcData();
      this.createChart();
      // this.createLegends();
    }
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  getColor(d) {
    return this.colors[d];
  }

  calcData() {

    this.keys = this.utilitiesService.getUniqueKeys(this.data);
    this.colors = this.colorsService.getColors(this.keys);
    if (this.data) {
      this.show = this.show < this.data.length ? this.show : this.data.length;
      this.data_new = this.data.slice(this.start, this.show + this.start);
    }

    const fData = <any>[];
    if (this.data_new) {
      this.data_new.forEach(function (d) {
        const o = <any>{};
        o.state = d.quarter;
        o.stateId = d.quarterId || d.quarter;
        o.freq = {};
        const areas = d.areas;
        areas.forEach(function (e) {
          const b = e.freq;
          for (const prop in b) {
            if (b.hasOwnProperty(prop)) {
              let val = 0;
              if (typeof b[prop] === 'object') {
                val = 0;
                for (const prop_2 in b[prop]) {
                  if (prop_2 !== 'areas_drill') {
                    val += b[prop][prop_2];
                  }
                }
              } else {
                val = b[prop];
              }
              if (typeof o.freq[prop] !== 'undefined') {
                o.freq[prop] += val;
              } else {
                o.freq[prop] = val;
              }
            }
          }
        });
        fData.push(o);
      });
    }

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
    const yColumn = <any>[];
    fData.forEach(function (d) {
      for (const prop in keys) {
        if (keys.hasOwnProperty(prop)) {
          if (!yColumn[d.state]) {
            yColumn[d.state] = 0;
          }
          sF.push({
            state: d.state,
            stateId: d.stateId,
            total: d.total,
            key: keys[prop],
            start: yColumn[d.state] ? (yColumn[d.state] + 0) : yColumn[d.state],
            end: yColumn[d.state] + d.freq[keys[prop]],
            value: d.freq[keys[prop]]
          });
          yColumn[d.state] += d.freq[keys[prop]];
        }
      }

    });
    this.sF = sF;
  }

  toggleSelection(d, thisInstance) {
    const type = d.key ? d.key : d;
    const active = thisInstance.utilitiesService.getActive(thisInstance.active, type, d3);
    // this.onActiveChange.emit(active);
  }

  bar_mouseover(i, thisInstance) {
    const bars = this.chart.selectAll('.bar').data(this.sF);
    bars.select('rect.front.front_' + i)
      .attr('fill', function (d) {
        const color = thisInstance.getColor(d.key);
        if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
          return color;
        }
        // return thisInstance.utilitiesService.getDarkColor(color);
      });
  }

  bar_mouseout(i, thisInstance) {
    const bars = this.chart.selectAll('.bar').data(this.sF);
    bars.select('rect.front.front_' + i)
      .attr('fill', function (d) {
        const color = thisInstance.getColor(d.key);
        if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
          return '#ccc';
        }
        return color;
      });
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();
    let offset = element.offsetWidth;
    if (offset == 0) {
      return;
    }
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = 275;

    const thisInstance = this;

    const svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.height = this.height - this.margin.top - this.margin.bottom;

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const x = d3.scaleBand().rangeRound([0, this.width])
      .padding(0.1)
      .align(0.1)
      .domain(this.sF.map(function (d) {
        return d.state;
      }));

    const xAxis = d3.axisBottom(x)
      .tickPadding(5);

    this.chart.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    this.chart.selectAll('.x.axis .tick text')
      .attr('x', 0)
      .attr('dx', '.71em');
    //   .call(thisInstance.utilitiesService.wrapAxisText, d3);

    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    const y = this.y;

    const max = d3.max(this.sF, function (d) {
      return d.total;
    });

    y.domain([0, max + (max * 0.20)]);

    this.yAxis = d3.axisLeft(y)
      .tickFormat(function (d) {
        // let val = d3.format(',.3s')(d);
        //  val = (val.replace('G', 'B'));
        return d;
      }).ticks(6)
      .tickSize(-this.width);

    this.chart.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('');

    const bars = this.chart.selectAll('.bar').data(this.sF).enter()
      .append('g').attr('class', 'bar');
    const end = {};

    bars.append('rect')
      .attr('class', function (d, i) {
        return 'front front_' + i;
      })
      .attr('x', function (d) {
        return x(d.state) + (x.bandwidth() - 20) / 2;
      })
      .attr('y', function (d) {
        if (!end[d.state]) {
          end[d.state] = 0;
        }
        end[d.state] += d.value;
        return y(end[d.state]);
      })
      .attr('width', 40)
      .attr('height', function (d) {
        const m = !d.start ? 0 : 2;
        const val = y.range()[0] - y(d.value) - m;
        return val > 0 ? val : 0;
      })
      .attr('fill', function (d, j) {
        const colors = {
          'A-la-carte (ALC)': '#267278',
          'Business As Usual (BAU)': '#65338D',
          'Enterprise Agreement (EA)': '#4770B3',
          'Cisco ONE (C1)': '#D21F75'
        };
        return colors[d.state];
      });
    // .on('click', function (d) {
    //   thisInstance.toggleSelection(d, thisInstance);
    // })
    // .on('mouseover', function (d, i) {
    //   thisInstance.bar_mouseover(i, thisInstance);
    // })
    // .on('mouseout', function (d, i) {
    //   thisInstance.bar_mouseout(i, thisInstance);
    // });

    // bars.append('rect').attr('class', 'back')
    //   .attr('x', function (d) {
    //     return x(d.state) + (x.bandwidth() - 20);
    //   })
    //   .attr('y', function (d) {
    //     return 0;
    //   })
    //   .attr('width', 20)
    //   .attr('height', function (d) {
    //     return y(end[d.state]);
    //   })
    //   .attr('fill', function (d) {
    //     return '#EDEEF1';
    //   });

  }

  // createLegends() {

  //   const element = this.chartContainer.nativeElement;
  //   const thisInstance = this;

  //   const len = this.keys.length;
  //   let legendClass = '';
  //   if (len > 3) {
  //     legendClass = 'threePlus';
  //   } else if (len === 3) {
  //     legendClass = 'three';
  //   } else if (len === 2) {
  //     legendClass = 'two';
  //   } else if (len === 1) {
  //     legendClass = 'one';
  //   }

  //   this.table = d3.select(element).append('table');
  //   const legend = this.table.attr('class', 'legend ' + legendClass);
  //   const tr = legend.append('tbody').append('tr');
  //   const td = tr.selectAll('td').data(this.keys).enter().append('td');
  //   const div = td.append('div').on('click', function (d) {
  //     thisInstance.toggleSelection(d, thisInstance);
  //   });

  //   div.append('svg').attr('width', '8').attr('height', '8').append('rect')
  //     .attr('width', '8').attr('height', '8')
  //     .attr('fill', (d, i) => this.getColor(d));

  //   div.append('text')
  //     .text(function (d) {
  //       return d;
  //     });

  // }

  updateChart() {
    let max = 0;
    const max_array = [];
    const thisInstance = this;
    const y = this.y;

    if (this.active.length) {
      this.active.forEach(function (k) {
        max_array.push(d3.max(thisInstance.sF.filter(function (d) {
          return d.key === k;
        }), function (d) {
          return d.value;
        }));
      });
      max_array.forEach(function (e) {
        max += e;
      });
    } else {
      max = d3.max(this.sF, function (d) {
        return d.total;
      });
    }

    max += max * 0.20;

    y.domain([0, max]);

    this.chart.selectAll('g.y.axis')
      .call(this.yAxis);

    const bars = this.chart.selectAll('.bar').data(this.sF);
    const end = {};

    bars.select('rect.front').transition().duration(this.transitionDuration)
      .attr('y', function (d) {
        if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
          return 0;
        }
        if (!end[d.state]) {
          end[d.state] = 0;
        }
        end[d.state] += d.value;
        return y(end[d.state]);
      })
      .attr('height', function (d) {
        if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
          return 0;
        }
        const m = (thisInstance.active.indexOf(d.key) === 0 || !d.start) ? 0 : 2;
        const val = y.range()[0] - y(d.value) - m;
        return val > 0 ? val : 0;
      })
      .attr('fill', (d, i) => this.getColor(d.key));

    bars.select('rect.back').transition().duration(this.transitionDuration)
      .attr('height', function (d) {
        if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
          return 0;
        }
        return y(end[d.state]);
      });

    this.table.selectAll('td').attr('class', function (e) {
      if (thisInstance.active.length && thisInstance.active.indexOf(e) === -1) {
        return 'disabled';
      }
      return '';
    });

  }

}
