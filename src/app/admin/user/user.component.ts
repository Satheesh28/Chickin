import { Component, OnInit } from '@angular/core';
import { UserService, AlertService } from '../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../user/user';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private user_id: String;
  isEdit: boolean = false;
  operation_type = "Add";
  user = new user();
  constructor(private userService: UserService,
    private route: ActivatedRoute, private alertService: AlertService, private router: Router) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.user_id = params['id'];
        this.operation_type = "Update";
      }
    
    });

  } 
  regions = [];
  roles = [];
 
  ngOnInit() {
    this.refreshData();


    this.userService.getallregion().subscribe(data => {
      this.regions = data.listData;
    },err => {
      var meg = JSON.parse(err._body);
      this.alertService.error(meg.status, true);
      $('.alert').css({ 'display': 'block' });
      setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
    }); 


    this.userService.getallrole().subscribe(data => {
      this.roles = data.listData[0];
    
    },err => {
      var meg = JSON.parse(err._body);
      this.alertService.error(meg.status, true);
      $('.alert').css({ 'display': 'block' });
      setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
    }); 


    if (this.isEdit) {
      this.userService.getuser(this.user_id).subscribe(data => {
        this.user = data.listData[0][0];
      
      },err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
      }); 
    }


  }


  refreshData() {
    var Authorization = JSON.parse(localStorage.getItem('Authorization'));
    var id = JSON.parse(localStorage.getItem('id'));
   
    if (Authorization != null && id != null) {
        } else {
            this.router.navigate(['/login']);
        }
    }


  onSubmit(form) {
    if (this.isEdit) {
      this.userService.putuser(this.user).subscribe(data => {
    
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
        } else {
          this.alertService.error(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
        }
        this.router.navigate(['/userdetails']);
      },err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
      }); 

    } else if (form.valid) {
      this.userService.postuser(this.user).subscribe(data => {
      
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
        } else {
          this.alertService.error(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function(){ $('.alert').css({ "display": "none" }); }, 3000);
        }
        this.router.navigate(['/userdetails']);
      });
    }


  }
}
