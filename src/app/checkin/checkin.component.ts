import { Component, OnInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { checkin } from '../checkin/checkin';
import * as _ from 'underscore';
import { AppConfig } from '../app.config';
import { from } from 'rxjs/observable/from';
declare var jquery: any;
declare var $: any;

@Component({
    selector: module.id,
    templateUrl: './checkin.component.html',
})
    export class CheckinComponent implements OnInit {


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private config: AppConfig,
        private ng2ImgMax: Ng2ImgMaxService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService, public sanitizer: DomSanitizer) {

    }

    //#region Variable Declare
    imagePreview: string;
    domainConfigUrl = this.config.domain1;
    LatLanDiv: Boolean = false;
    LatLanImg: Boolean = false;
    ImageFileName: any;
    uploadedImage1: File;
    RecurringList: any = {};
    CaseList: any = {};
    filesToUpload: Array<File>;
    public logo: any;
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    public caseid: string; public notes: string;
    public location: string; public decesion: string;
    public image: string; public dueDate: string;
    public rcurringid: string;
    NotesData: any;
    CaseCondtion: any;
    ImageUpload: Boolean;
    CheckCondtions: Boolean;
    search: string = "";
    public id: string;
    public photo: string;
    public longlat: string;
    public comment: string;
    public case_id: string;
    public UploadImage: any;
    checkin = new checkin();
    CheckinEnable: Boolean
    public CheckinEnableTrue: Boolean = false;
    checkinCondition: any;
    logoLat: any;
    submithide: boolean;
    title: any;
    CheckinList: any = {};
    caseCondtion: any;
    //#endregion
    //#region  ngOnInit & Token Validation
    ngOnInit() {
        this.refreshData();
        this.title = "Enter checkin data";
        this.ImageFileName = "Select Image";
        this.CheckinEnable = false;
        this.imagePreview = '../../assets/img/whitey.jpg';
        this.ImageUpload = false;
        this.CheckCondtions = false;
        this.CheckinEnableTrue = false;
        this.submithide = false;
        $("#dashboard").removeAttr("class");
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");
        $('#editprofile').removeAttr("class");

        $('#dashboard').addClass('ng-scope');
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope opened has-sub active');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');

        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope');
        $('#addcheckin').removeClass('ng-scope').addClass('ng-scope active');
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
        this.checkinCondition = [];
        this.NotesData = []; this.CaseCondtion = [];
        this.AllCase();
        this.NotesData.push({ "comment": "", "id": "" });
        var data = JSON.parse(localStorage.getItem('ViewCheckin'));
        if (data != null) {
            this.title = "View checkin data";
            this.LatLanImg = true;
            this.viewcheckin(data.id);
            localStorage.removeItem('ViewCheckin');
            this.ImageFileName = "";
        }
        else {
            this.LatLanDiv = true;
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

    //#region Get All Case List
    AllCase() {
        this.userservice.getcase(this.search, 1, 100)
            .subscribe(data => {
                this.CaseList = data.listData;
            });
    }

    //#endregion

    //#region Image Upload
    getImagePreview(file: File) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        this.ImageUpload = true;
        reader.onload = (e: any) => {
            this.imagePreview = reader.result;

            var svc = this.imagePreview.replace("data:" + file.type + ";base64,", "");
            this.UploadImage = svc;
            this.ImageFileName = "Select Image";
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
                    var svc = e.target.result.replace("data:image/" + ext + ";base64,", "");
                    this.UploadImage = svc;
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
                let ext;
                if (image1 != undefined) {
                    if (image1.type == 'image/jpeg') {
                        ext = "jpeg";
                    } else if (image1.type == 'image/jpeg') {
                        ext = "png";
                    }
                    if (image1.type == "image/jpeg" || image1.type == "image/jpeg" || image1.type == "image/png") {

                        let reader = new FileReader();
                        this.ng2ImgMax.compress([fileInput.target.files[0]], 0.3).subscribe(
                            result => {
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

    //#region Case Question Select 
    caseSelected(selectedCase: any) {
        this.userservice.getcaseid(selectedCase)
            .subscribe(data => {
                this.caseCondtion = data.listData[0].caseCondition;
                this.checkinCondition = [];
                for (var i = 0; i < this.caseCondtion.length; i++) {

                    this.checkinCondition.push({ "id": 0, "checkin_id": this.caseCondtion[i].id, "desc": this.caseCondtion[i].desc, "agreed": false });

                }

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }

    condtioncheck(i: number) {
        this.checkinCondition[i].agreed = this.checkinCondition[i].agreed == false ? true : false;

    }
    //#endregion

    //#region Add Notes
    addNewNote() {
        this.NotesData.push({ "comment": "", "id": "" });

    }
    changenotes(i: string, notes: string) {
        this.NotesData[i].notes = notes;

    }
    deleteNote(i: number) {
        this.NotesData.splice(i, 1);

    }
    //#endregion

    //#region View Checkin
    viewcheckin(id: any) {
 
        this.userservice.getcheckinid(id)
            .subscribe(data => {
                this.submithide = true;
                this.CheckinList = data.objData;
                this.case_id = this.CheckinList.case_id;

                this.comment = this.CheckinList.comment;
                this.longlat = this.CheckinList.longlat;
                this.logoLat = "http://maps.googleapis.com/maps/api/staticmap?autoscale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C" + this.longlat;
                this.CheckinEnable = true;
                this.CheckinEnableTrue = false
                var ImgUrl = this.domainConfigUrl + "Data/cases/" + this.CheckinList.case_id + this.CheckinList.photo;
                this.imagePreview = ImgUrl;
                this.caseCondtion = this.CheckinList.checkinCondition;
            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
    //#region Save Checkin Methos
    savecheckin() {

        this.checkin.comment = this.comment;
        this.checkin.case_id = this.case_id;
        this.checkin.photo = this.UploadImage;
        this.checkin.longlat = this.longlat;
        this.checkin.checkinCondition = this.checkinCondition;
        this.userservice.postcheckin(this.checkin)
            .subscribe(data => {

                if (data.status == 'Checkin added successfully') {
                    this.alertService.success(data.status, true);
                    $('.alert').css({ "display": "block" });
                    setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                    this.router.navigate(['/checkinhistory']);
                }
                else {
                    this.alertService.error('checkin Added failed !');
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
    //#endregion
    //#region Browser Check

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


