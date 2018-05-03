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
@Component({
    selector: module.id,
    templateUrl: './assessment.component.html',
})
export class AssessmentComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
    }
    //#region variables
    categoryname: string;
    public status: Boolean;
    Checkin: Boolean;
    search: string = "";
    caseid: any;
    longlat: any;
    CaseList: any = {};
    caseCondtion = new Array();
    domainid: number;
    public QuestionData = new Array();
    public QuestionDataList = new Array();
    public tempstorelist = new Array();
    TempWork = new Array();
    TempEducation = new Array();
    TempHealth = new Array();
    TempRelationships = new Array();
    TempCommunity = new Array();
    TempCreativity = new Array();
    public tempidstore: number;
    ngShowVal: boolean = false;
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
        $('#assessmenthistory').removeClass('ng-scope active').addClass('ng-scope ');
        $('#addassessment').removeClass('ng-scope ').addClass('ng-scope active');
        $('#emojilist').removeClass('ng-scope active').addClass('ng-scope ');
        $('#allnotification').removeClass('ng-scope active').addClass('ng-scope ');
        $('#sendnotification').removeClass('ng-scope active').addClass('ng-scope');

        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");

        this.domainid = 1;
        this.AllCase();
        this.tabdata();
        $('#Work').addClass('uib-tab nav-item active');
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
    AllCase() {
        this.userservice.getcase(this.search, 1, 100)
            .subscribe(data => {
                this.CaseList = data.listData;
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }); 
    }
    //#endregion
 
    //#region Tab Creation

    tabdata() {
        this.tabs = [{
            name: 'Work',
            domain_id: 1,
            cat: 'work'
        }, {
            name: 'Education',
            domain_id: 2,
            cat: 'education'
        }, {
            name: 'Health',
            domain_id: 3,
            cat: 'health'
        }, {
            name: 'Relationships',
            domain_id: 4,
            cat: 'relationships'
        }, {
            name: 'Community',
            domain_id: 5,
            cat: 'community'
        }, {
            name: 'Creativity',
            domain_id: 6,
            cat: 'creativity'
        }];

    }

    //#endregion
 
    //#region Tab Changes
    changeuestiondata(data: string, cat: string, domainid: number) {
        this.QuestionData = [];
        this.domainid = domainid;
        for (var i = 0; i < this.QuestionDataList.length; i++) {
            if (this.QuestionDataList[i].domain_id == this.domainid) {
                this.QuestionData.push(this.QuestionDataList[i]);
            }
        }

        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].domain_id == domainid) {
                $('#' + data).removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');
            }
            else {
                $('#' + this.tabs[i].name).removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
            }
        }
    }
    //#endregion

    //#region Condtion Check Status
    domincondtion(data: any, domainid: number, i: number, id: string) {

        if (this.QuestionData[i].domain_id == this.domainid) {
            this.QuestionData[i].status = this.QuestionData[i].status == false ? true : false;

            if (this.QuestionData[i].status == true) {
                this.caseCondtion.push(this.QuestionData[i]);
            }
            else if (this.QuestionData[i].status == false) {
                if (this.caseCondtion.length != 0) {
                    for (var j = 0; j < this.caseCondtion.length; j++) {
                        if (this.caseCondtion[j].id == id) {
                            this.caseCondtion.splice(j, 1);

                            this.Checkin = this.caseCondtion.length != 0 ? true : false;
                            return true;
                        }
                    }
                }
            }
            this.Checkin = this.caseCondtion.length != 0 ? true : false;
        }

    }
    //#endregion
 
    //#region Case Select
    
    caseSelected(selectedCase: any) {
        this.ngShowVal = true;
        debugger;
        this.userservice.getcaseid(selectedCase)
            .subscribe(data => {
                this.QuestionDataList = data.listData[0].caseQuestion;
                for (var i = 0; i < this.QuestionDataList.length; i++) {
                    // this.QuestionDataList[i].id = 0;
                    this.QuestionDataList[i].case_id = selectedCase;
                    this.QuestionDataList[i].group_id = 1;
                    this.QuestionDataList[i].status = false;
                }

                this.domainid = 1;
                this.QuestionData = [];
                for (var i = 0; i < this.QuestionDataList.length; i++) {
                    if (this.QuestionDataList[i].domain_id == this.domainid) {
                        this.QuestionData.push(this.QuestionDataList[i]);

                    }
                    $('#Work').removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');
                    $('#Education').removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
                    $('#Health').removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
                    $('#Relationships').removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
                    $('#Community').removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
                    $('#Creativity').removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');

                }
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }); 
    }
    //#endregion

    //#region Post Questions
    changelocation() {
        this.ngShowVal = true;
        for (var i = 0; i < this.caseCondtion.length; i++) {
            this.caseCondtion[i].longlat = this.longlat;
            this.caseCondtion[i].id = 0;

        }
    }

    dominassessment() {
        this.changelocation(); 
        this.userservice.postquestions(this.caseCondtion)
            .subscribe(data => {
                this.alertService.success(data.status, true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                this.router.navigate(['assessmenthistory']);
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }); 
    }
    //#endregion

    //#region Keyboard Number 
    onlyDecimalNumberKey(event) {
        ;
        let charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode == 44 || charCode == 34))
            return true;
        else if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;


        return true;
    }

    //#endregion
}