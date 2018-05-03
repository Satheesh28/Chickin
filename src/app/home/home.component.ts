import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, UserService ,PagerService} from '../services/index';
declare var jquery: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'home-menu',
    templateUrl: 'Home.component.html'
})

export class HomeComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,private pagerService: PagerService) {       
    }

    ngOnInit() {
        $('#dashboard').addClass('ng-scope active');
        $("#casemanagement").removeAttr("class");
        $("#checkinmanagement").removeAttr("class");
        $("#domainassessment").removeAttr("class");
        $("#emojis").removeAttr("class");
        $("#notification").removeAttr("class");

        $('#casemanagement').addClass('ng-scope has-sub');
        $('#checkinmanagement').addClass('ng-scope has-sub');
        $('#domainassessment').addClass('ng-scope has-sub');
        $('#emojis').addClass('ng-scope has-sub');
        $('#notification').addClass('ng-scope has-sub ');
        
        $('#caselist').removeClass('ng-scope active').addClass('ng-scope');               
        $('#addcase').removeClass('ng-scope active').addClass('ng-scope ');
        $('#chekinhistory').removeClass('ng-scope active').addClass('ng-scope');               
        $('#addcheckin').removeClass('ng-scope active').addClass('ng-scope');
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
    }

}
