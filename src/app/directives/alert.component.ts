import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService } from '../services/index';

declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
    message: any;

    constructor(private alertService: AlertService,
        @Inject(DOCUMENT) private document: Document) { }

    ngOnInit() {
        debugger;
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }

    CloseAlert() {
        $('.alert').css({ "display": "none" });
    } 
}