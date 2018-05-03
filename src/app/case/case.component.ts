import { Component, OnInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { cases } from '../case/cases';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject'
import { AppConfig } from '../app.config';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { SelectModule } from 'ng2-select';
import { debug } from 'util';
import * as moment from 'moment';
import { debounce } from 'rxjs/operator/debounce';
declare var jquery: any;
declare var $: any;

@Component({
    selector: module.id,
    templateUrl: './case.component.html',
    styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
    //#region variables
    date = new Date();

    myOptions: INgxMyDpOptions = {
        dateFormat: 'mm-dd-yyyy',
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        disableUntil: { year: this.date.getFullYear(), month: this.date.getMonth() + 1, day: new Date().getDate() - 1 }
    };

    caseCondition: string;
    randomDateArray1: any = [];

    position: number;
    hidethis = false;
    filterCountry: any;
    country: any;
    angular: any;
    categoryname: string;
    IEImage: any;
    uploadedImage: Blob;
    uploadedImage1: File;
    public Edit: Boolean = false;
    CaseDateSelect: Boolean = false;
    form: FormGroup;

    imagePreview: string;
    ImageFileName: any;
    ImageUpload: Boolean;
    CourtDate: Boolean;
    caseConditionArray = [];

    dailyTwice = false;
    dateArray = [];
    public photograph: string = "";
    public randomDateArray: any[];
    public randomDateArrayEdit: any[];
    public randomDateArrayEditDummy: any[];
    dateTimeValue = [];
    caseFlag = false;
    dailyEdit = true;
    isEdit: boolean;
    diff: any;
    timeConfig: any;
    caseData: any;
    recurringFrequency: string;
    CondtionList: any = {};
    RegionList: any = {};
    tabs: any = {};
    startDate: Date;
    endDate: Date;
    workstatus: boolean;
    question: string;
    score: number;
    PhoneData: any;
    AddressData: any;
    QuestionData: any;
    CondtionData: any;
    cases = new cases();
    first_name: string;
    middle_name: string;
    last_name: string;
    logo: string;
    TempPhoto: string;
    region_id: string;
    case_number: string;
    case_Condition = new Array();
    identification_num: string;
    access_code: string;
    defaultImage: string = "assets/images/photo1.png";
    domainid: number;
    startAt = new Subject()
    endAt = new Subject()
    domainConfigUrl = this.config.domain1;
    getquestionlistFilter = new Array();
    roleuserid: any;
    casedate: any = new Date();
    public flag: boolean = false;
    public recurringdate: boolean = false;
    id: string;
    tempphonelist: any;
    tempquestionlist: any;
    tempaddresslist: any;
    search_case: any;
    case_selected_value: string;
    case_postiton: number;
    savebutton: string;
    UserdataList: any = {};
    role_id: number;
    public items = new Array();
    mySelectValue = new Array();
    private value: any = [];
    UserroleList: any = {};

    getquestionlist: any;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        public sanitizer: DomSanitizer,

        private config: AppConfig,
        private ng2ImgMax: Ng2ImgMaxService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
        this.loadScriptJs('assets/js/rangepicker.js');
    }


    //#region ngOnInit & Token Validation
    ngOnInit() {

        this.refreshData();
        this.ImageFileName = "Select Image";
        this.imagePreview = '../../assets/img/whitey.jpg';
        this.ImageUpload = false;
        this.CourtDate = false;
        this.form = new FormGroup({});
        this.form.addControl('selectSingle', new FormControl(''));
        this.form.addControl('selectMultiple', new FormControl(['1', '2', '4']));
        this.userdata();

        this.generateCode();
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
        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcase').removeClass('ng-scope').addClass('ng-scope active');
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

        this.savebutton = "Add";
        this.PhoneData = [];
        this.AddressData = [];
        this.QuestionData = [];
        this.CondtionData = [];
        this.tempphonelist = [];
        this.tempaddresslist = [];
        this.tempquestionlist = [];
        this.getcondition();
        this.getregion();
        this.PhoneData.push({ "number": "", "phoneType": "", "id": 0 });
        this.AddressData.push({ "addressline1": "", "addressline2": "", "state": "", "city": "", "zipcode": "" });
        this.workstatus = false;
        this.tabdata();
        $('#Work').addClass('active');
        this.timeconfig();
        this.getdominquestion();
        this.domainid = 1;
        this.id = null;
        var data = localStorage.getItem('ViewCaseID');
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        if (data != null) {
            this.savebutton = "Update";
            this.viewcase(data);
            this.ImageFileName = "";
            this.id = data;
            localStorage.removeItem('ViewCaseID');
        }
        else {
            this.recurringdate = false;
        }
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
    //#region  Condition All

    getcondition() {
        this.userservice.getallcondtion()
            .subscribe(data => {

                this.CondtionList = data.listData;

                this.items = [];
                for (var i = 0; i < this.CondtionList.length; i++) {
                    this.items = this.items.concat([
                        this.CondtionList[i].desc
                    ]);


                }
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    //#endregion
    //#region Ques Selected
    selected(value: any): void {

        this.CondtionData.push({ "desc": value.text });

    }

    removed(value: any): void {

        for (var i = 0; i < this.CondtionData.length; i++) {
            if (this.CondtionData[i].desc == value.text) {
                this.CondtionData.splice(i, 1);

            }
        }


    }
    public typed(value: any) {
        this.items = this.items.concat([
            value
        ]);

        let last: any = this.items[this.items.length - 1];
        this.item(last);
    }


    item(value: any) {
        this.mySelectValue = this.mySelectValue.concat([
            value
        ]);
    }
    refreshValue(value: any): void {

        this.value = value;

    }


    //#endregion
    //#region Script
    public loadScriptJs(url) {
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('body')[0].appendChild(node);
    }

    //#endregion
    //#region Time and Tab Config
    timeconfig() {
        this.timeConfig = {
            daily: {
                startTime: 8,
                endTime: 17
            },
            twiceDaily: [{
                startTime: 8,
                endTime: 12
            }, {
                startTime: 12,
                endTime: 17
            }]
        }
    }
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
    //#region User Region
    getalluserbyRegion() {
        this.UserroleList = [];
        this.userservice.getalluserbyroleRegion(this.region_id).subscribe(data => {
            this.UserroleList = data.listData;
        }, err => {
            var meg = JSON.parse(err._body);
            this.alertService.error(meg.status, true);
            $('.alert').css({ 'display': 'block' });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        });
    }

    getregion() {
        this.userservice.getallregion()
            .subscribe(data => {

                this.RegionList = data.listData;


            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
    //#region  Get UserData
    userdata() {

        this.userservice.getuserdata()
            .subscribe(data => {
                this.UserdataList = data.listData[0][0];
                this.role_id = this.UserdataList.role_id;
                this.region_id = this.UserdataList.region_id;


                if (this.role_id == 3) {
                    this.getalluserbyRegion();
                }
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
    //#region  DomainQuestion
    getdominquestion() {
        this.userservice.getalldominquestion()
            .subscribe(data => {

                this.getquestionlist = data.listData;
                this.QuestiondataFilter(this.domainid);

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    // onselectClient(question) {
    //     if (question.desc != undefined) {
    //         alert(question);
    //     }
    //     else {
    //         return false;
    //     }
    // }
    //#endregion
    //#region  generateCode
    generateCode = function () {
        if (!this.access_code) {
            this.access_code = {};
        }
        var chrs = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var acc = '';

        for (var i = 0; i < 5; i++) {
            var ranchar = chrs[Math.floor(Math.random() * chrs.length)];
            acc += ranchar;
        }
        this.codeGenerated = true;
        this.access_code = acc;
    }
    //#endregion
    //#region Get All Questions,Add & Filter
    Questiondata(data: string, cat: string, domainid: number) {

        this.getquestionlistFilter = [];
        this.categoryname = cat;
        this.domainid = domainid;
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].domain_id == domainid) {
                this.domainid = this.tabs[i].domain_id;
                $('#' + data).removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');
            }
            else {
                $('#' + this.tabs[i].name).removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
            }
        }

        for (var QuesData in this.getquestionlist) {
            if (this.getquestionlist[QuesData].domain_id == this.domainid) {
                this.getquestionlistFilter.push(this.getquestionlist[QuesData]);
            }

        }


    }

    QuestiondataFilter(domainid: number) {
        this.getquestionlistFilter = [];
        for (var QuesData in this.getquestionlist) {
            if (this.getquestionlist[QuesData].domain_id == domainid) {
                this.getquestionlistFilter.push(this.getquestionlist[QuesData]);
            }

        }
    }

    search($event) {
        let q = $event.target.value
        this.startAt.next(q)
        this.endAt.next(q + "\uf8ff")
    }



    Workquestion() {
        this.position = (this.position + 1);
        this.workstatus = true;
        this.QuestionData.push({ "desc": "", "score": "", "domain_id": this.domainid });

    }
    workchange(i: string, question: string, score: number) {

        this.position = (this.position + 1);
        this.country = question;
        this.QuestionData[i].desc = question;
        this.QuestionData[i].score = score;
        this.hidethis = true;
    }
    workchange1(question: string, i: string) {

        this.QuestionData[i].desc = question;
    }
    complete(count: any, position: number) {
        this.position = position;
        this.hidethis = false;
        var output = [];
        for (let i = 0; i < this.getquestionlistFilter.length; i++) {
            let country = this.getquestionlistFilter[i];
            var personRegExp = new RegExp(count);
            if (personRegExp.test(country.desc)) {
                output.push(country);
            }
        }
        this.filterCountry = output;

    }

    completeSelect(i: number, q) {
        this.case_postiton = i;
        var output = [];
        var personRegExp = new RegExp(q);
        var i = 0;
        for (i = 0; i < this.items.length; i++) {
            let data = this.items[i];

            if (personRegExp.test(data)) {
                output.push(data);
            }
        }
        this.search_case = output;
    }

    workscore(i: string, score: number) {
        this.QuestionData[i].score = score;
    }
    change1(question: string) {
        this.QuestionData.push({ "desc": "", "score": "", "domain_id": "", "id": 0 });

    }
    change2(score: number) {
        this.QuestionData.push({ "desc": "", "score": "", "domain_id": "", "id": 0 });

    }
    deletequestion(i: number) {
        this.QuestionData.splice(i, 1);

    }
    //#endregion
    //#region  condition Add
    addnewCase() {

        this.search_case = [];
        this.case_postiton = (this.case_postiton + 1);

        this.caseConditionArray.push({ "desc": "" });
    }
    removeCase(i: number) {
        this.case_postiton = (this.case_postiton - 1);
        this.caseConditionArray.splice(i, 1);

    }



    addcondition(i: number, condtion: string) {
        this.caseConditionArray[i].desc = condtion;
        this.case_postiton = (this.case_postiton + 1);
        this.hidethis = true;

    }

    select_condition(question: string, i: number) {

        this.caseConditionArray[i].desc = question;
    }

    //#endregion
    //#region Phone and Address Add
    addNewPhone() {
        this.PhoneData.push({ "number": "", "phoneType": "", "id": 0 });

    }
    deletePhone(i: number) {
        this.PhoneData.splice(i, 1);

    }
    phonechange(i: string, phone: string) {
        this.PhoneData[i].number = phone;

    }
    phonetypechange(i: string, phoneType: string) {
        this.PhoneData[i].phoneType = phoneType;

    }
    addNewAddress() {
        this.AddressData.push({ "addressline1": "", "addressline2": "", "state": "", "city": "", "zipcode": "", "id": 0 });

    }
    deleteAddress(i: number) {
        this.AddressData.splice(i, 1);

    }
    addressline1change(i: string, addressline1: string) {
        this.AddressData[i].addressline1 = addressline1;

    }
    addressline2change(i: string, addressline2: string) {
        this.AddressData[i].addressline2 = addressline2;

    }
    citychange(i: string, city: string) {
        this.AddressData[i].city = city;

    }
    statechange(i: string, state: string) {
        this.AddressData[i].state = state;

    }
    zipcodechange(i: string, zipcode: string) {
        this.AddressData[i].zipcode = zipcode;

    }
    //#endregion
    //#region Date
    dateRangeModel = {
        startDate: null,
        endDate: null,
    };
    //#endregion
    //#region Recurring Date
    getInfoForDateGeneration = function (Frequency: string, ) {
        this.randomDateArray = [];
        this.dateRangeModel.startDate = JSON.parse(localStorage.getItem('startDate'));
        this.dateRangeModel.endDate = JSON.parse(localStorage.getItem('endDate'));
        let date1: Date;
        let date2: Date;
        date1 = new Date(this.dateRangeModel.startDate);
        date2 = new Date(this.dateRangeModel.endDate);

        if (this.recurringFrequency == "monthly") {
            let diff = this.monthDiff(date1, date2);
            if (diff == 0) {
                this.caseFlag = false;
                this.recurringFrequency = [];
                this.randomDateArray = [];
                this.alertService.error("Please Select More then 1 Month", true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                return false;
            }
        }
        else if (this.recurringFrequency == "weekly") {
            var dt1 = new Date(this.dateRangeModel.startDate);
            var dt2 = new Date(this.dateRangeModel.endDate);
            var timeDiff = Math.abs(dt2.getTime() - dt1.getTime());
            let diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diff < 5) {
                this.caseFlag = false;
                this.randomDateArray = [];
                this.recurringFrequency = [];
                this.alertService.error("Please Select More then 1 Week", true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                return false;
            }
        }

        if (this.dateRangeModel.startDate != null) {
            this.recurringFrequency = Frequency;

            if (this.recurringFrequency) {
                this.generateDates(this.dateRangeModel, this.recurringFrequency);
            }
        }
        else {
            this.recurringFrequency = [];
            this.alertService.error("Please Select Recurring Range Date", true);
            $('.alert').css({ 'display': 'block' });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        }

    }

    generateDates(dateRange, occurance) {
        if (!this.isEdit) {
            let date1: Date;
            let date2: Date;
            date1 = new Date(dateRange.startDate);
            date2 = new Date(dateRange.endDate);

            this.startDate = date1;
            this.endDate = date2;
            this.dateArray = [];
            this.randomDateArray = [];
            this.dateTimeValue = [];
            switch (occurance) {
                case 'daily':
                    this.caseFlag = true;
                    this.generateDailyDateTime();
                    this.dailyEdit = true;
                    break;
                case 'weekly':
                    this.caseFlag = true;
                    this.dailyEdit = false;
                    this.generateWeeklyDates();
                    break;
                case 'biweekly':
                    break;
                case 'monthly':
                    this.caseFlag = true;
                    this.dailyEdit = false;
                    this.generateMonthlyDates();
                    break;
            }
        } else {

        }
    }

    //#endregion
    //#region Browser
    GetBrowser() {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'IE', version: (tem[1] || '') };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR|Edge\/(\d+)/)
            if (tem != null) { return { name: 'Opera', version: tem[1] }; }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return {
            name: M[0],
            version: M[1]
        };
    }
    DateConvertionBrowser(year, month, day, time) {

        var BroswerName = this.GetBrowser();
        if (BroswerName.name == "IE") {
            var duedate = new Date(month + '/' + day + '/' + year + ' ' + time);
            return duedate;
        }
        else {
            var GetDueDate = new Date(year + '-' + month + '-' + day + ' ' + time);
            return GetDueDate;
        }
    }
    //#endregion
    //#region DailyDate

    generateDailyDateTime() {
        var dt1 = new Date(this.startDate);
        var dt2 = new Date(this.endDate);
        var timeDiff = Math.abs(dt2.getTime() - dt1.getTime());
        this.diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var eachDate = this.startDate;
        for (var i = 0; i < this.diff; i++) {
            if (eachDate.toString().split(' ')[0] === 'Sat' || eachDate.toString().split(' ')[0] === 'Sun') {

            } else {
                this.dateArray.push(eachDate);
            }
            eachDate = new Date(eachDate.getTime() + (1000 * 60 * 60 * 24 * 1));
        }
        this.getRandomTime(this.timeConfig.daily);
    };


    getRandomTime(timeConfig) {

        for (var i = 0; i < this.dateArray.length; i++) {
            var month = this.dateArray[i].getMonth() + 1;
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var day = this.dateArray[i].getDate();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (!this.dailyTwice) {
                let time;
                var date = new Date();
                var chackdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                if (day == chackdate) {
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

                    let CurrentstartTime = parseInt(hours.toString());
                    if (CurrentstartTime < timeConfig.endTime) {
                        if (CurrentstartTime < timeConfig.startTime) {
                            time = (timeConfig.startTime + 2) + ':' + '00';
                            var DueDate = this.DateConvertionBrowser(this.dateArray[i].getFullYear(), month, day, time)

                            this.randomDateArray.push({
                                date: this.dateArray[i],
                                duedate: DueDate,
                                time: time.toString(),
                                edit: false,
                                editTime: false,
                                invalid: false,
                                invalidDate: false
                            });
                        }
                        else if (CurrentstartTime <= 16) {
                            time = (CurrentstartTime + 1) + ':' + '00';
                            var DueDate = this.DateConvertionBrowser(this.dateArray[i].getFullYear(), month, day, time)

                            this.randomDateArray.push({
                                date: this.dateArray[i],
                                duedate: DueDate,
                                time: time.toString(),
                                edit: false,
                                editTime: false,
                                invalid: false,
                                invalidDate: false
                            });
                        }


                    }
                }
                else {
                    time = Math.random() * (timeConfig.endTime - timeConfig.startTime) + timeConfig.startTime;

                    time = parseInt(time);
                    if (time.toString().length === 1) {
                        time = '0' + time;
                    }
                    time = time + ':00';
                    var DueDate = this.DateConvertionBrowser(this.dateArray[i].getFullYear(), month, day, time)
                    this.randomDateArray.push({
                        date: this.dateArray[i],
                        duedate: DueDate,
                        time: time.toString(),
                        edit: false,
                        editTime: false,
                        invalid: false,
                        invalidDate: false
                    });


                }
            }
        }
    }


    //#endregion
    //#region WeeklyDate
    generateWeeklyDates() {

        var dt1 = new Date(this.startDate);
        var dt2 = new Date(this.endDate);
        var timeDiff = Math.abs(dt2.getTime() - dt1.getTime());
        this.diff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (this.startDate.getDay() < 6 && this.startDate.getDay() !== 0) {
            this.dateArray.push(this.startDate);
            var day = this.startDate.getDay();
            var diffDays = (5 - day);
            var firstFriday = new Date((this.startDate.getTime() + (1000 * 60 * 60 * 24 * Number(diffDays))));
            this.dateArray.push(firstFriday);
            this.getWeekDates(firstFriday, dt2);
        } else {
            if (this.startDate.getDay() === 6) {
                var firstMonday = new Date((this.startDate.getTime() + (1000 * 60 * 60 * 24 * 2)));
            } else if (this.startDate.getDay() === 0) {
                var firstMonday = new Date((this.startDate.getTime() + (1000 * 60 * 60 * 24 * 1)));
            }
            this.getWeekDates(firstMonday, dt2)

        }
    };
    randDate: any;
    getWeekDates(dateVal: any, enddate: any) {
        if (dateVal.toString().split(' ')[0] === 'Fri') {
            var firstDay = dateVal;
            for (var i = 0; i < this.diff; i++) {
                var nextMonday = new Date(firstDay.getTime() + (1000 * 60 * 60 * 24 * 3));
                if (nextMonday.getTime() < this.endDate.getTime()) {

                    this.dateArray.push(nextMonday);
                } else {
                    break;
                }
                if (nextMonday.toDateString() !== this.endDate.toDateString()) {
                    var nextFriday = new Date(nextMonday.getTime() + (1000 * 60 * 60 * 24 * 4));
                    if (nextFriday.getTime() < this.endDate.getTime()) {
                        this.dateArray.push(nextFriday);
                        firstDay = nextFriday;
                    } else {
                        break;
                    }
                } else {
                    this.dateArray.pop();
                    break;
                }
            }
        } else if (dateVal.toString().split(' ')[0] === 'Mon') {
            var firstDay = dateVal;
            for (var i = 0; i < this.diff; i++) {
                if (enddate >= firstDay) {
                    this.dateArray.push(firstDay);
                }
                else {
                    break;
                }
                var nextFriday = new Date(firstDay.getTime() + (1000 * 60 * 60 * 24 * 4));
                if (enddate >= nextFriday) {
                    this.dateArray.push(nextFriday);
                    var nextMonday = new Date(nextFriday.getTime() + (1000 * 60 * 60 * 24 * 3));
                    firstDay = nextMonday;
                }
                else {
                    this.dateArray.push(enddate);
                    break;
                }


            }

        }
        if (this.dateArray[this.dateArray.length - 1].toDateString() !== this.endDate.toDateString()) {
            var arrIndex = this.dateArray.length - 1;
            var temp = new Date(this.dateArray[arrIndex].getTime() + (1000 * 60 * 60 * 24 * 3));
            if (temp.getTime() < this.endDate.getTime()) {
                this.dateArray.push(temp);
                this.dateArray.push(this.endDate);
            } else {

            }
        } else {

        }
        this.generateRandomDates();
    };
    //#endregion
    //#region  MonthlyDate
    generateMonthlyDates() {

        var diff = this.monthDiff(this.startDate, this.endDate);

        if (diff !== 0) {
            var eachMonth = this.startDate;
            var EndMonth = this.endDate;
            for (var i = 0; i < diff; i++) {
                this.dateArray.push(eachMonth);
                ;
                var noOfDays = this.getDays(eachMonth.getMonth() + 1, eachMonth.getFullYear());
                var daysDeducted = noOfDays - Number(eachMonth.getDate());
                var nextMonth = new Date(eachMonth.getTime() + (1000 * 60 * 60 * 24 * Number(daysDeducted)));
                this.dateArray.push(nextMonth);


                var noOfDaysNextMonth = this.getDays(EndMonth.getMonth() + 1, EndMonth.getFullYear());
                var daysDeductedNextMonth = noOfDaysNextMonth - Number(EndMonth.getDate());
                var nextMonthDate = new Date(EndMonth.getTime() + (1000 * 60 * 60 * 24 * Number(daysDeductedNextMonth)));
                if (nextMonthDate < EndMonth) {
                    var nextDay = new Date(nextMonth.getTime() + (1000 * 60 * 60 * 24 * 1));
                    eachMonth = nextDay;
                }
                else {
                    let nextMonthStartDate = new Date(nextMonth.getTime() + (1000 * 60 * 60 * 24));
                    this.dateArray.push(nextMonthStartDate);

                    let nextMonthEnd = new Date(EndMonth);
                    this.dateArray.push(nextMonthEnd);

                    break;
                }
            }
            this.generateRandomDates();
        } else {
            this.dateArray.push(this.startDate);
            this.dateArray.push(this.endDate);
            this.generateRandomDates();
        }

    };
    monthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth() + 1;
        return months <= 0 ? 0 : months + 1;
    }

    generateRandomDates() {
        ;
        for (var i = 0; i < this.dateArray.length; i += 2) {
            if (i + 1 < this.dateArray.length) {
                var j = i + 1;
            }
            if (!this.dailyTwice) {
                this.randomDate(this.dateArray[i], this.dateArray[j], this.timeConfig.daily);
            } else {
                this.randomDate(this.dateArray[i], this.dateArray[j], this.timeConfig.twiceDaily);
            }
        }
    }

    randomDate(start, end, timeConfig) {
        var randDate;
        if (this.recurringFrequency === 'monthly') {
            randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            while (randDate.toString().split(' ')[0] === 'Sat' || randDate.toString().split(' ')[0] === 'Sun') {
                randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }
            var month = randDate.getMonth() + 1;
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var day = randDate.getDate();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (!this.dailyTwice) {
                let time;
                var date = new Date();
                var chackdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                if (day == chackdate) {
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

                    if (hours > 8 && hours < 17) {
                        time = hours + ':' + minutes;
                        var Duedate = this.DateConvertionBrowser(randDate.getFullYear(), month, day, time);
                        this.randomDateArray.push({
                            date: randDate,
                            duedate: Duedate,
                            time: time.toString(),
                            edit: false,
                            editTime: false,
                            invalid: false,
                            invalidDate: false
                        });
                    }
                }

                else {
                    time = Math.random() * (timeConfig.endTime - timeConfig.startTime) + timeConfig.startTime;

                    time = parseInt(time);
                    if (time.toString().length === 1) {
                        time = '0' + time;
                    }
                    time = time + ':00';
                    var Duedate = this.DateConvertionBrowser(randDate.getFullYear(), month, day, time);
                    this.randomDateArray.push({
                        date: randDate,
                        duedate: Duedate,
                        time: time.toString(),
                        edit: false,
                        editTime: false,
                        invalid: false,
                        invalidDate: false
                    });
                }



            }

        } else {
            randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            while (randDate.toString().split(' ')[0] === 'Sat' || randDate.toString().split(' ')[0] === 'Sun') {
                randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }
            var month = randDate.getMonth() + 1;
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var day = randDate.getDate();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (!this.dailyTwice) {
                let time;
                var date = new Date();
                var chackdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                if (day == chackdate) {
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    let startTime = parseInt(hours.toString());
                    if (timeConfig.startTime < startTime && startTime < timeConfig.endTime) {
                        time = (startTime + 1) + ':00';
                        var Duedate = this.DateConvertionBrowser(randDate.getFullYear(), month, day, time);
                        this.randomDateArray.push({
                            date: randDate,
                            duedate: Duedate,
                            time: time.toString(),
                            edit: false,
                            editTime: false,
                            invalid: false,
                            invalidDate: false
                        });
                    }

                }

                else {
                    time = Math.random() * (timeConfig.endTime - timeConfig.startTime) + timeConfig.startTime;

                    time = parseInt(time);
                    if (time.toString().length === 1) {
                        time = '0' + time;
                    }
                    time = time + ':00';
                    var Duedate = this.DateConvertionBrowser(randDate.getFullYear(), month, day, time);
                    this.randomDateArray.push({
                        date: randDate,
                        duedate: Duedate,
                        time: time.toString(),
                        edit: false,
                        editTime: false,
                        invalid: false,
                        invalidDate: false
                    });
                }


            }
        }
    }



    getDays(month, year) {
        return new Date(year, month, 0).getDate();
    }

    //#endregion
    //#region Image Upload

    getImagePreview(file: File) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        this.ImageUpload = true;
        reader.onload = (e: any) => {
            this.imagePreview = reader.result;
            this.cases.photograph = this.imagePreview.replace("data:" + file.type + ";base64,", "");
            this.ImageUpload = true;
        };
    }

    onFileChange(fileInput: any) {
        var fileSize = fileInput.target.files[0].size;

        var BroswerName = this.GetBrowser();
        if (BroswerName.name == "IE") {
            if (fileSize < 1000000) {

                this.logo = fileInput.target.files[0];
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.imagePreview = e.target.result;

                    this.ImageFileName = url;
                    var url = fileInput.target.files[0].name;
                    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                    if (ext == 'jpg') {
                        ext = "jpeg";
                    } else if (ext == 'png') {
                        ext = "png";
                    }
                    this.cases.photograph = e.target.result.replace("data:image/" + ext + ";base64,", "");
                    this.ImageFileName = "Update Image";
                    this.ImageUpload = true;
                }
                this.imagePreview = '../../assets/img/whitey.jpg';
                this.ImageFileName = "Select Image";
                this.ImageUpload = false;
                reader.readAsDataURL(fileInput.target.files[0]);
            }
            else {
                this.alertService.error('Image Should not Exist more then 1MB', true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }
        }
        else {
            if (fileSize < 5000000) {
                let image1 = fileInput.target.files[0];
                if (image1 != undefined) {

                    if (image1.type == "image/jpeg" || image1.type == "image/jpeg" || image1.type == "image/png") {
                        let reader = new FileReader();
                        ;
                        this.ng2ImgMax.compress([fileInput.target.files[0]], 0.3).subscribe(
                            result => {
                                ;
                                this.getImagePreview(result);
                            },
                            error => {
                                console.log('😢 Oh no!', error);
                            }
                        );
                    }
                    else {
                        this.imagePreview = '../../assets/img/whitey.jpg';
                        this.ImageFileName = "Select Image";
                        this.ImageUpload = false;
                        this.alertService.error('Only jpg/jpeg and png files are allowed!', true);
                        $('.alert').css({ "display": "block" });
                        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);

                    }
                }
            }
            else {
                this.alertService.error('Image Should not Exist more then 5MB', true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }

        }


    }

    //#endregion
    //#region Case Date
    tempcasedate: string;
    onDateChanged(event: IMyDateModel): void {
        $("#datepicker").removeAttr("class");
        $('#datepicker').addClass('form-control');
        $("#datelabelerror").removeAttr("class");
        $('#datelabelerror').addClass('col-sm-2 col-xs-4 control-label');
        var TempDate = (event.formatted).split('-');
        this.CaseDateSelect = true;

        var ConvertCareDate = new Date(TempDate[2] + "-" + TempDate[0] + "-" + TempDate[1]).toISOString()
        this.tempcasedate = ConvertCareDate.toString();
    }

    //#endregion
    //#region Case Add   
    savecase() {
        this.tempaddress();
        this.tempphone();
        this.tempuestion();
        this.tempcasecondition();

        for (var i = 0; i < this.randomDateArray.length; i++) {
            var TempConvertDate = this.convertLocalDateToUTCDate(new Date(this.randomDateArray[i].duedate));
            this.randomDateArray1.push({ 'duedate': TempConvertDate });
        }
        if (this.id != null) {
            this.cases.id = this.id;
        }

        if (this.role_id == 3) {

            this.cases.assigned_to = this.roleuserid;
        }
        else {
            this.cases.assigned_to = JSON.parse(localStorage.getItem('id'));
        }
        if (this.tempcasedate != null && this.tempcasedate != 'undefined') {
            ;


            this.cases.case_date = this.tempcasedate;
        }

        this.cases.case_number = this.case_number;
        this.cases.first_name = this.first_name;
        this.cases.last_name = this.last_name;
        this.cases.middle_name = this.middle_name;
        this.cases.identification_num = this.identification_num;
        this.cases.access_code = this.access_code;
        this.cases.recurring_enddate = JSON.parse(localStorage.getItem('endDate'));
        this.cases.recurring_startdate = JSON.parse(localStorage.getItem('startDate'));
        this.cases.recurring_frequency = this.recurringFrequency;
        this.cases.region_id = this.region_id;;
        this.cases.caseAddress = this.tempaddresslist;
        this.cases.casePhone = this.tempphonelist;
        this.cases.caseCondition = this.CondtionData;
        this.cases.caseQuestion = this.tempquestionlist;
        this.cases.caseRecurring = this.randomDateArray1;

        if (this.id != null) {

            this.userservice.putcase(this.cases)
                .subscribe(data => {

                    if (data.status == "Case Updated successfuly! ") {
                        this.alertService.success('case updated sucessfully !', true);
                        $('.alert').css({ "display": "block" });
                        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                        this.router.navigate(['/casehistory']);
                    }
                    else {
                        this.alertService.error('case updated failed !');
                        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                        $('.alert').css({ "display": "block" });
                    }
                }, err => {
                    var meg = JSON.parse(err._body);
                    this.alertService.error(meg.status, true);
                    $('.alert').css({ 'display': 'block' });
                    setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                });
        }
        else {

            this.userservice.postcase(this.cases)
                .subscribe(data => {

                    if (data.status == 'OK') {
                        this.alertService.success('case added sucessfully !', true);
                        $('.alert').css({ "display": "block" });
                        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                        this.router.navigate(['/casehistory']);
                    }
                    else {
                        this.alertService.error('case added failed !');
                        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                        $('.alert').css({ "display": "block" });
                    }
                }, err => {
                    var meg = JSON.parse(err._body);
                    this.alertService.error(meg.status, true);
                    $('.alert').css({ 'display': 'block' });
                    setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                });
        }
    }
    tempaddress() {
        this.tempaddresslist = [];
        if (this.AddressData.length != 0) {
            for (var i = 0; i < this.AddressData.length; i++) {
                if (this.AddressData[i].addressline1 != "" || this.AddressData[i].zipcode != "" || this.AddressData[i].city != "" || this.AddressData[i].state != "") {
                    this.tempaddresslist.push(this.AddressData[i]);
                }
            }
        }
    }
    tempphone() {
        this.tempphonelist = [];

        if (this.PhoneData.length != 0) {
            for (var i = 0; i < this.PhoneData.length; i++) {

                if (this.PhoneData[i].number != "") {
                    if (this.PhoneData[i].phoneType == "Cell") {
                        var TempNumber = this.PhoneData[i].number;
                        this.tempphonelist.push({ "number": "0," + TempNumber, "id": 0 });

                    }
                    else if (this.PhoneData[i].phoneType == "Home") {
                        var TempNumber = this.PhoneData[i].number;

                        this.tempphonelist.push({ "number": "1," + TempNumber, "id": 0 });
                    }
                    else if (this.PhoneData[i].phoneType == "Office") {
                        var TempNumber = this.PhoneData[i].number;

                        this.tempphonelist.push({ "number": "2," + TempNumber, "id": 0 });

                    }
                    else {
                        var TempNumber = this.PhoneData[i].number;
                        this.tempphonelist.push({ "number": "0," + TempNumber, "id": 0 });
                    }

                }
                else {

                }
            }
        }
    }

    tempuestion() {
        this.tempquestionlist = [];
        if (this.QuestionData.length != 0) {

            for (var i = 0; i < this.QuestionData.length; i++) {
                if (this.QuestionData[i].desc != "" && this.QuestionData[i].score != "") {
                    this.tempquestionlist.push(this.QuestionData[i]);
                }
                else if (this.QuestionData[i].desc != "" && this.QuestionData[i].score == "") {
                    this.QuestionData[i].score = 0;
                    this.tempquestionlist.push(this.QuestionData[i]);
                }
            }
        }

    }
    tempcasecondition() {
        this.CondtionData = [];
        if (this.caseConditionArray.length != 0) {
            for (var i = 0; i < this.caseConditionArray.length; i++) {
                if (this.caseConditionArray[i].desc != "") {
                    this.CondtionData.push(this.caseConditionArray[i]);
                }
            }
        }
    }

    //#endregion
    //#region  View Case
    viewcase(id: any) {
        this.userservice.getcaseid(id)
            .subscribe(data => {
                this.Edit = true;
                var tempdata = data.listData[0];
                this.first_name = tempdata.first_name;
                this.case_number = tempdata.case_number;
                this.last_name = tempdata.last_name;
                this.middle_name = tempdata.middle_name;
                this.AddressData = tempdata.caseAddress.length != 0 ? tempdata.caseAddress : this.AddressData;
                debugger;
                if (tempdata.casePhone.length != 0) {

                    this.phoneconversation(tempdata.casePhone);

                }


                this.caseCondition = tempdata.caseCondition;
                this.QuestionData = tempdata.caseQuestion;
                this.randomDateArrayEditDummy = tempdata.caseRecurring;
                this.ImageFileName = "Update Image";
                this.imagePreview = this.domainConfigUrl + "Data/cases/" + tempdata.id + tempdata.photograph;
                this.TempPhoto = this.domainConfigUrl + "Data/cases/" + tempdata.id + tempdata.photograph;
                this.ImageUpload = true;
                this.identification_num = tempdata.identification_num;;
                this.access_code = tempdata.access_code;
                this.tempcasedate = tempdata.case_date;
                this.recurringFrequency = tempdata.recurring_frequency;
                if (this.role_id == 3) {

                    this.roleuserid = tempdata.assigned_to;
                }
                this.region_id = tempdata.region_id;
                $('#Work').addClass('uib-tab nav-item active');
                localStorage.setItem('startDate', JSON.stringify(tempdata.recurring_startdate));
                localStorage.setItem('endDate', JSON.stringify(tempdata.recurring_enddate));
                this.DateConvertion()


                if (tempdata.case_date != "0001-01-01T00:00:00") {

                    // var temp1=this.convertUTCDateToLocalDate(tempdata.case_date)
                    var temp1 = new Date(tempdata.case_date)
                    //var temp1 =new Date(tempdata.case_date);  
                    var day2 = temp1.getDate();
                    var monthIndex2 = temp1.getMonth();
                    var year2 = temp1.getFullYear();
                    this.CaseDateSelect = true;
                    $("#datepicker").removeAttr("class");
                    $('#datepicker').addClass('form-control');
                    $("#datelabelerror").removeAttr("class");
                    $('#datelabelerror').addClass('col-sm-2 col-xs-4 control-label');
                    $("#rangepicker").removeAttr("class");
                    $('#rangepicker').addClass('form-control date-picker');
                    $("#datelabelerrorr").removeAttr("class");
                    $('#datelabelerrorr').addClass('col-sm-2 col-xs-4 control-label');
                    this.casedate = { date: { year: year2, month: (monthIndex2 + 1), day: day2 } };
                }
                $('#rangepicker').daterangepicker({
                    autoUpdateInput: true,
                    locale: {
                        format: 'MM-DD-YYYY',
                        cancelLabel: 'Clear'
                    },
                    separator: ' - ',
                });
                var date = new Date(tempdata.recurring_startdate);
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
                var myFormattedDate = (monthIndex + 1) + "-" + day + "-" + year;
                $('#rangepicker').data('daterangepicker').setStartDate(myFormattedDate);

                var date1 = new Date(tempdata.recurring_enddate);
                var day1 = date1.getDate();
                var monthIndex1 = date1.getMonth();
                var year1 = date1.getFullYear();
                var myFormattedDate1 = (monthIndex1 + 1) + "-" + day1 + "-" + year1;
                $('#rangepicker').data('daterangepicker').setEndDate(myFormattedDate1);
                this.caseConditionArray = [];
                if (tempdata.caseCondition.length != 0) {
                    for (var i = 0; i < tempdata.caseCondition.length; i++) {

                        this.caseConditionArray.push({ "id": tempdata.caseCondition[i].id, "desc": tempdata.caseCondition[i].desc });

                    }
                }
                this.recurringdate = true;


            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });

    }



    phoneconversation(data: any) {
        this.PhoneData = [];
        for (var i = 0; i < data.length; i++) {
            var Number = data[i].number.split(',');
            var type = "";

            if (Number[0] == 0)
                type = "Cell";
            else if (Number[0] == 1)
                type = "Home";
            else if (Number[0] == 2)
                type = "Office";

            this.PhoneData.push({ "number": Number[1], "phoneType": type, "id": data[i].id });
        }
    }
    //#endregion
    //#region Date Convertion
    public DateConvertion() {
        this.randomDateArray = new Array();
        this.caseFlag = true;

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
    convertUTCDateToLocalDate(date) {

        //UTC time 
        var ConverDate = (moment.utc().format(date));

        //local time
        var localTime = moment.utc(ConverDate).toDate();
        return localTime;
    }
    convertLocalDateToUTCDate(date) {
        var utcFormat = moment(date).utc();
        return utcFormat;
    }

    //#endregion
    //#region Number Keyboard
    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }

    //#endregion
}