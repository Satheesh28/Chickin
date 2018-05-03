import {
    Component, ChangeDetectorRef, NgModule, OnInit, Input, forwardRef,
    Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService, AuthenticationService } from '../services/index';
import { BrowserModule } from '@angular/platform-browser'
import {
    FormGroup, FormBuilder, Validators, ControlValueAccessor,
    FormControl, NG_VALIDATORS, AbstractControl, ValidatorFn, NG_VALUE_ACCESSOR
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styles: ['.pagination { margin: 0px !important; }']
})


export class LoginComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
    }

    //#region Variable Declare

    form: FormGroup;
    loading = false;
    model: any = {};
    userName: string;
    password: string;
    public UserInfoId: number;
    public Firstname: string;
    public Lastname: string;
    public Emailid: string;
    public DOB: Date;
    public Gender: number;
    public Profile: string;
    public Address1: string;
    public Address2: string;
    public Contactno: string;
    public Countryid: number;
    public Stateid: number;
    public Zipcode: string;
    public Status: boolean;
    public RoleName: string;
    public Message: string;
    public Username: string;
    public Password: string;
    //#endregion
    //#region ngOnInit

    ngOnInit() {
        $('body').removeClass('page-body').addClass('page-body login-page');
    }
    //#endregion
    //#region Login Method  
    login() {
        var data = {
            "username": this.userName,
            "password": this.password,
        };

        this.userservice.postlogin(data)
            .subscribe(data => {

                if (data.status == 'Success') {
                    localStorage.setItem('Authorization', JSON.stringify(data.listData[0].token));
                    localStorage.setItem('id', JSON.stringify(data.listData[0].id));
                    localStorage.setItem('role', JSON.stringify(data.listData[0].role_id));

                    this.alertService.success(data.status, true);
                    $('.alert').css({ "display": "block" });
                    if (data.listData[0].role_id == "1") {
                        window.location.href = '/userdetails';
                    }
                    else {
                        window.location.href = '/officerdashboard';
                    }

                }
                else if (data.status == 'Username & password does not match') {
                    this.alertService.error(data.status);
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
}
