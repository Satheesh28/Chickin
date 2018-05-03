import { Component, ViewChild, ElementRef, OnInit, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { AgmCoreModule, AgmMap } from '@agm/core';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { AppConfig } from '../app.config';
import * as moment from 'moment';
import { reduce } from 'rxjs/operators/reduce';
declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    templateUrl: 'checkinlist.component.html'
})

export class CheckinListComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private config: AppConfig,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {

    }
    //#region Variable Declare
    @ViewChild(AgmMap) public agmMap: AgmMap;
    domainConfigUrl = this.config.domain1;
    private returnUrl: string;
    CheckinList: any = {};
    allcheckinlistItems: any[];
    pagercheckinlist: any = {};
    pagedcheckinlistItems: any[];
    usercheckinlistFilter: string = "";
    pagecheckinlistNumber: any;
    allcheckinlistItemsDataCount: any;
    PagecheckinlistCount: any;
    CfirstName: any;
    ClastName: any;
    CdueDate: any;
    Clocation: any;
    CcreatedOn: any;
    CmodefiedBy: any;
    ClastLogin: any;
    Capproved: any;
    Cphotograph: any;
    Cnotes: any;
    id: any;
    mapdate: any;
    lat: number = 51.673858;
    lng: number = 7.815982;
    zoom: number;
    //#endregion

    //#region ngOnInit & Token Validation

    ngOnInit() {
        this.refreshData();
        this.setcheckinlistPage(1);
        $('#dashboard').addClass('ng-scope');
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope opened has-sub active');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');
        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope').addClass('ng-scope active');
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope ');
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

    //#region  View Checkin Popup
    ViewCheckin(checkin: any) {
        var ImgUrl = this.domainConfigUrl + "Data/cases/" + checkin.caseid + checkin.photo;
        this.CfirstName = checkin.first_name;
        this.ClastName = checkin.last_name;
        this.Cphotograph = ImgUrl;
        this.CdueDate = this.convertUTCDateToLocalDate(checkin.createdon);
        this.Clocation = checkin.longlat;
        this.CcreatedOn = this.convertUTCDateToLocalDate(checkin.createdon);
        this.CmodefiedBy = this.CfirstName + " " + this.ClastName;
        this.Cnotes = checkin.comment != null ? checkin.comment : "No notes available";
    }
    //#endregion

    //#region Checkin Map

    ViewMap(checkin: any) {
        debugger;
        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        var SplitLanLat = checkin.longlat.split(",");
        this.mapdate = checkin.createdon;
        this.lat = parseFloat(SplitLanLat[0]);
        this.lng = parseFloat(SplitLanLat[1]);
        this.zoom = 16;
        this.agmMap.triggerResize(true);

    }
    //#endregion

    //#region Get Checkin List
    searchcheckin(userFilter, pageNumber, PageCount) {
        this.userservice.getcheckin(this.usercheckinlistFilter, this.pagecheckinlistNumber, this.PagecheckinlistCount)
            .subscribe(data => {

                this.CheckinList = data.listData;
                for (var i in data.listData) {
                    var TempDateConvertion = this.convertUTCDateToLocalDate(data.listData[i].createdon);
                    data.listData[i].createdon = TempDateConvertion;
                }


                this.allcheckinlistItems = data.listData;
                this.allcheckinlistItemsDataCount = data.dataCount
                this.PagecheckinlistLoad(this.pagecheckinlistNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    setcheckinlistPage(page: number) {
        if (page < 1 || page > this.pagercheckinlist.totalPages) {
            return;
        }
        this.pagecheckinlistNumber = page;
        this.PagecheckinlistCount = 5;
        this.searchcheckin(this.usercheckinlistFilter, page, this.PagecheckinlistCount);

    }
    PagecheckinlistLoad(page: any) {
        this.pagercheckinlist = this.pagerService.getPager(this.allcheckinlistItemsDataCount, page, 5);
        this.pagedcheckinlistItems = this.allcheckinlistItems.slice(this.pagercheckinlist.startIndex, this.pagercheckinlist.endIndex + 1);
    }
    //#endregion

    //#region Redirect Checkin View Page

    checkinview(data: any) {
        localStorage.setItem('ViewCheckin', JSON.stringify(data));
        this.router.navigate(['/checkin']);
    }
    //#endregion

    //#region Date Convertion
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();

        return localTime;
    }
    //#endregion
}


