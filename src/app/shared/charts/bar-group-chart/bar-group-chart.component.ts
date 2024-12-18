// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnChanges, ViewChild, ElementRef, AfterViewInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ColorsService } from '../../services/colors.service';
import { UtilitiesService } from '../../services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ShortNumberPipe } from '@app/shared/pipes/short-number.pipe';

@Component({
  selector: 'app-bar-group-chart',
  templateUrl: './bar-group-chart.component.html',
  styleUrls: ['./bar-group-chart.component.scss']
})
export class BarGroupChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, right: 20, bottom: 30, left: 40 };
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
  @Input() private active: Array<any>;
  private legendToolTipDiv: any;
  // @Output() onActiveChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private colorsService: ColorsService, private utilitiesService: UtilitiesService,
    private appDataService: AppDataService, private numberPipe: ShortNumberPipe) { }

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
      this.createLegends();
    }
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  ngAfterViewInit() {
    this.appDataService.loadGraphDataEmitter.subscribe((graphData: any) => {
      this.data = graphData;
      this.calcData();
      // this.tip = this.createTip();
      this.createChart();
      this.createLegends();
    });
  }


  getColor(d) {
    return this.colors[d];
  }

  calcData() {

    this.keys = this.utilitiesService.getUniqueKeys(this.data);
    this.colors = this.colorsService.getColors(this.keys);
    this.show = this.show < this.data.length ? this.show : this.data.length;
    this.start_max = this.data.length - this.show;
    this.data_new = this.data.slice(this.start, this.show + this.start);

    const fData = <any>[];
    this.data_new.forEach(function (d) {
      const o = <any>{};
      o.state = d.quarter;
      o.stateId = d.quarterId || d.quarter;
      o.freq = {};
      o.val = d.keys;
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
            value: d.freq[keys[prop]],
            val: d.val
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
    //  this.onActiveChange.emit(active);
  }

  bar_mouseover(i, thisInstance) {
    const bars = this.chart.selectAll('.bar').data(this.sF);
    bars.select('rect.front.front_' + i)
      .attr('fill', function (d, j) {
        const colors = ['#4770b3', '#267278', '#50aed3', '#e4b031', '#4770b3', '#267278',
          '#e4b031', '#50aed3', , '#4770b3', '#267278', '#e4b031', '#50aed3'];
        return colors[j];

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
    if (offset === 0) {
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

    this.legendToolTipDiv = d3.select('body').append('div')
      .attr('class', 'tooltip top');

    const x = d3.scaleBand().rangeRound([0, this.width])
      .padding(0.1)
      .align(0.1)
      .domain(this.sF.map(function (d) {
        return d.state;
      }));

    const xAxis = d3.axisBottom(x)
      .tickPadding(4);

    this.chart.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    this.chart.selectAll('.x.axis .tick text')
      .attr('x', 0)
      .attr('dx', '.71em');
    // .style('font-weight', 'bold');

    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    const y = this.y;

    const max = d3.max(this.sF, function (d) {
      return d.end;
    });

    const x1 = d3.scaleBand()
      .padding(0.05);


    y.domain([0, max + (max * 0.20)]);

    const ticks = y.ticks();
    const lastTick = ticks[ticks.length - 1],
      newLastTick = lastTick + (ticks[1] - ticks[0]);
    if (lastTick < y.domain()[1]) {
      ticks.push(newLastTick);
    }
    y.domain([y.domain()[0], newLastTick]);

    this.yAxis = d3.axisLeft(y)
      .tickFormat(function (d) {
        let val = d3.format(',.2s')(d);
        //  val = (val.replace('G', 'M'));
        return val;
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
        if (d.key === 'GB' || d.key === 'eaBenefit') {
          return x(d.state) + (x.bandwidth() - 60) / 2 + 30;
        } else if (d.key === 'LCB') {
          return x(d.state) + (x.bandwidth() - 60) / 2 + 60;
        } else if (d.key === 'OB') {
          return x(d.state) + (x.bandwidth() - 60) / 2 + 95;
        } else if (d.key === 'PC') {
          return x(d.state) + (x.bandwidth() - 60) / 2 + 60;
        } else {
          return x(d.state) + (x.bandwidth() - 60) / 2;
        }
      })
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('width', 25)
      .attr('height', function (d) {
        const m = !d.start ? 0 : 2;
        const val = y.range()[0] - y(d.value);
        return val > 0 ? val : 0;
      })
      .attr('fill', (d, i) => {
        const colors = {
          'EP': '#005073',
          'OB': '#AF564F',
          'GB': '#EEB15C ',
          'LCB': '#64BBE3',
          'PC': '#20c997',
          'eaBenefit': '#CCC'
        };
        return colors[d.key];
      });


    bars.append('text')
      .attr('x', function (d) {
        return x(d.state) + (x.bandwidth() - 60) / 2 + 30;

        //  else if (d.key === 'C1') {
        //   return x(d.state) + (x.bandwidth() - 60) / 2 + 105;
        //  } else if (d.key === 'EA') {
        //   return x(d.state) + (x.bandwidth() - 60) / 2 + 160;
        //  } else {
        //   return x(d.state) + (x.bandwidth() - 60) / 2;
        //  }
      })
      .attr('y', function (d) { return y(d.value) - 30; })
      .attr('class', 'benfit-value')
      .text(function (d) {
        if (d.key === 'eaBenefit' && d.state === 'Enterprise Agreement') {
          if (d.value > 0) {
            let val = thisInstance.numberPipe.transform(d.value);
            return 'EA Benefits' + '  ' + val;
          }
        }
      })
      .call(thisInstance.utilitiesService.wrapAxisText, d3);
  }

  moveRight() {
    if (this.start === this.start_max) {
      return;
    }

    this.start++;
    this.data_new = this.data.slice(this.start, this.show + this.start);

    this.calcData();
    this.createChart();
    this.createLegends();
    return false;
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    this.data_new = this.data.slice(this.start, this.show + this.start);

    this.calcData();
    this.createChart();
    this.createLegends();
    return false;
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
    const div = td.append('div').on('mouseover', function (d) {
      const text = {
        'EP': 'Pricing',
        'OB': 'Operational Efficiencies',
        'GB': 'Growth Benefits',
        'LCB': 'True Forward Benefits',
        'PC': 'Promotional Benefits',
        'eaBenefit': 'EA Benefits'
      };
      thisInstance.legendToolTipDiv.classed('in', true);
      thisInstance.legendToolTipDiv
        .html(`
      <div class="tooltip-arrow icon-arrow-up"></div>
      <div class="tooltip-inner"> ${text[d]} </div>
      `)
        .style('left', (this.getBoundingClientRect().left + window.scrollX) + 'px')
        .style('top', (this.getBoundingClientRect().top + window.scrollY - 30) + 'px');
    })
      .on('mouseout', function (d) {
        thisInstance.legendToolTipDiv.classed('in', false);
      });

    div.append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('width', '8').attr('height', '8')
      .attr('fill', function (d, j) {
        const colors = {
          'EP': '#005073',
          'OB': '#AF564F',
          'GB': '#EEB15C ',
          'LCB': '#64BBE3',
          'PC': '#20c997',
          'eaBenefit': '#CCC'
        };
        return colors[d];
      });

    div.append('text')
      .text(function (d) {
        const text = {
          'EP': 'Pricing',
          'OB': 'Operational Efficiencies',
          'GB': 'Growth Benefits',
          'LCB': 'True Forward Benefits',
          'PC': 'Promotional Benefits',
          'eaBenefit': 'EA Benefits'
        };
        return text[d];
      });

  }

  // updateChart() {
  //   let max = 0;
  //   const max_array = [];
  //   const thisInstance = this;
  //   const y = this.y;

  //   if (this.activeStacked.length) {
  //     this.activeStacked.forEach(function (k) {
  //       max_array.push(d3.max(thisInstance.sF.filter(function (d) {
  //         return d.key === k;
  //       }), function (d) {
  //         return d.value;
  //       }));
  //     });
  //     max_array.forEach(function (e) {
  //       max += e;
  //     });
  //   } else {
  //     max = d3.max(this.sF, function (d) {
  //       return d.total;
  //     });
  //   }

  //   max += max * 0.20;

  //   y.domain([0, max]);

  //   this.chart.selectAll('g.y.axis')
  //     .call(this.yAxis);

  //   const bars = this.chart.selectAll('.bar').data(this.sF);
  //   const end = {};

  //   bars.select('rect.front').transition().duration(this.transitionDuration)
  //     .attr('y', function (d) {
  //       if (thisInstance.activeStacked.length && thisInstance.activeStacked.indexOf(d.key) === -1) {
  //         return 0;
  //       }
  //       if (!end[d.state]) {
  //         end[d.state] = 0;
  //       }
  //       end[d.state] += d.value;
  //       return y(end[d.state]);
  //     })
  //     .attr('height', function (d) {
  //       if (thisInstance.activeStacked.length && thisInstance.activeStacked.indexOf(d.key) === -1) {
  //         return 0;
  //       }
  //       const m = (thisInstance.activeStacked.indexOf(d.key) === 0 || !d.start) ? 0 : 2;
  //       const val = y.range()[0] - y(d.value) - m;
  //       return val > 0 ? val : 0;
  //     })
  //     .attr('fill', (d, i) => this.getColor(d.key));

  //   bars.select('rect.back').transition().duration(this.transitionDuration)
  //     .attr('height', function (d) {
  //       if (thisInstance.activeStacked.length && thisInstance.activeStacked.indexOf(d.key) === -1) {
  //         return 0;
  //       }
  //       return y(end[d.state]);
  //     });

  //   this.table.selectAll('td').attr('class', function (e) {
  //     if (thisInstance.activeStacked.length && thisInstance.activeStacked.indexOf(e) === -1) {
  //       return 'disabled';
  //     }
  //     return '';
  //   });

  // }

}
