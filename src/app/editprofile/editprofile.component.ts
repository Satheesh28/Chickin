import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    templateUrl: 'editprofile.component.html'
})

export class EditProfileComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
    }
    //#region Variable Declare
    UserdataList: any = {};
    userName: any;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region_id: number;
    role_id: number;
    //#endregion

    //#region ngOnInit & Toekn Validation
    ngOnInit() {
        this.refreshData();
        $('#dashboard').removeAttr("class");
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");

        $('#dashboard').addClass('ng-scope');
        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope has-sub ');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope opened has-sub ');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#editprofile').addClass('ng-scope has-sub active');

        $('#caselist').removeClass('ng-scope active').addClass('ng-scope ');
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

        this.userdata();
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

    //#region  Get User Profile Data
    userdata() {
        this.userservice.getuserdata()
            .subscribe(data => {
                this.UserdataList = data.listData[0][0];
                this.firstName = this.UserdataList.first_name;
                this.lastName = this.UserdataList.last_name;
                this.userName = this.UserdataList.username;
                this.email = this.UserdataList.email;
                this.phone = this.UserdataList.phone;
                this.role_id = this.UserdataList.role_id;
                this.region_id = this.UserdataList.region_id;

            }, err => {
                var meg = JSON.parse(err._body);
                this.alertService.error(meg.status, true);
                $('.alert').css({ 'display': 'block' });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            });
    }
    //#endregion
    //#region Profile Update
    UpdateProfile() {
        var profile = {
            "phone": this.phone,
            "email": this.email,
            "first_name": this.firstName,
            "last_name": this.lastName
        }
        this.userservice.updateprofile(profile).subscribe(data => {
            if (data.status == 'Profile updated successfuly!') {
                this.alertService.success(data.status, true);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                window.location.href = '/officerdashboard';
            }
            else {
                this.alertService.error(data.status);
                $('.alert').css({ "display": "block" });
                setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            }
        }, err => {
            var meg = JSON.parse(err._body);
            this.alertService.error(meg.status, true);
            $('.alert').css({ 'display': 'block' });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        });
    }

    onvalidate(Name: any) {
        var element = <HTMLInputElement>document.getElementById("editprofile");
        if ((Name || '').trim().length === 0) {

            element.disabled = true;
        }
        else {
            element.disabled = false;
        }
    }

    //#endregion

}
