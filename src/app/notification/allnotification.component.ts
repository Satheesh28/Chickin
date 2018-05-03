import { Component, OnInit, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as _ from 'underscore';
import { AppConfig } from '../app.config';
import * as moment from 'moment';
declare var jquery: any;
declare var $: any;
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
    selector: module.id,
    templateUrl: './allnotification.component.html',
})
export class AllNotificationComponent implements OnInit {
    constructor(private router: Router,
        private userservice: UserService,
        private config: AppConfig,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService,
        private http: Http, @Inject(DOCUMENT) private document: any, ) {
    }
    //#region Variable Declare
    returnUrl: string;
    NotificationList: any = {};
    allnotificationItems: any[];
    pagernotification: any = {};
    pagednotificationItems: any[];
    allnotificationItemsDataCount: any;
    pagenotificationNumber: any;
    search: string = "";
    domainConfigUrl = this.config.domain1;
    usernotificationFilter: "";
    PagenotificationCount: any;
//#endregion
    //#region ngOnInit & Toknen validation
    ngOnInit() {
        this.refreshData();
        $('#dashboard').removeAttr("class");
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#editprofile').removeAttr("class");

        $('#dashboard').addClass('ng-scope');
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope has-sub ');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope opened has-sub active');
        $('#domainassessment').addClass('ng-scope has-sub');

        $('#caselist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope ');
        $('#assessmenthistory').removeClass('ng-scope active').addClass('ng-scope');
        $('#addassessment').removeClass('ng-scope active').addClass('ng-scope ');
        $('#emojilist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#allnotification').removeClass('ng-scope').addClass('ng-scope active');
        $('#sendnotification').removeClass('ng-scope active').addClass('ng-scope');

        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
        this.setnotificationPage(1);
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
    //#region Redirect CaseDetails Page
    casedeatilsview(data: any) {

        localStorage.setItem('ViewCaseID', data.case_id);
        this.router.navigate(['/casedetails']);
    }
    //#endregion
    //#region  Get Notification List
    SearchnotificationList(userFilter, pageNumber, PageCount) {
        let Sear = userFilter == undefined ? "" : userFilter;
        this.userservice.getnotifications(Sear, this.pagenotificationNumber, this.PagenotificationCount)
            .subscribe(data => {
                this.NotificationList = data.listData;

                this.allnotificationItemsDataCount = data.dataCount

                for (var i in data.listData) {
                    var TempDateConvertion = this.convertUTCDateToLocalDate(data.listData[i].createdon);
                    data.listData[i].createdon = TempDateConvertion;
                }
                this.allnotificationItems = data.listData;
                this.PagenotificationLoad(this.pagenotificationNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    setnotificationPage(page: number) {
        if (page < 1 || page > this.pagernotification.totalPages) {
            return;
        }
        this.pagenotificationNumber = page;
        this.PagenotificationCount = 5;
        this.SearchnotificationList(this.usernotificationFilter, page, this.PagenotificationCount);

    }
    PagenotificationLoad(page: any) {

        this.pagernotification = this.pagerService.getPager(this.allnotificationItemsDataCount, page, 5);
        this.pagednotificationItems = this.allnotificationItems.slice(this.pagernotification.startIndex, this.pagernotification.endIndex + 1);
    }
    //#endregion
    //#region Convert Date
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();

        return localTime;
    }

    //#endregion
}