import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as _ from 'underscore';
declare var jquery: any;
declare var $: any;
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { notification } from '../notification/notification';

@Component({
    selector: module.id,
    templateUrl: './sendnotification.component.html',
})
export class NotificationComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {

    }
    //#region Variable Declare

    Case: string;
    notes: string;
    notification = new notification();
    CaseList: any = [];
    pager: any = [];
    pageNumber: any;
    search: string = "";
    pagedItems: any[];
    userFilter: any;
    PageCount: any;
    Checkin: Boolean;
    case_id_list: any = new Array();
    allItemsDataCount: any;
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
        $('#allnotification').removeClass('ng-scope active').addClass('ng-scope ');
        $('#sendnotification').removeClass('ng-scope ').addClass('ng-scope active');

        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
        this.setPage(1);

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
    //#region  Selct Case Select
    caseselect(item: any) {
        if (this.case_id_list == 0) {
            this.Checkin = true;
            this.case_id_list.push({ case_id: item });
        }
        else {
            for (var i = 0; i < this.case_id_list.length; i++) {
                if (this.case_id_list[i].case_id == item) {
                    this.case_id_list.splice(i, 1);

                    if (this.case_id_list != 0) {
                        this.Checkin = true;
                    }
                    else {
                        this.Checkin = false;
                    }
                    return true;
                }
            }
            this.case_id_list.push({ case_id: item });

        }
    }


    //#endregion
    //#region GetCase List
    getcase(pageNumber: any, pagecount: any) {
        this.userservice.getcase(this.search, this.pageNumber, this.PageCount)
            .subscribe(data => {

                this.CaseList = data.listData;
                this.allItemsDataCount = data.dataCount
                this.PageLoad(pageNumber);

                for (var i = 0; i < this.CaseList.length; i++) {
                    this.CaseList[i].status = false;
                }
                for (var i = 0; i < this.CaseList.length; i++) {
                    for (var j = 0; j < this.case_id_list.length; j++) {
                        if (this.case_id_list[j].case_id == this.CaseList[i].id) {
                            this.CaseList[i].status = true;
                        }
                    }
                }
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pageNumber = page;
        this.PageCount = 5;
        this.getcase(page, this.PageCount);

    }
    PageLoad(page: any) {
        this.pager = this.pagerService.getPager(this.allItemsDataCount, page, 5);
        this.pagedItems = this.CaseList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    //#endregion
    //#region Post Notifications
    performSubmit() {
        this.notification.type = 'web';
        this.notification.desc = this.notes;
        this.notification.case_id_list = this.case_id_list;
        this.userservice.postnotifications(this.notification)
            .subscribe(data => {
                this.alertService.success(data.status, true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                this.case_id_list = [];
                this.router.navigate(['notificationhistory']);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
 }