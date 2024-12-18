import { Directive, ElementRef, Input, OnChanges, OnInit, HostListener, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Directive({
  selector: '[appBullet]'
})
export class BulletDirective implements OnInit, OnChanges {

  @Input() options: any;
  @Input() percentage = 0;
  @Input() colors: any;
  @Input() reverse: boolean;
  // @Input() changeSubject: Subject<any>;

  public width = 160;
  public height = 20;
  public offsetWidth = 20;
  public svg = null;
  public bars = null;
  public local = null;
  public counter = 0;
  public defColors = ['#3E932E', '#60A752', '#8BBD80', '#A7DF9A', '#FA8F79', '#F05C4D', '#C34A3E'];
  public data = ['', '', '', '', '', '', ''];
  public orginalColors = [];

  constructor(private el: ElementRef) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderChart();
  }

  ngOnInit() {
    this.orginalColors = this.colors || this.defColors;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes['percentage'] && changes['percentage'].currentValue === 0){
    //   this.percentage = 1;
    // }
    this.showChange();

  }

  renderChart() {
    const self = this;

    if (this.svg) {
      d3.select(this.el.nativeElement).select('svg').remove();
    }

    this.width = 135;
    this.height = this.options.height || this.height;
    const colorArr = _.cloneDeep(this.orginalColors);
    if (this.reverse) {
      this.colors = colorArr.reverse();
    } else {
      this.colors = colorArr;
    }
    this.offsetWidth = this.width / this.colors.length;
    this.svg = d3.select(this.el.nativeElement)
      .append('svg')
      .attr('width', self.width)
      .attr('height', self.height);

    const opacity = [];
    for (let i = 0; i < this.data.length; i++) {

      if (this.percentage !== undefined) {
        if (this.percentage / 100 * this.data.length <= i) {
          opacity.push(0.5);
        } else {
          opacity.push(1);
        }
      } else {
        opacity.push(0.5);
      }

    }

    this.local = d3.local();
    this.bars = this.svg.selectAll(null)
      .data(this.data)
      .enter()
      .append('g');

    this.bars.append('text')
      .text(String)
      .attr('y', function () {
        self.local.set(this.parentNode, this.getComputedTextLength());
        return 0;
      });

    this.bars.append('rect')
      .attr('class', 'cust-rect-box')
      .style('fill', function (d, i) {
        return self.colors[i];
      })
      .style('border-radius', '5')
      .style('opacity', function (d, i) {
        return opacity[i];
      })
      .attr('x', function () {
        return self.local.get(this.parentNode);
      })
      .attr('y', 0)
      .attr('width', 18)
      .attr('height', self.height)
      .attr('rx', 3);

    this.counter = 0;
    this.bars.each(function (d, i) {
      if (i) {
        d3.select(this).attr('transform', 'translate(' + (self.counter += self.local.get(this.previousSibling) + self.offsetWidth) + ',0)');
      }
    });
    const lineWidth = self.percentage * (self.counter + self.offsetWidth) / 100;
    // console.log(lineWidth);
    const lineY = self.height / 2;
    const strokeWidth = 2;

    this.svg.append('line')
      .attr('class', 'line-hr')
      .attr('x1', strokeWidth)
      .attr('y1', lineY)
      .attr('x2', function () {
        if (lineWidth) {
          return lineWidth;
        }
      })
      .attr('y2', lineY)
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth);

    this.svg.append('line')
      .attr('class', 'line-vr')
      .attr('x1', function () {
        if (lineWidth) {
          return lineWidth;
        }
      })
      .attr('y1', 0)
      .attr('x2', function () {
        if (lineWidth) {
          return lineWidth;
        }
      })
      .attr('y2', lineY * 2)
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth);
  }

  showChange() {
    if (this.svg) {
      let opacity = [];
      for (let i = 0; i < this.colors.length; i++) {
        if (this.percentage !== undefined) {
          if (this.percentage / 100 * this.data.length <= i) {
            opacity.push(0.2);
          } else {
            opacity.push(1);
          }
        } else {
          opacity.push(0.2);
        }
      }

      this.svg.selectAll('.cust-rect-box')
        .style('opacity', function (d, i) {
          return opacity[i];
        });

      const lineWidth = this.percentage * (this.counter + this.offsetWidth) / 100;

      this.svg.select('.line-hr')
        .attr('x2', lineWidth);

      this.svg.select('.line-vr')
        .attr('x1', lineWidth)
        .attr('x2', lineWidth);
    }
  }
}
