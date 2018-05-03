import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
 import { LoginComponent } from './login/login.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentListComponent } from './assessment/assessmentlist.component';
import { CaseComponent } from './case/case.component';
import { CaseDetailsComponent } from './case/casedetails.component';
import { CaseListComponent } from './case/caselist.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckinListComponent } from './checkin/checkinlist.component';
import { EmojiListComponent } from './emoji/emojilist.component';
import { NotificationComponent } from './notification/sendnotification.component';
import { AllNotificationComponent } from './notification/allnotification.component';
import { OfficerDashboardComponent } from './officerdashboard/officerdashboard.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
 
import { HeaderComponent } from './Header/header.component';
import { FooterComponent } from './Footer/footer.component';
import { TermsConditionsComponent } from './termsconditions/termsconditions.component';
import {UserComponent} from './admin/user/user.component';
import { UserlistComponent } from './admin/user/userlist.component';
import {RegionComponent} from './admin/region/region.component';
import {ConditionComponent} from './admin/condition/condition.component';
import { QuestionComponent } from './admin/question/question.component';
import { ModuleWithProviders }  from '@angular/core';
const appRoutes: Routes = [
    { path: '', redirectTo: "/Login", pathMatch: 'full' },
    { path: 'App', component: AppComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent},
  //  children: [
      { path: 'case', component: CaseComponent },
      { path: 'casehistory', component: CaseListComponent },
      { path: 'casedetails', component: CaseDetailsComponent },
      { path: 'checkin', component: CheckinComponent },
      { path: 'checkinhistory', component: CheckinListComponent },
      { path: 'assessment', component: AssessmentComponent },  
      { path: 'assessmenthistory', component: AssessmentListComponent },  
      { path: 'emojihistory', component: EmojiListComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'notificationhistory', component: AllNotificationComponent },
      { path: 'officerdashboard', component: OfficerDashboardComponent },
      { path: 'editprofile', component: EditProfileComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'termsconditions', component: TermsConditionsComponent }, 
      { path: 'user', component: UserComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'userdetails', component: UserlistComponent },
      {path:'region',component:RegionComponent},
      {path:'region/:id',component:RegionComponent},
      {path:'condition',component:ConditionComponent},
      {path:'condition/:id',component:ConditionComponent},
      { path: 'question', component: QuestionComponent }, 
      { path: '**', redirectTo: '/NotFound' }
   //  ]
     
];

export const routing :ModuleWithProviders= RouterModule.forRoot(appRoutes, { 
    enableTracing: false
});


