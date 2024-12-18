// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnChanges, ViewChild, ElementRef, AfterViewInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges, Renderer2 } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { ColorsService } from '../../services/colors.service';
import { UtilitiesService } from '../../services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ShortNumberPipe } from '@app/shared/pipes/short-number.pipe';
declare var $: any;

@Component({
  selector: 'app-bar-stacked-chart',
  templateUrl: './bar-stacked-chart.component.html',
  styleUrls: ['./bar-stacked-chart.component.scss']
})
export class BarStackedChartComponent implements OnInit, OnChanges, AfterViewInit {
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
  private show = 6;
  private start = 0;
  private start_max = 0;
  private data_new;
  private sF: Array<any>;
  private y: any;
  private table: any;
  tip: any;
  showbardata = false;
  barData: any;
  @Input() state: any;
  @Input() private active: Array<any>;
  public subscribers: any = {};
  pos: any;
  private legendToolTipDiv: any;
  // @Output() onActiveChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private colorsService: ColorsService, private utilitiesService: UtilitiesService, public renderer: Renderer2,
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
    if (changes.data && this.data) {
      this.calcData();
      this.tip = this.createTip();
      this.createChart();
      this.createLegends();
    }
    // if (this.chart) {
    //   this.updateChart();
    // }
  }
  /*ngOnDestroy() {
    this.subscribers.unsubscribe();
  }*/

  getColor(d) {
    return this.colors[d];
  }

  ngAfterViewInit() {
    this.subscribers = this.appDataService.loadGraphDataEmitter.subscribe((graphData: any) => {
      this.data = graphData;
      this.calcData();
      this.tip = this.createTip();
      this.createChart();
      this.createLegends();
    });
  }

  calcData() {

    this.keys = this.utilitiesService.getUniqueKeys(this.data);
    this.colors = this.colorsService.getColors(this.keys);
    this.show = this.show < this.data.length ? this.show : this.data.length;
    this.data_new = this.data.slice(this.start, this.show + this.start);

    const fData = <any>[];
    this.data_new.forEach(function (d) {
      const o = <any>{};
      o.state = d.quarter;
      o.stateId = d.quarterId || d.quarter;
      o.freq = {};
      o.operationalBenfits = {};
      o.growthBenfits = {};
      o.trueForward = {};
      o.promotionCost = {};
      o.eaBenefits = {};
      o.pricingName = '';
      const areas = d.areas;
      areas.forEach(function (e) {
        const b = e.freq;
        o.operationalBenfits = e.operationalEfficiency;
        o.growthBenfits = e.GrowthBenefits;
        o.trueForward = e.trueForwardBenefits;
        o.promotionCost = e.PromotionCost;
        o.eaBenefits = e.eaBenefits;
        o.pricingName = e.pricingName;
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
              o.freq[prop] = val;
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
            operationalBenfits: d.operationalBenfits,
            growthBenfits: d.growthBenfits,
            trueForward: d.trueForward,
            eaBenefits: d.eaBenefits,
            promotionCost: d.promotionCost,
            pricingName: d.pricingName
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
      .attr('fill', function (d) {
        return '#fff';
        // const color = thisInstance.getColor(d.key);
        // if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
        //
        // }
        // return thisInstance.utilitiesService.getDarkColor(color);
      })
      .html(`
          <div class="tooltip-arrow"></div>
          <div class="tooltip-inner"> </div>
          `)
      ;
  }

  bar_mouseout(i, thisInstance) {
    const bars = this.chart.selectAll('.bar').data(this.sF);
    // bars.select('rect.front.front_' + i)
    //   .attr('fill', function (d) {
    //     const color = thisInstance.getColor(d.key);
    //     if (thisInstance.active.length && thisInstance.active.indexOf(d.key) === -1) {
    //       return '#ccc';
    //     }
    //     return color;
    //   });
  }

  createTip() {
    return d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .direction('w')
      .html(d => {
        let content;
        let val = this.numberPipe.transform(d.value);
        if (d.key === 'OB') {
          const opeartionalArr = d.operationalBenfits;
          const operationalTotal = opeartionalArr.operationalEffieciency + opeartionalArr.flexCost +
            opeartionalArr.ngTime + opeartionalArr.svPricing;
          const ngPer = ((opeartionalArr.ngTime / operationalTotal) * 100);
          const oePer = ((opeartionalArr.operationalEffieciency / operationalTotal) * 100);
          const roPer = ((opeartionalArr.flexCost / operationalTotal) * 100);
          const svPer = ((opeartionalArr.svPricing / operationalTotal) * 100);
          const oeClass = (opeartionalArr.operationalEffieciency === 0) ? 'd-none' : '';
          const roClass = (opeartionalArr.flexCost === 0) ? 'd-none' : '';
          const svClass = (opeartionalArr.svPricing === 0) ? 'd-none' : '';
          const ngClass = (opeartionalArr.ngTime === 0) ? 'd-none' : '';
          const operationalEffieciencyName = opeartionalArr.operationalEffieciencyName ? opeartionalArr.operationalEffieciencyName : '';
          const roName = opeartionalArr.flexCostName ? opeartionalArr.flexCostName : '';
          const ngName = opeartionalArr.ngName ? opeartionalArr.ngName : '';
          const svName = opeartionalArr.svName ? opeartionalArr.svName : '';
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>Operational Efficiences</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-oe" style="width: ${oePer}%;"></span><span class="graph-qtr graph-breakpoint-2" style="width: ${roPer}%;"></span><span class="graph-qtr graph-breakpoint-3" style="width: ${ngPer}%;"></span><span class="graph-qtr graph-breakpoint-4" style="width: ${svPer}%;"></span></div>
          <div class="legends-wrap"><div class="legend-item ${oeClass}"><span class="legend-block legend-breakpoint-oe"></span>
          ${operationalEffieciencyName}</div><div class="legend-item ${roClass}"><span class="legend-block legend-breakpoint-2"></span>${roName}</div><div class="legend-item ${ngClass}"><span class="legend-block legend-breakpoint-3"></span> ${ngName}</div><div class="legend-item ${svClass}"><span class="legend-block legend-breakpoint-4"></span>${svName}</div></div></div>`
        } else if (d.key === 'GB') {
          const growthArr = d.growthBenfits;
          const growthTotal = growthArr.growth + growthArr.timeValueMoney + growthArr.alaCarte1yrSku;
          const gbPer = ((growthArr.growth / growthTotal) * 100);
          const tmPer = ((growthArr.timeValueMoney / growthTotal) * 100);
          const ltPer = ((growthArr.alaCarte1yrSku / growthTotal) * 100);
          const growthClass = (growthArr.growth === 0) ? 'd-none' : '';
          const tvmClass = (growthArr.timeValueMoney === 0) ? 'd-none' : '';
          const bauClass = (growthArr.alaCarte1yrSku === 0) ? 'd-none' : '';
          const growthName = growthArr.growthName ? growthArr.growthName : '';
          const timeValueMoneyName = growthArr.timeValueMoneyName ? growthArr.timeValueMoneyName : '';
          const alaCarte1yrSkuName = growthArr.alaCarte1yrSkuName ? growthArr.alaCarte1yrSkuName : '';
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>Growth Benefits</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-gb" style="width:  ${gbPer}%;"></span><span class="graph-qtr graph-breakpoint-2" style="width:  ${tmPer}%;"></span><span class="graph-qtr graph-breakpoint-4" style="width:  ${ltPer}%;"></span></div>
          <div class="legends-wrap"><div class="legend-item ${growthClass}"><span class="legend-block legend-breakpoint-gb"></span>${growthName}</div><div class="legend-item ${tvmClass}"><span class="legend-block legend-breakpoint-2"></span>${timeValueMoneyName}</div><div class="legend-item ${bauClass}"><span class="legend-block legend-breakpoint-4"></span>${alaCarte1yrSkuName}</div></div></div>`
        } else if (d.key === 'LCB') {
          const trueForwrdArr = d.trueForward;
          const trueFwdTotal = trueForwrdArr.trueFroward + trueForwrdArr.rbValue;
          const tfPer = ((trueForwrdArr.trueFroward / trueFwdTotal) * 100);
          const rbPer = ((trueForwrdArr.rbValue / trueFwdTotal) * 100);
          const rbClass = (trueForwrdArr.rbValue === 0) ? 'd-none' : '';
          const tfClass = (trueForwrdArr.trueFroward === 0) ? 'd-none' : '';
          const tfName = trueForwrdArr.trueFrowardName ? trueForwrdArr.trueFrowardName : '';
          const rbName = trueForwrdArr.rampCostName ? trueForwrdArr.rampCostName : '';
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>True Forward Benefits</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-tf" style="width:  ${tfPer}%;"></span><span class="graph-qtr graph-breakpoint-2" style="width:  ${rbPer}%;"></span></div>
          <div class="legends-wrap"><div class="legend-item ${tfClass}"><span class="legend-block legend-breakpoint-tf"></span>${tfName}</div><div class="legend-item ${rbClass}"><span class="legend-block legend-breakpoint-2"></span>${rbName}</div></div></div>`
        } else if (d.key === 'EP') {
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>${d.pricingName}</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-p" style="width: 100%;"></span></div>
          <div class="legends-wrap"><div class="legend-item"><span class="legend-block legend-breakpoint-p"></span>${d.pricingName}</div></div>`
        } else if (d.key === 'PC') {
          const promoCostArr = d.promotionCost;
          const promoCostTotal = promoCostArr.ramp + ((this.appDataService.archName === 'C1_DC') ? (promoCostArr.dcnFreeAppliance) : (promoCostArr.dnac)) + promoCostArr.starterKit;
          const rmpPer = ((promoCostArr.ramp / promoCostTotal) * 100);
          const dnacper = (this.appDataService.archName === 'C1_DC') ? ((promoCostArr.dcnFreeAppliance / promoCostTotal) * 100): ((promoCostArr.dnac / promoCostTotal) * 100);
          const skitPer = ((promoCostArr.starterKit / promoCostTotal) * 100);
          const rampClass = (promoCostArr.ramp === 0) ? 'd-none' : '';
          const dnacClass = (this.appDataService.archName === 'C1_DC') ? ((promoCostArr.dcnFreeAppliance === 0) ? 'd-none' : '') : ((promoCostArr.dnac === 0) ? 'd-none' : '');
          const skitClass = (promoCostArr.starterKit === 0) ? 'd-none' : '';
          const rampName = promoCostArr.rampName ? promoCostArr.rampName : '';
          const DnacName = (this.appDataService.archName === 'C1_DC') ? (promoCostArr.dcnFreeApplianceName ? promoCostArr.dcnFreeApplianceName : '') : (promoCostArr.dnacName ? promoCostArr.dnacName : '');
          const starterKitName = promoCostArr.starterKitName ? promoCostArr.starterKitName : '';
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>Promotional Benefits</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-pc" style="width:  ${rmpPer}%;"></span><span class="graph-qtr graph-breakpoint-2" style="width:  ${dnacper}%;"></span><span class="graph-qtr graph-breakpoint-4" style="width:  ${skitPer}%;"></span></div>
          <div class="legends-wrap"><div class="legend-item ${rampClass}"><span class="legend-block legend-breakpoint-pc"></span>${rampName}</div><div class="legend-item ${dnacClass}"><span class="legend-block legend-breakpoint-2"></span>${DnacName}</div><div class="legend-item ${skitClass}"><span class="legend-block legend-breakpoint-4"></span>${starterKitName}</div></div></div>`
        } else {
          const benefitArr = d.eaBenefits;
          const benefitTotal = benefitArr.eaPricing + benefitArr.benefit;
          const eapricePer = ((benefitArr.eaPricing / benefitTotal) * 100);
          const benefitPer = ((benefitArr.benefit / benefitTotal) * 100);
          const eaClass = (benefitArr.eaPricing === 0) ? 'd-none' : '';
          const ebClass = (benefitArr.benefit === 0) ? 'd-none' : '';
          content = `<div class="graph-tooltip"><div class="graph-tt-title"><h4>${val}</h4><h6>EA Benefits</h6></div><div class="progress-graph"><span class="graph-qtr graph-breakpoint-EAB" style="width:  100%;"></span></div>
          <div class="legends-wrap"><div class="legend-item ${ebClass}"><span class="legend-block legend-breakpoint-EAB"></span>EA Benefits</div></div></div>`
        }
        return content;
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

    this.chart.call(thisInstance.tip);
    this.legendToolTipDiv = d3.select('body').append('div')
      .attr('class', 'tooltip top');

    const x = d3.scaleBand().rangeRound([0, this.width])
      .padding(0.1)
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

    this.y = d3.scaleLinear().range([this.height, 0]);

    const y = this.y;

    const max = d3.max(this.sF, function (d) {
      return d.end;
    });

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
        let val = thisInstance.numberPipe.transform(d);
        //  let val = d3.format(',.2s')(d);
        //  val = (val.replace('G', 'M'));
        return val;
      })
      .ticks(6)
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
    const total = {};

    bars.append('rect')
      .attr('class', function (d, i) {
        return 'front front_' + i;
      })
      .attr('x', function (d) {
        return x(d.state) + (x.bandwidth() - 60) / 2 - 30;
      })
      .attr('y', function (d) {
        if (!end[d.state]) {
          end[d.state] = 0;
        }
        end[d.state] += d.value;
        return y(end[d.state]);
      })
      .attr('width', 150)
      .attr('height', function (d) {
        const m = !d.start ? 0 : 1;
        const val = y.range()[0] - y(d.value) - m;
        return val > 0 ? val : 0;
      })
      .attr('fill', function (d, j) {
        const colors = {
          'EP': '#005073',
          'OB': '#AF564F',
          'GB': '#EEB15C ',
          'LCB': '#64BBE3',
          'PC': '#20c997',
          'eaBenefit': '#ccc'
        };
        return colors[d.key];
      })
      .on('mouseover', function (d) {
        if (thisInstance.state !== 'Review-Finalize') {
          // if (d.key === 'EP') {
          //   thisInstance.tip.hide(d, this);
          // } else {
          thisInstance.tip.show(d, this);
          // }
        }
      })
      .on('mouseout', function (d) {
        if (thisInstance.state !== 'Review-Finalize') {
          thisInstance.tip.hide(d, this);
        }
      });

    bars.append('text')
      .attr('x', function (d) {
        return x(d.state) + (x.bandwidth() - 60) / 2;
      })
      .attr('y', function (d) {
        const val = y.range()[0] - y(d.value);
        return y(d.end) - 20;
      })
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

    bars.append('line')
      .attr('x', function (d) {
        thisInstance.pos = x(d.state) + (x.bandwidth() - 60) / 2;
        return x(d.state) + (x.bandwidth() - 60) / 2;
      })
      .attr('transform', 'translate(' + (thisInstance.pos - 29) + ' ,' + 0 + ')')
      .attr('y1', function (d) { if (d.key === 'eaBenefit' && d.state === 'Enterprise Agreement' && d.value > 0) { return y(d.end); } })
      .attr('y2', function (d) { if (d.key === 'eaBenefit' && d.state === 'Enterprise Agreement' && d.value > 0) { return y(d.end); } })
      .attr("x2", function (d) { if (d.key === 'eaBenefit' && d.state === 'Enterprise Agreement' && d.value > 0) { return 150; } })
      .style("stroke", "#2ecc71")
      .style("stroke-dasharray", "4,4");

    // // bars.append('rect').attr('class', 'back')
    //   .attr('x', function (d) {
    //     if (d.state === 'Enterprise Agreement')
    //     return x(d.state) + (x.bandwidth() - 20)/ 2;
    //   })
    //   .attr('y', function (d) {
    //     if (d.state === 'Enterprise Agreement')
    //     return 0;
    //   })
    //   .attr('width', 100)
    //   .attr('height', function (d) {
    //     console.log(end);
    //     if (d.state === 'Enterprise Agreement')
    //     return y(end['Business-as-usual'] - end['Enterprise Agreement']);
    //   })
    //   .attr('fill', function (d) {
    //     if (d.state === 'Enterprise Agreement')
    //     return '#EDEEF1';
    //   });

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
    const div = td.append('div')
      .on('mouseover', function (d) {
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
    // .on('click', function (d) {
    //   thisInstance.toggleSelection(d, thisInstance);
    // });

    div.append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('width', '8').attr('height', '8')
      .attr('fill', (d, i) => {
        const colors = {
          'EP': '#005073',
          'OB': '#AF564F',
          'GB': '#EEB15C ',
          'LCB': '#64BBE3',
          'PC': '#20c997',
          'eaBenefit': '#ccc'
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
