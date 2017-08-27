import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DeviceService } from '../../services/device.service';
import { MdDatepicker } from '@angular/material'
import * as moment from 'moment';

//Jquery
declare var $: any;
// JSON5
var JSON5 = require('json5');

@Component({
  selector: 'device-component',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})

export class DeviceComponent implements OnInit {
  @ViewChild(MdDatepicker)
  private mdDatepicker;

  isLoading: boolean = true;

  //
  parentId: any;
  childId: any;

  //
  device: any;

  temp: number = 26.5;
  schedules: any[] = [
    { from: "6:00", to: "19:20", target: "29" },
    { from: "6:00", to: "19:20", target: "29" }
  ]

  // History tab
  currentDatePlus3: number;
  currentDatePlus2: number;
  currentDatePlus1: number;
  currentDateMinus3: number;
  currentDateMinus2: number;
  currentDateMinus1: number;
  currentDate: Date;
  currentMonthYear: string;

  // Chart
  tempOptions: any;
  tempChart: any;
  humidityOptions: any;
  humidityChart: any;
  lastChartUpdate;
  currentTemp: number;
  currentHumidity: number;

  // Override settings
  overrideEnable: boolean = false;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private cdRef: ChangeDetectorRef
  ) {
    this.isLoading = true;
    this.currentDate = moment().toDate();
    this.currentDate.setHours(0, 0, 0, 0);
    this.currentDateMinus1 = moment(this.currentDate).subtract(1, 'days').date();
    this.currentDateMinus2 = moment(this.currentDate).subtract(2, 'days').date();
    this.currentDateMinus3 = moment(this.currentDate).subtract(3, 'days').date();
    this.currentDatePlus1 = moment(this.currentDate).add(1, 'days').date();
    this.currentDatePlus2 = moment(this.currentDate).add(2, 'days').date();
    this.currentDatePlus3 = moment(this.currentDate).add(3, 'days').date();
    this.currentMonthYear = moment(this.currentDate).format('MMMM YYYY');
    // Chart
    // FONT SIZE
    var ww = $('body').width();
    var maxW = 2560;
    ww = Math.min(ww, maxW);
    var fw = ww * (10 / maxW);
    var fpc = fw * 100 / 16;
    var fpc = Math.round(fpc * 100) / 100;
    var fpc = fpc * 2;
    //
    this.tempOptions = {
      title: { text: '' },
      chart: {
        height: fpc * 3.2,
        width: fpc * 6,
        type: 'line'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: "Temperature",
        color: "#f37f7d",
        data: []
      }]
    };
    this.humidityOptions = {
      title: { text: '' },
      chart: {
        height: fpc * 3.2,
        width: fpc * 6,
        type: 'line'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: "Humidity",
        color: "#19b9c0",
        data: []
      }]
    };
  }


  ngOnInit() {
    this.title.setTitle("Device details");
    this.refreshDevice();
    this.switchToHistory();
    this.updateCharts();
    setInterval(() => {
      if (this.lastChartUpdate) this.lastChartUpdate.unsubscribe();
      this.autoUpdateCharts();
    }, 10000);
  }

  refreshDevice() {
    this.route.parent.params.subscribe((parentParams) => {
      this.route.params.subscribe((childParams) => {
        this.deviceService.getDevice(parentParams.id, childParams.id).subscribe((res) => {
          this.parentId = parentParams.id;
          this.childId = childParams.id;
          this.device = JSON5.parse(res._body).body;
          console.log(this.device);
          this.cdRef.detectChanges();
          if (this.device.setpoint && this.device.setpoint != "NaN") this.temp = this.device.setpoint;
          this.isLoading = false;
        }, (err) => {
          console.log(err);
          this.isLoading = false;
        });
      });
    });
  }

  updateCharts() {
    $(".chart-loading").css("display", "flex");
    $(".chart-empty").hide();
    $("chart").css("opacity", 0);
    this.autoUpdateCharts();
  }

  autoUpdateCharts() {
    this.lastChartUpdate = this.deviceService.getDeviceDatalog("1CED0000B1AC0000CAFE000000C405AC").subscribe((res) => {
      let tempData = [];
      let humidityData = [];
      let timeArr = JSON5.parse(res._body).body;
      let maxIndex = -1;
      let currentUnix = moment(this.currentDate).unix();
      let endUnix = currentUnix + 86399;
      if (timeArr[0].timestamp < currentUnix || timeArr[timeArr.length - 1].timestamp > endUnix) {
        $(".chart-empty").css("display", "flex");
        $(".chart-loading").hide();
        $("chart").css("opacity", 0);
        return;
      }
      for (let i = timeArr.length - 1; i >= 0; i--) {
        if (timeArr[i].timestamp >= currentUnix) {
          maxIndex = i;
          break;
        }
      }
      for (let i = maxIndex; i >= 0; i--) {
        if (timeArr[i].timestamp > endUnix) {
          break;
        }
        tempData.push([timeArr[i].timestamp * 1000 + moment().utcOffset() * 60000, timeArr[i].temperature]);
        humidityData.push([timeArr[i].timestamp * 1000 + moment().utcOffset() * 60000, timeArr[i].humidity]);
      }
      if (tempData.length > 0 || humidityData.length > 0) {
        $(".chart-empty").hide();
        $("chart").css("opacity", 1);
      }
      $(".chart-loading").hide();
      this.currentTemp = timeArr[0].temperature;
      this.currentHumidity = timeArr[0].humidity;
      this.tempChart.series[0].setData(tempData, true);
      this.humidityChart.series[0].setData(humidityData, true);
    });
  }

  saveTempInstance(chartInstance) {
    this.tempChart = chartInstance;
  }

  saveHumidityInstance(chartInstance) {
    this.humidityChart = chartInstance;
  }

  updateMonthYear() {
    if (this.lastChartUpdate) this.lastChartUpdate.unsubscribe();
    this.updateCharts();
    this.currentMonthYear = moment(this.currentDate).format('MMMM YYYY');
    this.currentDateMinus1 = moment(this.currentDate).subtract(1, 'days').date();
    this.currentDateMinus2 = moment(this.currentDate).subtract(2, 'days').date();
    this.currentDateMinus3 = moment(this.currentDate).subtract(3, 'days').date();
    this.currentDatePlus1 = moment(this.currentDate).add(1, 'days').date();
    this.currentDatePlus2 = moment(this.currentDate).add(2, 'days').date();
    this.currentDatePlus3 = moment(this.currentDate).add(3, 'days').date();
  }

  openDatepicker() {
    this.mdDatepicker.open();
  }

  decreaseTemp() {
    this.temp = this.temp - 0.5;
    this.setPoint();
  }

  increaseTemp() {
    this.temp = this.temp + 0.5;
    this.setPoint();
  }

  setUpSwitch() {
    $(".switch-icon").click((event) => {
      console.log(event);
      $(".switch-icon").css("opacity", 0);
      $(event.target).css("opacity", 1);
      let img = $(event.value);
      // if (img.hasClass("a")) this.device.serivce
    });
  }

  switchToHistory() {
    $(".history-tab").addClass("active");
    $(".history-content").css("display", "flex");
    $(".settings-tab").removeClass("active");
    $(".settings-content").hide();
  }

  switchToSettings() {
    this.setUpSwitch();
    $(".settings-tab").addClass("active");
    $(".settings-content").show();
    $(".history-tab").removeClass("active");
    $(".history-content").hide();
  }

  backToDevices() {
    this.router.navigate(["tabs/devices"]);
  }

  setPoint() {
    let data = {
      "setpoint": this.temp.toFixed(1)
    }
    this.deviceService.setPoint(this.childId, data).subscribe((res) => {
      console.log(res);
      this.refreshDevice();
    });
  }

  setForcecontrol(event) {
    let data = {
      "forcecontrol": event
    }
    this.deviceService.setForcecontrol(this.childId, data).subscribe((res) => {
      this.refreshDevice();
    });
  }
}
