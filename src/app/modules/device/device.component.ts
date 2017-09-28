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

  // Run once
  ranOnce: boolean = false;

  //
  isLoading: boolean = true;
  isSetpointLoading: boolean = false;
  interval: any;

  // Variables to unsubscribe
  setForcecontrolSub: any;

  //
  parentId: any;
  childId: any;

  //
  device: any;

  temp: number = 26.5;
  temp2: number;
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
    this.isSetpointLoading = false;
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
    this.refreshDevice(this.init.bind(this));
    this.interval = setInterval(() => {
      if (this.lastChartUpdate) this.lastChartUpdate.unsubscribe();
      this.autoUpdateCharts();
    }, 5000);
  }

  init() {
    this.switchToHistory();
    this.updateCharts();
    this.setUpEditPopup();
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    clearInterval(this.interval);
  }

  refreshDevice(onComplete?: any) {
    this.route.parent.params.subscribe((parentParams) => {
      this.route.params.subscribe((childParams) => {
        this.deviceService.getDevice(parentParams.id, childParams.id).subscribe((res) => {
          this.parentId = parentParams.id;
          this.childId = childParams.id;
          this.device = JSON5.parse(res._body).body;
          this.setUpMode();
          this.cdRef.detectChanges();
          if (this.device.setpoint && this.device.setpoint != "NaN") this.temp = parseFloat(this.device.setpoint);
          this.isLoading = false;
          this.isSetpointLoading = false;
          if (onComplete) setTimeout(() => onComplete());
        }, (err) => {
          console.log(err);
          this.isLoading = false;
          this.isSetpointLoading = false;
        });
      });
    });
  }

  setUpMode() {
    $(".switch-icon").css("opacity", 0);
    setTimeout(() => {
      if (this.device && this.device.mode) {
        switch (this.device.mode.toUpperCase()) {
          case "NOOPERATION":
            $(".switch-icon.a").css("opacity", 1);
            break;
          case "SETPOINT":
            $(".switch-icon.b").css("opacity", 1);
            break;
          case "SCHEDULE":
            $(".switch-icon.c").css("opacity", 1);
            break;
          case "OFF":
            $(".switch-icon.d").css("opacity", 1);
            break;
          default:
            $(".switch-icon.a").css("opacity", 1);
            break;
        }
      }
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
      let minIndex = 0;
      let currentUnix = moment(this.currentDate).unix();
      let endUnix = currentUnix + 86399;
      if (timeArr[0].timestamp < currentUnix || timeArr[timeArr.length - 1].timestamp > endUnix) {
        $(".chart-empty").css("display", "flex");
        $(".chart-loading").hide();
        $("chart").css("opacity", 0);
        this.currentTemp = timeArr[0].temperature;
        this.currentHumidity = timeArr[0].humidity;
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
          minIndex = i + 1;
          break;
        }
      }
      let interval = (timeArr[minIndex].timestamp - timeArr[maxIndex].timestamp) / 20.0;
      let lastTimestamp = 0;
      for (let i = maxIndex; i >= minIndex; i--) {
        if (timeArr[i].timestamp - lastTimestamp < interval) continue;
        lastTimestamp = timeArr[i].timestamp;
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
      console.log("updated chart");
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
    this.temp2 = this.temp - 0.5;
    this.setPoint();
  }

  increaseTemp() {
    this.temp2 = this.temp + 0.5;
    this.setPoint();
  }

  setUpSwitch() {
    $(".switch-icon").unbind();
    $(".switch-icon").click((event) => {
      $(".switch-icon").css("opacity", 0);
      $(event.target).css("opacity", 1);
      let img = $(event.target);
      let data = {};
      if (img.hasClass("a")) data = { mode: "NOOPERATION" };
      else if (img.hasClass("b")) data = { mode: "SETPOINT" };
      else if (img.hasClass("c")) data = { mode: "SCHEDULE" };
      else if (img.hasClass("d")) data = { mode: "OFF" };
      this.deviceService.setMode(this.childId, data).subscribe((res) => {
        this.refreshDevice();
      });
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
    this.isSetpointLoading = true;
    let data = {
      "setpoint": this.temp2.toFixed(1)
    }
    this.deviceService.setPoint(this.childId, data).subscribe((res) => {
      this.refreshDevice();
    }, (err) => {
      console.log(err);
      this.isSetpointLoading = false;
    });
  }

  setForcecontrol(event) {
    let data = {
      "forcecontrol": event
    }
    if (this.setForcecontrolSub) this.setForcecontrolSub.unsubscribe();
    this.setForcecontrolSub = this.deviceService.setForcecontrol(this.childId, data).subscribe((res) => {
      this.refreshDevice();
    }, (err) => {
      console.log(err);
    });
  }

  /** Edit popup */
  setUpEditPopup() {
    $(document).mouseup(function (e) {
      var container = $(".edit-popup, .action-button-icon");
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".edit-popup").hide();
      }
    });
  }

  toggleEditPopup(event) {
    let display = $(event.target).next().css("display");
    $(".edit-popup").hide();
    if (display == "none") {
      $(event.target).next().show();
      $(event.target).next().focus();
    }
  }

  closeEditPopup(event) {
    $(event.target).parent().hide();
  }
}
