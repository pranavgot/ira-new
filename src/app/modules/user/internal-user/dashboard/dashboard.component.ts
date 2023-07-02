import { Component, OnInit, ViewChild } from '@angular/core';
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
  ApexYAxis, ApexLegend,
  ApexTooltip, ApexMarkers,
  ApexForecastDataPoints, ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { ChartOptions1 } from '../../admin1/dashboard/dashboard.component';
export type ChartOptions = {
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
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
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
  subsData: any;
  id = "F81B7026-7D64-4C62-A6F1-BBA60EBBBA18"
  projectData: any;
  processData: any;
  cards: any;


  constructor(
    private Master: MastersService,
  ) {
    this.chartOptions = {
      series: [1, 1, 1, 5],
      chart: {
        width: "100%",
        type: "pie",
        height: 260
      },
      labels: ["Solution Board", "Extendended Workspace", "Custom Data Workspace", "Solutions"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "200"
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
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
          name: "Runs",
          data: [3, 5, 9]
        },
        {
          name: "Subscriptions",
          data: [1, 1, 1]
        }
      ],
      chart: {
        height: 260,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#feb019", "#77B6EA"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Process Vs Subscriptions Vs Runs",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: ["Payments", "Travel & Expense Controller", "Payroll"],
        // title: {
        //   text: "Month"
        // }
      },
      yaxis: {
        title: {
          text: "Runs"
        },
        min: 0,
        max: 10
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }
  chart1: any;
  chart2: any;
  chart3: any;

  ngOnInit(): void {
    this.subscriptionDashboard(),
      this.projectDashboard(),
      this.processVsRuncountDashboard(),
      this.DashBoardCardsbuyuserid()
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

  subscriptionDashboard() {
    // let data = this.id;
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.subscriptionDashboard(data.userId).subscribe((res: any) => {
      console.log("n", res);
      this.subsData = res.responseData;
      this.intializeChart1();

    })
  }

  projectDashboard() {
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.projectDashboard(data.userId).subscribe((res: any) => {
      console.log("nn", res);
      this.projectData = res.responseData;
      this.intializeChart3();
    })
  }

  processVsRuncountDashboard() {
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.processVsRuncountDashboard(data.userId).subscribe((res: any) => {
      console.log("nnn", res);
      this.processData = res.responseData;
      this.intializeChart2();
    })
  }

  DashBoardCardsbuyuserid() {
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.DashBoardCardsbuyuserid(data.userId).subscribe((res: any) => {
      this.cards = res.responseData;
      console.log("cards", this.cards);
    })
  }

  intializeChart1() {
    // this.chart1= {};
    console.log(this.subsData?.subscriptionDTO?.map((sd: any) => sd.subscriptionTypeCount))


    this.chart1 = {
      series: this.subsData?.subscriptionDTO?.map((sd: any) => sd.subscriptionTypeCount),
      chart: {
        width: "100%",
        type: "pie",
        height: 260
      },
      labels: this.subsData?.subscriptionDTO?.map((sd: any) => sd.subscriptionType),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "200"
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]

    }
  }

  intializeChart2() {
    console.log(this.processData?.map((sd: any) => sd.subscriptionTypeCount));

    this.chart2 = {

      series: [
        {
          name: "Runs",
          data: this.processData?.map((sd: any) => sd.runCount),

        },
        {
          name: "Subscriptions",
          data: this.processData?.map((sd: any) => sd.subscriptionCount),

        }
      ],
      chart: {
        height: 280,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 25,
          left: 10,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#feb019", "#77B6EA"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Process Vs Subscriptions Vs Runs",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        // categories: ["Payments", "Travel & Expense Controller","Payroll"]
        categories: this.processData?.map((sd: any) => sd.processName),

        // title: {
        //   text: "Month"
        // }
      },
      yaxis: {
        title: {
          text: "Runs"
        },
        min: 0,
        max: 10
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }
  intializeChart3() {

    this.chart3 = {
      series: [
        {
          data: this.projectData?.map((sd: any) => sd.statusCount)
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
          this.projectData?.map((sd: any) => sd.statusName)
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
  }


}

