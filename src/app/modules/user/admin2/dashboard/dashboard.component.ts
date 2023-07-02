import { Component, OnInit ,ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexYAxis,ApexLegend,
  ApexTooltip,ApexMarkers,
  ApexForecastDataPoints,
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
};
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};
// type ApexXAxis = {
//   type?: "category" | "datetime" | "numeric";
//   categories?: any;
//   labels?: {
//     style?: {
//       colors?: string | string[];
//       fontSize?: string;
//     };
//   };
// };
export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
export type ChartOptions4 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  colors: string[];
  fill: ApexFill;
  forecastDataPoints: ApexForecastDataPoints;
  legend: ApexLegend;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tab: boolean = true;
  tab1: boolean = false;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  tab5_1: boolean = false;
  tab5_2: boolean = false;
  @ViewChild("chart")
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptions1: Partial<ChartOptions1> | any;
  public chartOptions2: Partial<ChartOptions2> | any;
  public chartOptions3: Partial<ChartOptions3> | any;
  public chartOptions4: Partial<ChartOptions4> | any;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [35, 59, 30, 69, 49, 0, 8, 81, 148]
        }
      ],
      chart: {
        height: 260,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Process Vs Runs",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "S1",
          "S2",
          "S3",
          "S4",
          "S5",
          "S6",
          "S7",
          "S8",
          "S9"
        ]
      }
    };
    this.chartOptions1 = {
      series: [
        {
          data: [5, 4, 3]
        }
      ],
      chart: {
        type: "bar",
        height: 260
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function (val: string, opt: { w: { globals: { labels: { [x: string]: string; }; }; }; dataPointIndex: string | number; }) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [
          "Completed",
          "Pending",
          "Failed"
        ]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Projects",
        align: "left",
        floating: true
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
        align: "center"
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return "";
            }
          }
        }
      }
    };
    this.chartOptions2 = {
      series: [
        {
          data: [
            {
              x: "Solutions,65",
              y: 65
            },
            {
              x: "Custom Data Workspace,43",
              y: 43
            },
            {
              x: "Solution Board",
              y: 34
            },
            {
              x: "Extend Workspace",
              y: 23
            }

          ]
        }
      ],
      legend: {
        show: false
      },
      chart: {
        height: 260,
        type: "treemap"
      },
      title: {
        text: "Subscriptions",
        align: "left"
      },
      colors: [
        "#3B93A5",
        "#F7B844",
        "#ADD8C7",
        "#EC3C65",
        "#CDD7B6",
        "#C1F666",
        "#D43F97",
        "#1E5D8C",
        "#421243",
        "#7F94B0",
        "#EF6537",
        "#C0ADDB"
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    };
    this.chartOptions3 = {
      series: [
        {
          name: "distibuted",
          data: [21, 22, 10, 28, 16, 21, 13, 30]
        }
      ],
      chart: {
        height: 260,
        type: "bar",
        events: {
          click: function (chart: any, w: any, e: any) {
            // console.log(chart, w, e)
          }
        }
      },
      title: {
        text: "Process Vs Sob'ns",
        align: "left"
      },
      colors: [
        "#008FFB",
        // "#00E396",
        // "#FEB019",
        // "#FF4560",
        // "#775DD0",
        // "#546E7A",
        // "#26a69a",
        // "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [
          ["s1"],
          ["s2"],
          ["s3"],
          ["s4"],
          ["s5"],
          ["s6"],
          ["s7"],
          ["s8"]
        ],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptions4 = {
      series: [
        {
          type: "rangeArea",
          name: "Users",
          data: [
            {
              x: "25-9-2022",
              y: [55, 45]
            },
            {
              x: "26-9-2022",
              y: [45, 59]
            },
            {
              x: "27-9-2022",
              y: [59, 36]
            },
            {
              x: "28-9-2022",
              y: [36, 42]
            },
            {
              x: "29-9-2022",
              y: [52, 25]
            }
          ]

        },

        {
          type: "rangeArea",
          name: "Leads",
          data: [
            {
              x: "25-9-2022",
              y: [15, 32]
            },
            {
              x: "26-9-2022",
              y: [25, 20]
            },
            {
              x: "27-9-2022",
              y: [20, 45]
            },
            {
              x: "28-9-2022",
              y: [25, 19]
            },
            {
              x: "29-9-2022",
              y: [19, 35]
            }
          ]
        },

        {
          type: "line",
          name: "Leads",
          data: [
            {
              x: "25-9-2022",
              y: 55
            },
            {
              x: "25-9-2022",
              y: 45
            },
            {
              x: "25-9-2022",
              y: 59
            },
            {
              x: "25-9-2022",
              y: 36
            },
            {
              x: "25-9-2022",
              y: 42
            }
          ]
        },
        {
          type: "line",
          name: "Users",
          data: [
            {
              x: "25-9-2022",
              y: 25
            },
            {
              x: "26-9-2022",
              y: 20
            },
            {
              x: "27-9-2022",
              y: 45
            },
            {
              x: "28-9-2022",
              y: 19
            },
            {
              x: "29-9-2022",
              y: 35
            }
          ]
        }
      ],
      chart: {
        height: 260,
        type: "rangeArea",
        animations: {
          speed: 500
        }
      },
      colors: ["#d4526e", "#33b2df", "#d4526e", "#33b2df"],
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: [0.24, 0.24, 1, 1]
      },
      forecastDataPoints: {
        count: 2,
        dashArray: 4
      },
      stroke: {
        curve: "straight",
        width: [0, 0, 2, 2]
      },
      legend: {
        show: true,
        customLegendItems: ["Leads", "Users"],
        inverseOrder: true
      },
      title: {
        text: "Users Vs Leads",
        align: "left"
      },
      markers: {
        hover: {
          sizeOffset: 5
        }
      }
    };
  }

  ngOnInit(): void {
  }
  changetab(id: any) {
    if (id == 1) {
      this.tab = false;
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 2) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 3) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 4) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 5) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = true;
      this.tab5_2 = false;
    }
    else if (id == 6) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = true;
    }
  }
}
