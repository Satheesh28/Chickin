
import { Component, HostListener, OnInit, ViewChild, ElementRef, Pipe, Inject, NgZone, AfterViewInit, NgModule, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AgmCoreModule, AgmMap } from '@agm/core';
import { Router } from "@angular/router";
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';
declare var jquery: any;
declare var $: any;
@Component({
    selector: module.id,
    templateUrl: './emojilist.component.html',
})
export class EmojiListComponent implements OnInit {
    
    constructor(private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService,
        private http: Http, @Inject(DOCUMENT) private document: any, ) {
    }


    //#region  Variable Declare
    @ViewChild(AgmMap) public agmMap: AgmMap;
    private returnUrl: string;
    EmojiList: any = {};
    private allItems: any[];
    pageremoji: any = {};
    pagedemojiItems: any[];
    allemojiItemsDataCount: any;
    pageemojiNumber: any;
    search: string = "";
    useremojiFilter: string = "";
    PageemojiCount: any;
    mapdate: any;
    tempemoji = new Array();
    tempstore = new Array();
    EmojiViewList: any = {};
    public emotion_type: string;
    public longlat: string;
    public comment: string;
    public case_id: string;
    public username: string;
    public date: string;
    lat: number = 51.673858;
    lng: number = 7.815982;
    zoom: number;
    //#endregion

    //#region ngOnInit & Token Validation

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
        $('#emojis').addClass('ng-scope opened has-sub active');
        $('#notification').addClass('ng-scope has-sub ');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#caselist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope ');
        $('#assessmenthistory').removeClass('ng-scope active').addClass('ng-scope');
        $('#addassessment').removeClass('ng-scope active').addClass('ng-scope ');
        $('#emojilist').removeClass('ng-scope').addClass('ng-scope active');
        $('#allnotification').removeClass('ng-scope active').addClass('ng-scope ');
        $('#sendnotification').removeClass('ng-scope active').addClass('ng-scope');
        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
        this.setemojiPage(1);
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

    //#region  Get Emoji List
    SearchemojiList(search, pageNumber, PageCount) {

        this.userservice.getemojisummary(search, this.pageemojiNumber, this.PageemojiCount)
            .subscribe(data => {

                this.EmojiList = data.listData;

                this.allemojiItemsDataCount = data.dataCount;

                this.tempemoji = new Array();
                this.PageemojiLoad(this.pageemojiNumber);

                for (var i = 0; i < this.EmojiList.length; i++) {
                    this.tempemoji = [];
                    for (var j = 0; j < this.EmojiList[i].list.length; j++) {
                        ;
                        var EmojidateSplit = JSON.parse(this.EmojiList[i].list[j]);
                        var TempDateConvertion = this.convertUTCDateToLocalDate(EmojidateSplit.date);
                        EmojidateSplit.date = TempDateConvertion;

                        this.tempemoji.push(EmojidateSplit);
                    }


                    var emojicount = this.tempemoji.length;
                    for (var m = 9; m >= emojicount; emojicount++) {

                        this.tempemoji.push({ "id": '0', "type": 'yes', "date": 'yes' });
                    }
                    this.EmojiList[i].list = this.tempemoji;

                }


            });
    }

    setemojiPage(page: number) {

        if (page < 1 || page > this.pageremoji.totalPages) {
            return;
        }
        this.pageemojiNumber = page;
        this.PageemojiCount = 5;
        this.SearchemojiList(this.useremojiFilter, page, this.PageemojiCount);

    }
    PageemojiLoad(page: any) {
        this.pageremoji = this.pagerService.getPager(this.allemojiItemsDataCount, page, 5);
        this.pagedemojiItems = this.EmojiList.slice(this.pageremoji.startIndex, this.pageremoji.endIndex + 1);
    }

    //#endregion

    //#region Emoji Map View

    emojiview(id: number, emj: any, date: string) {
        this.username = "";
        this.date = "";
        this.comment = "";
        this.emotion_type = "";

        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        this.userservice.getemojiview(id)
            .subscribe(data => {
                this.EmojiViewList = data.objData;
                this.emotion_type = "- " + this.EmojiViewList.emotion_type + "- ";
                this.longlat = this.EmojiViewList.longlat;
                this.comment = this.EmojiViewList.comment;
                this.case_id = this.EmojiViewList.case_id;
                this.username = emj.case_name + "- ";
                this.date = date;
                this.mapdate = date;

                if (this.longlat != null) {
                    var SplitLanLat = this.longlat.split(",");
                    this.lat = parseFloat(SplitLanLat[0]);
                    this.lng = parseFloat(SplitLanLat[1]);
                }
                else {
                    this.lat = 0;
                    this.lng = 0;
                }
                this.zoom = 16;
                this.agmMap.triggerResize(true);

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion
    //#region Covert Date
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();

        return localTime;
    }
    //#endregion

    //#region Redirect Case casedetails
    emojicaseview(id: string) {
        localStorage.setItem('ViewCaseID', id);
        this.router.navigate(['/casedetails']);
    }
    //#endregion


}