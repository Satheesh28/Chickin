import {
    Component, ChangeDetectorRef, NgModule, OnInit, Input, forwardRef,
    Output, EventEmitter, AfterViewInit, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, UserService } from './services/index';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser'
import {
    FormGroup, FormBuilder, Validators, ControlValueAccessor,
    FormControl, NG_VALIDATORS, AbstractControl, ValidatorFn, NG_VALUE_ACCESSOR
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
declare var jquery: any;
declare var $: any;
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import SlimSelect from 'slim-select'
import { user } from './admin/user/user';
import { HeaderComponent } from './Header/header.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

    public ShowHideRoute: boolean = true;
    user_profile = new user();
    isAdmin = false;
    isprofileset = false;
    isUser = true;
    public UserInfoId: number;
    public Username: string;
    public ProductCount: number;
    public Subtotal: number;
    public GrandTotal: number;
    ShopDataList: any = [];
    public Productlength: number;
    public Login: boolean;
    private headers: HttpHeaders;
    constructor(
        private router: Router,

        private authenticationService: UserService,
        private userService: UserService,
        private alertService: AlertService) {
    }
    isValid: boolean;
    interval: any;
    ngOnInit() {
        if (window.location.pathname != "/termsconditions") {
            var Authorization = JSON.parse(localStorage.getItem('Authorization'));
            var id = JSON.parse(localStorage.getItem('id'));
            if (Authorization != null && id != null) {
                this.Userdata();
            } else {
                this.router.navigate(['/login']);
            }
        }
    }
    name: any;
    userName: any;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region_id: number;
    role_id: number;
    UserdataList: any = {};
    PageRefresh() {
        location.reload();
        this.router.navigate(['/officerdashboard']);
    }
    Userdata() {
        var Login = JSON.parse(localStorage.getItem('id'));
        if (Login != null) {
            this.userService.getuserdata()
                .subscribe(data => {

                    if (data.listData.length != 0) 
                    {
                        if (data.listData[0][0].role_id === 1) {
                            this.isAdmin = false;
                            this.isUser = false;
                            this.isprofileset = true;
                            $('#main-menu1').css('display', 'block');
                        }
                        else {
                            this.isAdmin = true;
                            this.isUser = true;
                            $('#main-menu').css('display', 'block');
                        }

                        this.UserdataList = data.listData[0][0];
                        this.firstName = this.UserdataList.first_name;
                        this.lastName = this.UserdataList.last_name;
                        this.email = this.UserdataList.email;
                        this.phone = this.UserdataList.phone;
                        this.role_id = this.UserdataList.role_id;
                        this.region_id = this.UserdataList.region_id;
                    }
                    else {
                        localStorage.removeItem('Authorization');
                        localStorage.removeItem('id');
                        this.router.navigate(['/login']);
                    }

                }, err => {
                    localStorage.removeItem('Authorization');
                    localStorage.removeItem('id');
                    this.router.navigate(['/login']);
                    // var meg = JSON.parse(err._body);
                    // this.alertService.error(meg.status, true);
                    // $('.alert').css({ 'display': 'block' });
                    // setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
                });
        }
    }
    changeOfRoutes() {
        if (window.location.pathname == "/login") {
            ;
            this.Login = true;
            $('#Toggle1').css('display', 'none');
            $('#Toggle2').css('display', 'none');
            $('#removedmenu').removeClass('page-container');
            $('#removedmenu1').removeClass('page-container');
            $('#main-menu').removeClass('main-content');
            $('#navmenu').css('display', 'none');
        }
        else if (window.location.pathname == "/termsconditions") {
            this.Login = false;
            $('#Toggle1').css('display', 'none');
            $('#Toggle2').css('display', 'none');
            $('#removedmenu').removeClass('page-container');
            $('#removedmenu1').removeClass('page-container');
            $('#main-menu').removeClass('main-content');
            $('#navmenu').css('display', 'none');
        }


    }


    logout() {
        localStorage.removeItem('id');
        localStorage.removeItem('Authorization');
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        localStorage.removeItem('NotifyViewCase');
        localStorage.removeItem('sendnotificationcaseid');
        this.router.navigate(['/login']);
    }
    navminmize() {
        $("#ulcasemanagement").removeAttr("style");
        $("#ulcheckinmanagement").removeAttr("style");
        $("#uldomainassessment").removeAttr("style");
        $("#ulemojis").removeAttr("style");
        $("#ulnotification").removeAttr("style");
    }

    logoutview() {
        $('#logoutview').removeClass('dropdown user-profile').addClass('dropdown user-profile open');
    }



}

