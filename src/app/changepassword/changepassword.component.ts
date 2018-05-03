import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService, PagerService } from '../services/index';
import { changepassword } from '../changepassword/changepassword'; 
declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    templateUrl: 'changepassword.component.html'
})

export class ChangePasswordComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, private pagerService: PagerService) {
    }
    //#region Varibles Declare
    changepassword = new changepassword();
    public id: string;
    public email: string;
    public password: string;
    public oldPassword: string;
    public retype: any;
    public matchpassword: boolean;
    //#endregion
    //#region  ngOnInit & Token Validation
    ngOnInit() {
        this.refreshData();
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
    //#region Password Match
    checkpassword(checkinpass: string) {
        if (this.retype == checkinpass) {
            this.matchpassword = true;

        }
        else {
            this.matchpassword = false;
        }
    }
    checkpassword1(checkinpass: string) {
        if (this.password == checkinpass) {
            this.matchpassword = true;

        }
        else {
            this.matchpassword = false;
        }
    }

    //#endregion

    //#region Password Save Method
    savepassword() {
        var data = {
            "password": this.oldPassword,  //Old Password
            "newpassword": this.password   //New Password
        };
        this.userservice.postpassword(data)
            .subscribe(data => {
                if (data.status == 'Password updated successfuly!') {
                    this.alertService.success(data.status, true);
                    $('.alert').css({ "display": "block" });
                    setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                    var GetRole=localStorage.getItem('role');
                    if (GetRole == "1") {
                        this.router.navigate(['/userdetails']);
                    }
                    else {
                        this.router.navigate(['/officerdashboard']);
                    }
                    
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
    //#endregion

}
