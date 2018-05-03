import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService, UserService, PagerService } from '../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  tabs = [];
  categoryname: string;
  domainid: number;
  QuestionData: any;
  workstatus: boolean;
  tabdata() {
    this.tabs = [{
      name: 'Work',
      domain_id: 1,
      cat: 'work'
    }, {
      name: 'Education',
      domain_id: 2,
      cat: 'education'
    }, {
      name: 'Health',
      domain_id: 3,
      cat: 'health'
    }, {
      name: 'Relationships',
      domain_id: 4,
      cat: 'relationships'
    }, {
      name: 'Community',
      domain_id: 5,
      cat: 'community'
    }, {
      name: 'Creativity',
      domain_id: 6,
      cat: 'creativity'
    }];


  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userservice: UserService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService, private pagerService: PagerService
  ) { }

  //#region ngOnInit & Token Validation
  ngOnInit() {
    this.refreshData();
    this.domainid = 1;
    this.tabdata();
    this.getquestiondata();
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

  //#region Get Question List
  getquestiondata() {
    this.userservice.getallquestiondata()
      .subscribe(data => {

        this.QuestionData = data.listData;

        $('#Work').removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');
      });

  }

  //#endregion 

  //#region Question Add
  addQuestion() {
    this.workstatus = true;
    this.QuestionData.push({ "desc": "", "score": "", "id": 0, "domain_id": this.domainid, "is_new": true });

  }
  workchange(i: string, question: string) {

    this.QuestionData[i].desc = question;

  }
  workscore(i: string, score: number) {
    this.QuestionData[i].score = score;
  }

  //#endregion

  //#region  Delete Question
  delete_question(i: number) {

    let q = this.QuestionData[i];
    this.userservice.deleteQuestion(q.id).subscribe(data => {
      if (data.operationSatus) {
        this.getquestiondata();
        this.alertService.success(data.status, true);

        $('.alert').css({ "display": "block" });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        this.router.navigate(['/question']);

      } else {
        this.alertService.error('insert has been failed !');
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

  //#region  Save Question
  save_question(i: number) {
    let q = this.QuestionData[i];
    let QuestionData: boolean = false

    if (q.desc != "" && q.score != "") {

      QuestionData = true;
      q = [];
      q.push(this.QuestionData[i]);
    }
    else if (q.desc != "" && q.score == "") {
      QuestionData = true;
      q = [];
      q.push({ "desc": this.QuestionData[i].desc, "score": "0", "id": 0, "domain_id": this.QuestionData[i].domain_id, "is_new": this.QuestionData[i].is_new });

    }
    else {
      QuestionData = false;
    }


    if (QuestionData == true) {
      if (q[0].is_new == undefined || q[0].is_new == false) {
        this.userservice.putQuestiondata(q[0]).subscribe(data => {
          if (data.operationSatus) {
            this.alertService.success(data.status, true);
            this.getquestiondata();
            $('.alert').css({ "display": "block" });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            this.router.navigate(['/question']);
          } else {
            this.alertService.error('insert has been failed !');
            $('.alert').css({ "display": "block" });
          }
        }, err => {
          var meg = JSON.parse(err._body);
          this.alertService.error(meg.status, true);
          $('.alert').css({ 'display': 'block' });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        });
      } else {
        this.userservice.postQuestiondata(q[0]).subscribe(data => {

          if (data.operationSatus) {
            this.alertService.success(data.status, true);
            this.getquestiondata();
            $('.alert').css({ "display": "block" });

            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            this.router.navigate(['/question']);

          } else {
            this.alertService.error('insert has been failed !');
            $('.alert').css({ "display": "block" });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
          }


        });
      }
    }
    else {
      this.alertService.error('Please Enter Question Desc and Score');
      $('.alert').css({ "display": "block" });
      setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
    }

  }
  //#endregion

  //#region  Tab Change
  Questiondata(data: string, cat: string, domainid: number) {
    this.categoryname = cat;
    this.domainid = domainid;


    for (var i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].domain_id == domainid) {
        this.domainid = this.tabs[i].domain_id;
        $('#' + data).removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');
      } else {
        $('#' + this.tabs[i].name).removeClass('uib-tab nav-item active').addClass('uib-tab nav-item');
      }
    }
  }

  //#endregion

}
