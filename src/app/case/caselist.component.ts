import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { AppConfig } from '../app.config';
import * as moment from 'moment';
declare var jquery: any;
declare var $: any;

@Component({
    selector: module.id,
    templateUrl: './caselist.component.html',
})
export class CaseListComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: AppConfig,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
    }
    //#region  Variable Declare
    CaseList1: any = {};
    CaseList: any[];
    allcaselistItems: any[];
    allcaselistItemsDataCount: any;
    pagercaselist: any = {};
    pagedcaselistItems: any[];
    pagecaselistNumber: any;
    domainConfigUrl = this.config.domain1;
    PagecaselistCount: any;
    searchcaseliststring: string = "";
    usercaselistFilter: string = "";
    //#endregion
    //#region ngOnInit & Token Validations 
    ngOnInit() {
        this.refreshData();
        this.setcaselistPage(1);
        $("#dashboard").removeAttr("class");
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#editprofile').removeAttr("class");
        $('#dashboard').addClass('ng-scope');
        $('#casemanagement').addClass('ng-scope opened has-sub active');
        $('#checkinmanagement').addClass('ng-scope has-sub ');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');
        $('#caselist').removeClass('ng-scope').addClass('ng-scope active');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope ');
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
    //#region Get Case List 

    searchCase(searchstring, pageNumber, PageCount) {
        this.userservice.getcase(this.usercaselistFilter, this.pagecaselistNumber, this.PagecaselistCount)
            .subscribe(data => {
                this.CaseList = data.listData;
                this.allcaselistItems = [];
                for (var i in data.listData) {
                    var TempDateConvertion = this.convertUTCDateToLocalDate(data.listData[i].createdon);
                    data.listData[i].createdon = TempDateConvertion;
                }
                this.allcaselistItems = data.listData;
                this.allcaselistItemsDataCount = data.dataCount
                this.PagecaselistLoad(this.pagecaselistNumber);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    setcaselistPage(page: number) {
        if (page < 1 || page > this.pagercaselist.totalPages) {
            return;
        }
        this.pagecaselistNumber = page;
        this.PagecaselistCount = 5;
        this.searchCase(this.usercaselistFilter, page, this.PagecaselistCount);
    }
    PagecaselistLoad(page: any) {
        this.pagercaselist = this.pagerService.getPager(this.allcaselistItemsDataCount, page, 5);
        this.pagedcaselistItems = this.CaseList.slice(this.pagercaselist.startIndex, this.pagercaselist.endIndex + 1);
    }


    //#endregion
    //#region Redirect Edit case

    caseview(data: any) {
        localStorage.setItem('ViewCaseID', data);
        this.router.navigate(['/case']);
    }

    //#endregion
    //#region Redirect casedetails
    casedeatilsview(data: any) {
        localStorage.setItem('ViewCaseID', data.id);
        this.router.navigate(['/casedetails']);
    }
    //#endregion
    //#region Date Convert
    convertUTCDateToLocalDate(date) {
        //UTC time 
        var ConverDate = (moment.utc().format(date));
        //local time
        var localTime = moment.utc(ConverDate).toDate();
        return localTime;
    }
    //#endregion
}