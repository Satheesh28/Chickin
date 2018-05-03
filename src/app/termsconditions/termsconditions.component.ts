import {
    Component, ChangeDetectorRef, NgModule, OnInit, Input, forwardRef,
    Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
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
    templateUrl: 'termsconditions.component.html',
    styles: ['.pagination { margin: 0px !important; }']
})


export class TermsConditionsComponent {
 
    constructor(
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
       
    }  
    
}
