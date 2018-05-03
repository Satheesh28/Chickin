import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { AgmCoreModule, MapsAPILoader, AgmMap } from '@agm/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as _ from 'underscore';
import * as moment from 'moment';
declare var jquery: any;
declare var $: any;

@Component({
    selector: module.id,
    templateUrl: './assessmentlist.component.html',
})
export class AssessmentListComponent implements OnInit {
    @ViewChild(AgmMap) public agmMap: AgmMap;
    lat: number = 51.673858;
    lng: number = 7.815982;
    zoom: number;
    domainConfigUrl = this.config.domain1;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: AppConfig,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
    }

    //#region Variables
    viewAssesmentList: any;
    categoryname: string;
    domainid: number;
    Assessmentlist: any;
    QuestionsList: any;
    mapdate: any;
    Work: number = 0;
    Education: number = 0;
    Health: number = 0;
    Relationships: number = 0;
    Community: number = 0;
    Creativity: number = 0;
    Cphotograph: any;
    Date: any;
    Name: any;
    allAssessmentlistItemsDataCount: any;
    searchAssessmentliststring: string = "";
    userAssessmentlistFilter: string = "";
    allAssessmentlistItems: any[];
    pagerAssessmentlist: any = {};
    pagedAssessmentlistItems: any[];
    pageAssessmentlistNumber: any;
    PageAssessmentlistCount: any;
    tabs: any = {};

    //#endregion

    //#region ngOnInit & Token Validation
    ngOnInit() {
        this.refreshData();
        $("#dashboard").removeAttr("class");
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#editprofile').removeAttr("class");

        $('#dashboard').addClass('ng-scope');
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope has-sub ');
        $('#domainassessment').addClass('ng-scope opened has-sub active');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');

        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope ');
        $('#assessmenthistory').removeClass('ng-scope ').addClass('ng-scope active');
        $('#addassessment').removeClass('ng-scope active').addClass('ng-scope ');
        $('#emojilist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#allnotification').removeClass('ng-scope active').addClass('ng-scope ');
        $('#sendnotification').removeClass('ng-scope active').addClass('ng-scope');

        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
        this.tabdata();
        this.setAssessmentlistPage(1);
        this.domainid = 1;
        this.getquestions();

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

    //#region ViewCase
    casedeatilsview(data: any) {

        localStorage.setItem('ViewCaseID', data.case_id);
        this.router.navigate(['/casedetails']);
    }
    //#endregion

    //#region Tab Creation
    tabdata() {
        this.tabs = [{
            name: this.Work == 0 ? 'Work' : 'Work (' + this.Work + ')',
            domain_id: 1,
            cat: 'work'
        }, {
            name: this.Education == 0 ? 'Education' : 'Education (' + this.Education + ')',
            domain_id: 2,
            cat: 'education'
        }, {
            name: this.Health == 0 ? 'Health' : 'Health (' + this.Health + ')',
            domain_id: 3,
            cat: 'health'
        }, {
            name: this.Relationships == 0 ? 'Relationships' : 'Relationships (' + this.Relationships + ')',
            domain_id: 4,
            cat: 'relationships'
        }, {
            name: this.Community == 0 ? 'Community' : 'Community (' + this.Community + ')',
            domain_id: 5,
            cat: 'community'
        }, {
            name: this.Creativity == 0 ? 'Creativity' : 'Creativity (' + this.Creativity + ')',
            domain_id: 6,
            cat: 'creativity'
        }];

    }

    //#endregion
 
    //#region MapView
    ViewMap(domin: any) {
        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        var SplitLanLat = domin.longlat.split(",");
        // this.mapdate=this.convertUTCDateToLocalDate(domin.createdon);
        this.mapdate = domin.createdon;
        this.lat = parseFloat(SplitLanLat[0]);
        this.lng = parseFloat(SplitLanLat[1]);
        this.zoom = 16;
        this.agmMap.triggerResize(true);
    }

    //#endregion

    //#region Get All Questions
    getquestions() {
        this.userservice.getassessmentquestions()
            .subscribe(data => {
                this.QuestionsList = data.listData;

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion

    //#region Question Tab Change
    changeuestiondata(data: string, cat: string, domainid: number) {
        this.categoryname = cat;
        this.domainid = domainid;
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].domain_id == domainid) {
                $('#' + cat).removeClass('uib-tab nav-item ng-scope ng-isolate-scope').addClass('uib-tab nav-item ng-scope ng-isolate-scope active');
            }
            else {
                $('#' + this.tabs[i].cat).removeClass('uib-tab nav-item ng-scope ng-isolate-scope active').addClass('uib-tab nav-item ng-scope ng-isolate-scope');
            }
        }
    }
    //#endregion
 
    //#region View Assessment
    viewAssesment(id: number, domain: any) {
        this.userservice.getquestionassessmentid(id)
            .subscribe(data => {
                this.viewAssesmentList = data.objData;
                var Img = this.domainConfigUrl + "Data/cases/" + domain.case_id + domain.photograph;
                this.Cphotograph = Img;
                var tempdate = new Date(domain.createdon);
                this.Date = tempdate.toISOString();
                this.Name = domain.first_name + " " + domain.last_name;

                this.Work = 0;
                this.Education = 0;
                this.Health = 0;
                this.Relationships = 0;
                this.Community = 0;
                this.Creativity = 0;
                for (var Val in this.viewAssesmentList) {
                    if (this.viewAssesmentList[Val].domain_id == 1) {
                        this.Work = this.Work + 1;

                    }
                    else if (this.viewAssesmentList[Val].domain_id == 2) {
                        this.Education = this.Education + 1;
                    }
                    else if (this.viewAssesmentList[Val].domain_id == 3) {
                        this.Health = this.Health + 1;


                    }
                    else if (this.viewAssesmentList[Val].domain_id == 4) {

                        this.Relationships = this.Relationships + 1;

                    }
                    else if (this.viewAssesmentList[Val].domain_id == 5) {
                        this.Community = this.Community + 1;


                    }
                    else if (this.viewAssesmentList[Val].domain_id == 6) {
                        this.Creativity = this.Creativity + 1

                    }

                }
                this.tabdata();
                this.setAssessmentlistPage(1);

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
 
    //#region Get Assessment List

    searchAssessment(searchstring, pageNumber, PageCount) {
        this.userservice.getassessmenttest(searchstring, this.pageAssessmentlistNumber, this.PageAssessmentlistCount)
            .subscribe(data => {
                this.Assessmentlist = data.listData;
                this.allAssessmentlistItems = this.Assessmentlist;
                this.allAssessmentlistItemsDataCount = data.dataCount;
                for (var i in data.listData) {
                    var TempDateConvertion = this.convertUTCDateToLocalDate(data.listData[i].createdon);
                    data.listData[i].case_date = TempDateConvertion;
                }
                this.allAssessmentlistItems = data.listData;
                this.PageAssessmentlistLoad(this.pageAssessmentlistNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion

    //#region  Set Pagination

    setAssessmentlistPage(page: number) {
        if (page < 1 || page > this.pagerAssessmentlist.totalPages) {
            return;
        }
        this.pageAssessmentlistNumber = page;
        this.PageAssessmentlistCount = 5;
        this.searchAssessment(this.userAssessmentlistFilter, page, this.PageAssessmentlistCount);

    }
    PageAssessmentlistLoad(page: any) {
        $('#work').removeClass('uib-tab nav-item ng-scope ng-isolate-scope').addClass('uib-tab nav-item ng-scope ng-isolate-scope active');
        this.pagerAssessmentlist = this.pagerService.getPager(this.allAssessmentlistItemsDataCount, page, 5);
        this.pagedAssessmentlistItems = this.allAssessmentlistItems.slice(this.pagerAssessmentlist.startIndex, this.pagerAssessmentlist.endIndex + 1);
    }

    //#endregion

    //#region Time Convert
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();

        return localTime;
    }

    //#endregion

}