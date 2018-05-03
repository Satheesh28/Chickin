import { Component, ViewChild, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { Observable } from 'rxjs/Observable';
import { AgmCoreModule, AgmMap } from '@agm/core';
import { AppConfig } from '../app.config';
import * as moment from 'moment';
import { elementAt } from 'rxjs/operators/elementAt';

declare var jquery: any;
declare var $: any;

@Component({
    selector: module.id,
    templateUrl: './casedetails.component.html',
})
export class CaseDetailsComponent implements OnInit {
    @ViewChild(AgmMap) public agmMap: AgmMap;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private config: AppConfig,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {

    }

    //#region  Variable Declare
    lat: number = 51.673858;
    lng: number = 7.815982;
    zoom: number;
    domainConfigUrl = this.config.domain1;
    search: string = "";
    alertsList: any = {};
    checkinHistory: any = {};
    Maptitle: string = "";
    EmojiList: any = {};
    RegionList: any = {};
    filterBy: any;
    first_name: string;
    middle_name: string;
    last_name: string;
    logo: string;
    region_id: any;
    regionid: any;
    case_date: any;
    case_number: string;
    case_Condition = new Array();
    identification_num: string;
    access_code: string;
    domainid: number;
    PhoneData: any;
    ConvertList = new Observable();
    Convert = new Array();
    AddressData: any;
    QuestionData: any;
    randomDateArray: any;
    caseCondition: any;
    recurringFrequency: any;
    recurring_startdate: DateTimeFormat;
    recurring_enddate: DateTimeFormat;

    public allItemscheckin: any[];
    pagercheckin: any = {};
    pagedcheckinItems: any[];
    allItemsCheckinDataCount: any;
    pageCheckinNumber: any;
    userCheckinFilter: string = "";
    PageCheckinCount: any;


    public allhelpItems: any[];
    pagerhelp: any = {};
    pagedhelpItems: any[];
    allItemshelpDataCount: any;
    pagehelpNumber: any;
    userhelpFilter: string = "";
    PagehelpCount: any;


   
    case_idListId: any;
    mapPoints = new Array();
    mapdate: any;
    public randomDateArrayEditDummy: any[];
    EmojiViewList: any = {};
    public emotion_type: string = "";
    public longlat: string;
    public comment: string = "";
    public case_id: string;
    public username: string = "";
    public date: string = "";
    tempemoji = new Array();
    tempstore = new Array();
    //#endregion

    //#region  ngOnInit Token Validations

    ngOnInit() {
        this.refreshData();

        let data;

        let ViewCaseid = localStorage.getItem('ViewCaseID');

        if (ViewCaseid != null) {
            this.case_idListId = ViewCaseid;
            this.viewcase(ViewCaseid);
            localStorage.removeItem('ViewCaseID');

        }
        else {
            this.router.navigate(['/officerdashboard']);
        }
        this.setcheckinPage(1);
        this.sethelpPage(1);
        this.logo = "../../assets/img/whitey.jpg";
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

    //#region Get Region
    getregion(id: any) {
        this.userservice.getregionID(id)
            .subscribe(data => {
                this.region_id = data.objData.desc;
            });
    }

    //#endregion

    //#region Date Convertion
    public DateConvertion() {
        this.randomDateArray = new Array();
        for (var i = 0; i < this.randomDateArrayEditDummy.length; i++) {
            var date = this.convertUTCDateToLocalDate(this.randomDateArrayEditDummy[i].duedate);
            this.randomDateArray.push({
                date: date,
                duedate: date,
                time: "",
                edit: false,
                editTime: false,
                invalid: false,
                invalidDate: false
            });

        }
    }
    //#endregion

    //#region Redirect Edit Case
    case(case_id: any) {
        localStorage.setItem('ViewCaseID', case_id);
        this.router.navigate(['/case']);
    }

    //#endregion

    //#region  View Case Date

    viewcase(id: any) {
        this.userservice.getcaseid(id)
            .subscribe(data => {
                var tempdata = data.listData[0];
                this.case_id = tempdata.id;
                this.first_name = tempdata.first_name;
                this.case_number = tempdata.case_number;
                this.last_name = tempdata.last_name;
                this.middle_name = tempdata.middle_name;
                var tempdate = new Date(tempdata.case_date);
                this.case_date = tempdate.toISOString();
                this.AddressData = tempdata.caseAddress;
                this.PhoneData = tempdata.casePhone;
                this.caseCondition = tempdata.caseCondition;
                this.QuestionData = tempdata.caseQuestion;
                var ImgUrl = this.domainConfigUrl + "Data/cases/" + tempdata.id + tempdata.photograph;
                this.logo = ImgUrl;
                this.identification_num = tempdata.identification_num;;
                this.access_code = tempdata.access_code;
                this.recurringFrequency = tempdata.recurring_frequency;
                this.regionid = tempdata.region_id;
                this.recurring_startdate = tempdata.recurring_startdate;
                this.recurring_enddate = tempdata.recurring_enddate;
                this.randomDateArrayEditDummy = tempdata.caseRecurring;
                this.DateConvertion();

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });

    }
    //#endregion

    //#region Checkin map View
    checkinview(checkin: any) {
        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        var SplitLanLat = checkin.longlat.split(",");
        this.Maptitle = "CheckIn";
        this.mapdate = checkin.createdon;
        this.lat = parseFloat(SplitLanLat[0]);
        this.lng = parseFloat(SplitLanLat[1]);
        this.zoom = 16;
        this.agmMap.triggerResize(true);
    }

    ViewMap(checkin: any) {
        this.mapdate = "";
        this.agmMap.ngOnDestroy();
        this.Maptitle = "CheckIn";
        var SplitLanLat = checkin.longlat.split(",");
        this.lat = parseFloat(SplitLanLat[0]);
        this.lng = parseFloat(SplitLanLat[1]);
        this.zoom = 16;
        this.agmMap.triggerResize(true);
    }
    //#endregion

    //#region Emoji Map View
    emojiview(id: number, emj: any, date: string) {
        this.mapdate = "";
        this.userservice.getemojiview(id)
            .subscribe(data => {
                this.EmojiViewList = data.objData;
                this.emotion_type = "- " + this.EmojiViewList.emotion_type + "-";
                this.longlat = this.EmojiViewList.longlat;
                this.comment = this.EmojiViewList.comment;
                this.case_id = this.EmojiViewList.case_id;
                this.username = emj.case_name + "-";
                this.mapdate = this.convertUTCDateToLocalDate(new Date(date));
                this.date = date;
                this.Maptitle = "Emoji's"
                var SplitLanLat = this.longlat.split(",");
                this.agmMap.ngOnDestroy();
                this.lat = parseFloat(SplitLanLat[0]);
                this.lng = parseFloat(SplitLanLat[1]);
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

    //#region  CheckIn History Get
    setcheckinPage(page: number) {
        if (page < 1 || page > this.pagercheckin.totalPages) {
            return;
        }
        this.pageCheckinNumber = page;
        this.PageCheckinCount = 5;
        this.SearchCheckinList(this.userCheckinFilter, page, this.PageCheckinCount);
    }
    SearchCheckinList(userFilter, pageNumber, PageCount) {
        this.userservice.getcheckinbyCaseId(this.case_idListId)
            .subscribe(data => {
                var allItemstemp = data.listData;
                this.allItemscheckin = [];
                for (var i = 0; i < allItemstemp.length; i++) {
                    for (var j = 0; j < allItemstemp[i].length; j++) {
                        this.allItemscheckin.push(allItemstemp[i][j]);
                    }
                };               
                this.allItemsCheckinDataCount = data.dataCount
                this.PageLoadCheckin(this.pageCheckinNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    PageLoadCheckin(page: any) {
        this.pagercheckin = this.pagerService.getPager(this.allItemsCheckinDataCount, page, 5);
        this.pagedcheckinItems = this.allItemscheckin.slice(this.pagercheckin.startIndex, this.pagercheckin.endIndex + 1);
    }

    //#endregion

    //#region  Alert History Get

    sethelpPage(page: number) {

        if (page < 1 || page > this.pagerhelp.totalPages) {
            return;
        }
        this.pagehelpNumber = page;
        this.PagehelpCount = 5;
        this.SearchhelpList(this.userCheckinFilter, page, this.PagehelpCount);

    }
    SearchhelpList(userFilter, pageNumber1, PageCount1) {
        this.userservice.getHelpAlartid(this.case_idListId)
            .subscribe(data => {
                var allItemstemp1 = [];
                this.allhelpItems = [];
                allItemstemp1 = data.listData;

                if (data.dataCount != 0) {
                    this.allItemshelpDataCount = data.dataCount;
                }
                else {
                    this.allItemshelpDataCount = 5;
                }

                for (var i = 0; i < allItemstemp1.length; i++) {
                    for (var j = 0; j < allItemstemp1[i].length; j++) {
                        this.allhelpItems.push(allItemstemp1[i][j]);
                    }
                }


                this.PagehelpLoad(this.pagehelpNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    PagehelpLoad(pagehelp: any) {
        debugger;
        this.pagerhelp = this.pagerService.getPager(this.allItemshelpDataCount, pagehelp, 5);

        this.pagedhelpItems = this.allhelpItems.slice(this.pagerhelp.startIndex, this.pagerhelp.endIndex + 1);
    }

    //#endregion

    //#region  Date Converstion
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();

        return localTime;
    }
    //#endregion
}