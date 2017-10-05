import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DeviceService } from '../../services/device.service';
import { DevicesService } from '../../services/devices.service';
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
  isAddScheduleLoading: boolean = false;
  isDeletingDevice: boolean = false;
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

  // Schedule
  startHour: number = 12;
  startMinute: number = 0;
  startPeriod: string = "AM";
  endHour: number = 12;
  endMinute: number = 0;
  endPeriod: string = "AM";
  allWeekSwitch: boolean = false;
  weekday: string = "THU";
  scheduleTemp: number = 26.5;

  // Gantt chart
  scheduleDay: string = "THU";
  daysOfWeek = [
    "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
  ]
  hoursOfDay = [
    "0 AM", "1 AM", "2 AM", "3 AM",
    "4 AM", "5 AM", "6 AM", "7 AM",
    "8 AM", "9 AM", "10 AM", "11 AM",
    "12 AM", "1 PM", "2 PM", "3 PM",
    "4 PM", "5 PM", "6 PM", "7 PM",
    "8 PM", "9 PM", "10 PM", "11 PM"
  ]
  json = {
    "schedule": {
      "mon": [],
      "tue": [],
      "wed": [],
      "thu": [],
      "fri": [],
      "sat": [],
      "sun": [],
    }
  }

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private devicesService: DevicesService,
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
    this.setUpChildAndParentId();
    this.title.setTitle("Device details");
    this.interval = setInterval(() => {
      if (this.lastChartUpdate) this.lastChartUpdate.unsubscribe();
      this.autoUpdateCharts();
      this.autoUpdateCurrentTemp();
    }, 5 * 60 * 1000);
    this.ranOnce = true;
  }

  setUpChildAndParentId() {
    this.route.parent.parent.params.subscribe(parentParams => {
      this.parentId = parentParams.id;
      this.route.params.subscribe(childParams => {
        this.childId = childParams.id;
        this.isLoading = true;
        this.refreshDevice(this.init.bind(this));
      });
    });
  }

  init() {
    this.switchToHistory();
    this.updateChartsAndCurrentTemp();
    this.setUpEditPopup();
    this.isLoading = false;
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    clearInterval(this.interval);
  }

  refreshDevice(onComplete?: any) {
    this.deviceService.getDevice(this.parentId, this.childId).subscribe((res) => {
      this.device = JSON5.parse(res._body).body;
      this.setUpMode();
      // this.cdRef.detectChanges();
      if (this.device.setpoint && this.device.setpoint != "NaN") this.temp = parseFloat(this.device.setpoint);
      this.isSetpointLoading = false;
      this.isAddScheduleLoading = false;
      $("#add-schedule-modal").modal("hide");
      this.setUpGanttChart();
      if (onComplete) setTimeout(() => onComplete());
      else this.isLoading = false;
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.isSetpointLoading = false;
      this.isAddScheduleLoading = false;
    });
  }

  removeDevice() {
    this.isDeletingDevice = true;
    this.deviceService.deleteDevice(this.parentId, this.childId).subscribe((res) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    }, (err) => {
      this.isDeletingDevice = false;
      console.log(err);
    })
    this.closeEditPopup(event);
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

  updateChartsAndCurrentTemp() {
    $(".chart-loading").css("display", "flex");
    $(".chart-empty").hide();
    $("chart").css("opacity", 0);
    this.autoUpdateCharts();
    this.autoUpdateCurrentTemp();
  }

  autoUpdateCharts() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let currentDate = new Date(this.currentDate.getTime() - tzoffset).toISOString().split('T')[0];
    this.lastChartUpdate = this.deviceService.getDeviceDatalog(this.childId, currentDate).subscribe(res => {
      let tempData = [];
      let humidityData = [];
      let timeArr = JSON5.parse(res._body).body;
      let currentUnix = moment(this.currentDate).unix();
      let endUnix = currentUnix + 86399;
      // Invalid response or No data in range
      if (!timeArr || !timeArr.length || timeArr[0].timestamp < currentUnix || timeArr[timeArr.length - 1].timestamp > endUnix) {
        $(".chart-empty").css("display", "flex");
        $(".chart-loading").hide();
        $("chart").css("opacity", 0);
        return;
      }
      let maxIndex = timeArr.length - 1;
      let minIndex = 0;
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
      this.tempChart.series[0].setData(tempData, true);
      this.humidityChart.series[0].setData(humidityData, true);
    }, err => {
      $(".chart-empty").css("display", "flex");
      $(".chart-loading").hide();
      $("chart").css("opacity", 0);
    });
  }

  autoUpdateCurrentTemp() {
    this.devicesService.getCurrentDeviceDatalog(this.childId).subscribe(res => {
      let timeArr = JSON5.parse(res._body).body;
      if (!timeArr || !timeArr[0]) return;
      this.currentTemp = timeArr[0].temperature;
      this.currentHumidity = timeArr[0].humidity;
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
    this.updateChartsAndCurrentTemp();
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
    if (this.ranOnce) return;
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
  // Add schedul modal

  openAddScheduleModal() {
    $("#add-schedule-modal").modal("show");
  }

  closeAddScheduleModal() {
    $("#add-schedule-modal").modal("hide");
  }

  plusStartHour() {
    this.startHour = ++this.startHour % 13;
  }

  minusStartHour() {
    this.startHour = --this.startHour % 13;
    if (this.startHour === -1) this.startHour = 12;
  }

  plusStartMinute() {
    this.startMinute = ++this.startMinute % 60;
  }

  minusStartMinute() {
    this.startMinute = --this.startMinute % 60;
    if (this.startMinute === -1) this.startMinute = 59;
  }

  toggleStartPeriod() {
    if (this.startPeriod === "AM") this.startPeriod = "PM";
    else this.startPeriod = "AM";
  }

  plusEndHour() {
    this.endHour = ++this.endHour % 13;
  }

  minusEndHour() {
    this.endHour = --this.endHour % 13;
    if (this.endHour === -1) this.endHour = 12;
  }

  plusEndMinute() {
    this.endMinute = ++this.endMinute % 60;
  }

  minusEndMinute() {
    this.endMinute = --this.endMinute % 60;
    if (this.endMinute === -1) this.endMinute = 59;
  }

  toggleEndPeriod() {
    if (this.endPeriod === "AM") this.endPeriod = "PM";
    else this.endPeriod = "AM";
  }

  setScheduleDay(day: string) {
    this.scheduleDay = day;
  }

  decreaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp - 0.5;
  }

  increaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp + 0.5;
  }

  setSchedule() {
    this.isAddScheduleLoading = true;
    let data = JSON.parse(JSON.stringify(this.json));
    if (this.allWeekSwitch) {
      for (let day of this.daysOfWeek) {
        let newDay = data.schedule[day.toLowerCase()];
        newDay.push({
          start: (this.startPeriod == "AM" ? this.startHour : +this.startHour + 12) + ":" + ("0" + this.startMinute).slice(-2),
          end: (this.endPeriod == "AM" ? this.endHour : +this.endHour + 12) + ":" + ("0" + this.endMinute).slice(-2),
          temperature: this.scheduleTemp.toFixed(2)
        })
      }
    } else {
      let newDay = data.schedule[this.scheduleDay.toLowerCase()];
      newDay.push({
        start: (this.startPeriod == "AM" ? this.startHour : +this.startHour + 12) + ":" + ("0" + this.startMinute).slice(-2),
        end: (this.endPeriod == "AM" ? this.endHour : +this.endHour + 12) + ":" + ("0" + this.endMinute).slice(-2),
        temperature: this.scheduleTemp.toFixed(2)
      })
    }
    this.deviceService.setSchedule(this.childId, data).subscribe(() => {
      this.refreshDevice();
    }, err => {
      console.log(err);
      this.isAddScheduleLoading = false;
    });
  }

  // End add schedule modal

  /** Gantt chart */

  setUpGanttChart() {
    this.clearGanttChart();
    let schedule = this.device.schedule;
    let row = null;
    let col = null;
    for (let day in schedule) {
      if (schedule.hasOwnProperty(day)) {
        switch (day.toUpperCase()) {
          case "MON":
            row = 2;
            break;
          case "TUE":
            row = 3;
            break;
          case "WED":
            row = 4;
            break;
          case "THU":
            row = 5;
            break;
          case "FRI":
            row = 6;
            break;
          case "SAT":
            row = 7;
            break;
          case "SUN":
            row = 8;
            break;
        }
      }
      if (schedule[day]) {
        for (let i = 0; i < schedule[day].length; i++) {
          let current = schedule[day][i];
          let start = +current.start.split(":")[0] + 1;
          let end = +current.end.split(":")[0] - 1;
          let cells = $(".schedule-table tr:nth-child(" + row + ") > td:nth-child(n + " + start + "):nth-last-child(n + " + (24 - end) + ") > .hour-cell");
          cells.addClass("active");
          cells.eq(0).find(".target").html("TARGET: " + current.temperature + "°");
          cells.eq(0).find(".time").html(current.start + " - " + current.end);
        }
      }
    }
  }

  clearGanttChart() {
    $(".schedule-table .hour-cell").removeClass("active");
    $(".schedule-table .target, .schedule-table .time").html("");
  }

  //
}
