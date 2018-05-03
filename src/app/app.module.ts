import { NgModule, forwardRef,VERSION,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';
import { AlertComponent } from './directives/index';
import { AuthGuard } from './guards/index';
import { AlertService, AuthenticationService, UserService,PagerService } from './services/index';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentListComponent } from './assessment/assessmentlist.component';
import { CaseComponent } from './case/case.component';
import { CaseListComponent } from './case/caselist.component';
import { CaseDetailsComponent } from './case/casedetails.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckinListComponent } from './checkin/checkinlist.component';
import { EmojiListComponent } from './emoji/emojilist.component';
import { NotificationComponent } from './notification/sendnotification.component';
import { AllNotificationComponent } from './notification/allnotification.component';
import { OfficerDashboardComponent } from './officerdashboard/officerdashboard.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
 
import { AgmCoreModule } from '@agm/core'; 
import { Pipe, PipeTransform } from '@angular/core'; 
 
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { SelectModule } from 'ng2-select';
import SlimSelect from 'slim-select'
import { TermsConditionsComponent } from './termsconditions/termsconditions.component';
import { HeaderComponent } from './Header/header.component';
import { FooterComponent } from './Footer/footer.component';
import { UserComponent } from './admin/user/user.component';
import { UserlistComponent } from './admin/user/userlist.component';
import { RegionComponent } from './admin/region/region.component';
import { ConditionComponent } from './admin/condition/condition.component';
import { QuestionComponent } from './admin/question/question.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule({
   
    schemas: [ NO_ERRORS_SCHEMA],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        Ng2ImgMaxModule,
     
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD7i3hNIx6vLaBNZBeNT2n0z6YftkKuots'
          }),    
          NgxMyDatePickerModule.forRoot(),   
          SelectModule    
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,       
        LoginComponent,    
        CaseComponent,
        CaseDetailsComponent,
        CaseListComponent,
        CheckinComponent,
        CheckinListComponent,
        AssessmentComponent,
        AssessmentListComponent,
        EmojiListComponent,
        NotificationComponent,
        AllNotificationComponent,
        OfficerDashboardComponent,
        EditProfileComponent,
        ChangePasswordComponent,
        
        TermsConditionsComponent,
        HeaderComponent,
        FooterComponent,
        UserComponent,
        UserlistComponent,
        RegionComponent,
        ConditionComponent,
        QuestionComponent
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        PagerService,
        
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }

