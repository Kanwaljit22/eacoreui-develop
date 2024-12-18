import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from "ea/ea-rest.service";
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { forkJoin } from 'rxjs';
import { TcoService } from 'vnext/tco/tco.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';

@Component({
  selector: 'app-tco-bar-chart',
  templateUrl: './tco-bar-chart.component.html',
  styleUrls: ['./tco-bar-chart.component.scss']
})
export class TcoBarChartComponent implements AfterViewInit {
  margin = { top: 20, right: 20, bottom: 50, left: 50 };
  width = 370 - this.margin.left - this.margin.right;
  height = 326 - this.margin.top - this.margin.bottom;

  data1 = [];
  data2 = [];
  subscribers: any = {};
  currentData: any[];
  @Input() isMsea = false;
  private chartInitialized = false;

  constructor(
    private elementRef: ElementRef, 
    public localizationService: LocalizationService, 
    private eaRestService: EaRestService,
    public elementIdConstantsService: ElementIdConstantsService,
    public dataIdConstantsService: DataIdConstantsService,
    public vnextService: VnextService,
    public proposalStoreService: ProposalStoreService,
    public tcoService: TcoService,
    public tcoStoreService: TcoStoreService,
    public utilitiesService: UtilitiesService
  ) {
  }

  ngOnInit() {
    window.addEventListener('resize', this.onResize.bind(this));

    this.fetchGraphData();
    this.subscribers.refreshGraph = this.tcoService.refreshGraph.subscribe(() => {
      this.fetchGraphData();
    });
  }

  onResize() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.subscribers.refreshGraph){
      this.subscribers.refreshGraph.unsubscribe();
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewChecked() {
    if (!this.chartInitialized && this.currentData && this.currentData.length > 0) {
      this.createChart();
      this.chartInitialized = true;
    }

    if (this.currentData && this.currentData.length === 0) {
      this.chartInitialized = false;
    }
  }

  fetchGraphData() { 
    const urlPortfolio = `proposal/tco/graph?t=${this.tcoStoreService.tcoData?.objId}&a=PORTFOLIO`;
    const urlYear = `proposal/tco/graph?t=${this.tcoStoreService.tcoData?.objId}&a=YEAR_ON_YEAR`;

    forkJoin({
      portfolio: this.eaRestService.getApiCall(urlPortfolio),
      year: this.eaRestService.getApiCall(urlYear),
    }).subscribe((responses: any) => {
      if (this.vnextService.isValidResponseWithData(responses.portfolio)) {
        this.data1 = responses.portfolio.data || [];
        this.currentData = responses.portfolio.data || [];
      }
  
      if (this.vnextService.isValidResponseWithData(responses.year)) {
        this.data2 = responses.year.data || [];
      }
  
      if (this.shouldCreateChart()) {
        this.createChart();
      }
    });
  }

  shouldCreateChart(): boolean {
    return Array.isArray(this.currentData) && this.currentData.length > 0;
  }
  

  ngAfterViewInit() {
    if (this.shouldCreateChart()) {
      this.createChart();
    }
  }

  createChart() {
    const chartContainer = d3.select(this.elementRef.nativeElement).select('.chart-container');
    
    if (chartContainer.empty()) {
      return;
    }
  
    const containerWidth = parseFloat(chartContainer.style('width'));

  
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.width = Math.max(200, Math.min(this.width, containerWidth));

    if (!this.currentData || this.currentData.length === 0) {
      d3.select("#chart1").selectAll("*").remove();
      return;
    }
  
    d3.select("#chart1").selectAll("*").remove();
    const svg1 = d3.select(this.elementRef.nativeElement).select("#chart1")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const x0 = d3.scaleBand()
      .domain(this.currentData.map(d => d.label || d.year))
      .range([0, this.width])
      .padding(0.4);

    const x1 = d3.scaleBand()
      .domain(["BAU", "EA"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.currentData, d => Math.max(d.BAU, d.EA)) || 100])
      .nice()
      .range([this.height, 0]);

      svg1.append("g")
      .attr("transform", `translate(0,${this.height + 10})`)
      .call(d3.axisBottom(x0))
      .selectAll(".tick text")
      .each(function (d) {
        const textElement = d3.select(this);
        const originalText = d; // Original tick label
    
        if (/^Year \d+$/.test(originalText)) {
          // For "Year 1", "Year 2", etc., keep it on the same line
          textElement.text(originalText)
            .attr("dy", "1.5em"); // Adjust vertical spacing if needed
        } else {
          // For other labels, apply wrapping
          const words = originalText.split(/\s+/);
          textElement.text(null); // Clear the existing text content
    
          words.forEach((word, index) => {
            textElement.append("tspan")
              .attr("x", 0)
              .attr("dy", index === 0 ? "1.5em" : "1.2em") // Consistent spacing
              .text(word);
          });
        }
      });
    

    svg1.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => this.formatYAxis(d)));

    const tooltip1 = d3.select("#tooltip1");

    svg1.append("g")
    .selectAll("g")
    .data(this.currentData)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d.label || d.year)},0)`)
    .selectAll("rect")
    .data(d => [
      ["BAU", d.BAU],
      ["EA", d.EA]
    ])
    .enter()
    .append("rect")
    .attr("x", d => x1(d[0]))
    .attr("y", this.height)
    .attr("width", x1.bandwidth())
    .attr("height", 0)
    .attr("fill", d => d[0] === "BAU" ? "#1f77b4" : "#66c2a5")
    .on("mouseover", (data) => {
      tooltip1
        .style("opacity", 1)
        .html(`<strong>${data[0]}</strong>: ${this.proposalStoreService.proposalData?.currencyCode || ''} ${this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(data[1]))}`);
    })
    .on("mousemove", function() {
      const [x, y] = d3.mouse(this.closest("svg"));

      tooltip1
        .style("left", `${x - 85}px`)
        .style("top", `${y + 60}px`);
        })
    .on("mouseout", function() {
      tooltip1.style("opacity", 0);
    })
    .transition()
    .duration(800)
    .attr("y", d => y(d[1]))
    .attr("height", d => this.height - y(d[1]));
  }

  showPreviousData() {
    if (this.currentData !== this.data1) {
      this.currentData = this.data1;
      this.chartInitialized = false;
      }
  }

  showNextData() {
    if (this.currentData !== this.data2) {
      this.currentData = this.data2;
      this.chartInitialized = false;
    }
  }


  formatYAxis = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`; // Billions
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`; // Millions
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`; // Thousands
    return value.toFixed(0); // Less than 1,000, no suffix
  };
  
}
