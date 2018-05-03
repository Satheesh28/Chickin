import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { notification } from '../notification/notification';
import { AgmCoreModule, MapsAPILoader, AgmMap } from '@agm/core';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppConfig } from '../app.config';
import * as moment from 'moment';
declare var jquery: any;
declare var $: any;
@Component({
    moduleId: module.id,
    templateUrl: 'officerdashboard.component.html'
})

export class OfficerDashboardComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private config: AppConfig,
        private alertService: AlertService, private pagerService: PagerService) {
    }
    //#region Variable Declare
    @ViewChild(AgmMap) public agmMap: AgmMap;
    lat: number = 51.673858;
    lng: number = 7.815982;
    zoom: number;
    isTrue: Boolean = false;
    HomeCaseOverview: any[];
    HomeMetricsOverview: any[];
    HelpAlertList: any;
    CheckinList: any;
    public HomeDomainOverview: any[];
    public MetricsOverviewnamelist: any[];
    public MetricsOverviewName: any;
    HomeCheckinAlerts: any[];
    HomeCheckinAlertss = new Array();
    domainConfigUrl = this.config.domain1;
    CaseOverviewTotal: number = 0;
    CheckInAlertsRed: number = 0;
    DomainWork: number;
    DomainEducation: number;
    DomainCreativity: number;
    DomainRelationships: number;
    DomainCommunity: number;
    DomainHealth: number;
    Checkincount: number;
    MessageSenderName: string;
    DomainOverviewName: any;
    helpalertCount: string;
    Totalcheck: number;
    Totalcheck1: number;
    Totalassignment: number;
    Totalassignment1: number;
    Totalemoji: number;
    Totalemoji1: number;
    Totalhelp: number;
    Totalhelp1: number;
    //#endregion

   
    //#region ngOnInit&Token Verification
    ngOnInit() {
        this.refreshData();
        $('#dashboard').addClass('ng-scope active');
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#editprofile').removeAttr("class");
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope has-sub');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');
        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope');
        $('#assessmenthistory').removeClass('ng-scope active').addClass('ng-scope');
        $('#addassessment').removeClass('ng-scope active').addClass('ng-scope ');
        $('#emojilist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#allnotification').removeClass('ng-scope active').addClass('ng-scope ');
        $('#sendnotification').removeClass('ng-scope active').addClass('ng-scope');
        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
        this.gethelp();
        this.getcheckin();
        this.getHomeCaseOverview();
        this.getHomeMetricsOverview();
        this.getHomeDomainOverview();
        this.getHomeCheckinAlerts();
        this.MetricsOverviewname();
        this.AllDomainCount();
        this.DomainWork = 0;
        this.DomainEducation = 0;
        this.DomainCreativity = 0;
        this.DomainRelationships = 0;
        this.DomainCommunity = 0;
        this.DomainHealth = 0;

        this.Totalcheck = 0;
        this.Totalcheck1 = 0;
        this.Totalassignment = 0;
        this.Totalassignment1 = 0;
        this.Totalemoji = 0;
        this.Totalemoji1 = 0;
        this.Totalhelp = 0;
        this.Totalhelp1 = 0;
    }

    refreshData() {
        var Authorization = JSON.parse(localStorage.getItem('Authorization'));
        var id = JSON.parse(localStorage.getItem('id'));
        if (Authorization != null && id != null) {
        } else {
            this.router.navigate(['/login']);
        }
    }

    //#endregion

    //#region  Get All List

    gethelp() {
        this.userservice.getallhelp()
            .subscribe(data => {
                this.HelpAlertList = [];
            
                for (var j = 0; j < data.listData.length; j++) {
                    var dateSplit = data.listData[j];
                    var TempDateConvertion = this.convertUTCDateToLocalDate(dateSplit.createdon);
                    dateSplit.createdon = TempDateConvertion;
                    this.HelpAlertList.push(dateSplit);
                }
                this.helpalertCount = this.HelpAlertList.length;

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    getcheckin() {
        this.userservice.getcheckin(null, 1, 10)
            .subscribe(data => {
                this.CheckinList = data.listData;
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    getHomeCaseOverview() {
        this.userservice.GetCaseOverviewList()
            .subscribe(data => {
                this.HomeCaseOverview = data.listData;
                this.CaseOverviewTotal = this.HomeCaseOverview.length;
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    getHomeMetricsOverview() {
        this.HomeMetricsOverview = [];
        this.userservice.GetMetricsOverviewList()
            .subscribe(data => {
                this.HomeMetricsOverview = data.listData;

                for (var i in this.HomeMetricsOverview) // for acts as a foreach  
                {
                    this.Totalcheck += this.HomeMetricsOverview[i].ttlMissedCheckins;
                    this.Totalcheck1 += this.HomeMetricsOverview[i].ttlMissedCheckins_last;
                    this.Totalassignment += this.HomeMetricsOverview[i].ttlAssessments;
                    this.Totalassignment1 += this.HomeMetricsOverview[i].ttlAssessments_last;
                    this.Totalemoji += this.HomeMetricsOverview[i].ttlEmojiCheckins;
                    this.Totalemoji1 += this.HomeMetricsOverview[i].ttlEmojiCheckins_last;
                    this.Totalhelp += this.HomeMetricsOverview[i].ttlHelpAlerts;
                    this.Totalhelp1 += this.HomeMetricsOverview[i].ttlHelpAlerts_last;

                }
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    getHomeDomainOverview() {
        this.userservice.GetDomainOverviewList()
            .subscribe(data => {
                this.HomeDomainOverview = data.listData;
            });
    }
    getHomeCheckinAlerts() {
        this.userservice.GetCheckinAlertsList()
            .subscribe(data => {
                this.HomeCheckinAlerts = data.listData;
                this.Checkincount = this.HomeCheckinAlerts.length;
                this.CheckInAlertsRed = 0;
                for (var i in this.HomeCheckinAlerts) // for acts as a foreach  
                {
                    var timeleft = this.HomeCheckinAlerts[i].time_left;
                    var timeleft1 = timeleft.replace('-', '');
                    var Days = Math.floor(timeleft1 / 3600);
                    var Hours = Math.floor((timeleft1 - (Days * 3600)) / 60);
                    var Mints = timeleft1 - (Days * 3600) - (Hours * 60);
                    var result = Days + "d:" + Hours + "h:" + Mints + "m";
                    var TempDateConvertion = this.convertUTCDateToLocalDate(this.HomeCheckinAlerts[i].due_date);
                    this.HomeCheckinAlerts[i].due_date = TempDateConvertion;
                    this.HomeCheckinAlerts[i].time_left = result;
                    this.HomeCheckinAlertss.push(this.HomeCheckinAlerts[i]);
                    if (this.HomeCheckinAlerts[i].status == "Red") {
                        this.CheckInAlertsRed += 1;
                    }
                }


            });
    }

    AllDomainCount() {
        this.userservice.GetDomainOverviewList()
            .subscribe(data => {
                this.HomeDomainOverview = data.listData;
                for (var i in this.HomeDomainOverview) {
                    this.DomainWork += this.HomeDomainOverview[i].work;
                    this.DomainEducation += this.HomeDomainOverview[i].education;
                    this.DomainCreativity += this.HomeDomainOverview[i].creativity;
                    this.DomainRelationships += this.HomeDomainOverview[i].relationships;
                    this.DomainCommunity += this.HomeDomainOverview[i].community;
                    this.DomainHealth += this.HomeDomainOverview[i].health;
                }
            });

    }
    MetricsOverviewname() {
        this.userservice.getcase("", 1, 100)
            .subscribe(data => {
                this.MetricsOverviewnamelist = data.listData;
            });
    }


    //#endregion

    //#region Delete Help Alert Audio
    deleteid(id: number) {
        localStorage.setItem('deleteid', JSON.stringify(id));
    }
    deleteHelpAlert() {
        var id = JSON.parse(localStorage.getItem('deleteid'));
        this.userservice.deletealert(id)
            .subscribe(data => {
                $('#SendMessage').modal('hide');
                this.alertService.success(data.status, true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);

                this.gethelp();
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion

    //#region Get Based on ID
    ChangeDomain(data: any) {
        if (data == "string:0") {
            this.DomainWork = 0;
            this.DomainEducation = 0;
            this.DomainCreativity = 0;
            this.DomainRelationships = 0;
            this.DomainCommunity = 0;
            this.DomainHealth = 0;
            for (var i in this.HomeDomainOverview) {
                this.DomainWork += this.HomeDomainOverview[i].work;
                this.DomainEducation += this.HomeDomainOverview[i].education;
                this.DomainCreativity += this.HomeDomainOverview[i].creativity;
                this.DomainRelationships += this.HomeDomainOverview[i].relationships;
                this.DomainCommunity += this.HomeDomainOverview[i].community;
                this.DomainHealth += this.HomeDomainOverview[i].health;
            }

        }
        else {
            for (var i in this.HomeDomainOverview) {
                if (data == this.HomeDomainOverview[i].case_id) {
                    this.DomainWork = this.HomeDomainOverview[i].work;
                    this.DomainEducation = this.HomeDomainOverview[i].education;
                    this.DomainCreativity = this.HomeDomainOverview[i].creativity;
                    this.DomainRelationships = this.HomeDomainOverview[i].relationships;
                    this.DomainCommunity = this.HomeDomainOverview[i].community;
                    this.DomainHealth = this.HomeDomainOverview[i].health;
                }

            }
        }

    }


    ChangeMetrics(ChangeMetricsid: any) {
        if (ChangeMetricsid == 0) {
            this.getHomeMetricsOverview();
        }
        else {
            this.userservice.getMetricscaseId(ChangeMetricsid)
                .subscribe(data => {
                    this.HomeMetricsOverview = data.listData;
                    for (var i in this.HomeMetricsOverview) {
                        this.Totalcheck = this.HomeMetricsOverview[i].ttlMissedCheckins;
                        this.Totalcheck1 = this.HomeMetricsOverview[i].ttlMissedCheckins_last;
                        this.Totalassignment = this.HomeMetricsOverview[i].ttlAssessments;
                        this.Totalassignment1 = this.HomeMetricsOverview[i].ttlAssessments_last;
                        this.Totalemoji = this.HomeMetricsOverview[i].ttlEmojiCheckins;
                        this.Totalemoji1 = this.HomeMetricsOverview[i].ttlEmojiCheckins_last;
                        this.Totalhelp = this.HomeMetricsOverview[i].ttlHelpAlerts;
                        this.Totalhelp1 = this.HomeMetricsOverview[i].ttlHelpAlerts_last;

                    }
                });

        }


    }
    //#endregion

    //#region POST Notification
    SendMessageOpen(data: any) {
        localStorage.setItem('sendnotificationcaseid', JSON.stringify(data.case_id));
        this.MessageSenderName = data.first_name + " " + data.last_name;
    }
    public sendmessage: string;
    notification = new notification();
    SendNotification() {
        this.notification.type = 'Web';
        this.notification.desc = this.sendmessage;
        this.notification.case_id_list = [
            {
                "case_id": JSON.parse(localStorage.getItem('sendnotificationcaseid')),

            }
        ],
            this.userservice.postnotifications(this.notification).subscribe(data => {
                this.alertService.success(data.status, true);
                $('#SendMessage').modal('hide');
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion

    viewprofile(CaseId: any) {
        localStorage.setItem('ViewCaseID', CaseId);
        this.router.navigate(['/casedetails']);
    }

    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));
        //local time
        var localTime = moment.utc(ConverDate).toDate();
        return localTime;
    }


    CaseRedirect(Caseid: any) {
        ;
        localStorage.setItem('ViewCaseID', Caseid.case_id);
        this.router.navigate(['/casedetails']);
    }
    mapdate: any;
    ViewMap(domin: any) {
        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        var SplitLanLat = domin.longlat.split(",");
        this.lat = parseFloat(SplitLanLat[0]);
        this.lng = parseFloat(SplitLanLat[1]);
        this.mapdate = this.convertUTCDateToLocalDate(domin.date);
        this.zoom = 16;
        this.agmMap.triggerResize(true);


    }

}
