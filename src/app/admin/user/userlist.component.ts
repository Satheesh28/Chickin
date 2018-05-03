import { Component, OnInit } from '@angular/core';
import { UserService, PagerService, AlertService } from '../../services/index';
import { Router } from '@angular/router';
import { user } from '../user/user';
declare var $: any;

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  constructor(private userService: UserService,
    private alertService: AlertService, private pagerService: PagerService, private router: Router) { }
  public allItems: any[];
  public allItemsAdmin: any[];
  public allItemsAdminofficer: any[];
  public allItemsAdminofficerManger: any[];
  pager: any = {};
  pagerAdmin: any = {};
  pagerOfficer: any = {};
  pagerOfficerManger: any = {};
  userFilterAdmin: string = "";
  userFilterOfficer: string = "";
  userFilterOfficerManger: string = "";
  pagedItems: any[];
  userData = new user();
  region_name = "";
  total_pages = 0;
  total_pagesofficer = 0;
  total_pagesAdmin = 0;
  total_pagesofficermanger = 0;
  user = new user();
  pageNumber: any;
  PageCount: any;
  searchstring: string = "";
  userFilter: string = "";
  pageNumberAdmin: any;
  PageCountAdmin: any;
  pageNumberOfficer: any;
  PageCountOfficer: any;
  pageNumberOfficerManger: any;
  PageCountOfficerManger: any;


  //#region ngOnInit & Token Validation 
  ngOnInit() {
    this.refreshData();
    this.setPage(1);
    this.setPageAdmin(1);
    this.setPageOfficer(1);
    this.setPageOfficerManger(1);

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

  //#region  Delete User
  deleteuser(user) {
    this.userService.Deleteuser(user.id)

      .subscribe(data => {
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          this.setPage(1);
          this.setPageAdmin(1);
          this.setPageOfficer(1);
          this.setPageOfficerManger(1);
          $('.alert').css({ 'display': 'block' });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);

        } else {
          this.alertService.error(data.status, true);
          $('.alert').css({ 'display': 'block' });
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

  //#region  Get User List
  SearchListUser(userFilter, pageNumber, PageCount) {

    this.userService.getalluser(this.userFilter, this.pageNumber, this.PageCount)
      .subscribe(data => {
        this.allItems = data.listData;
        this.total_pages = data.dataCount
        this.PageLoad(this.pageNumber);
      }, err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
      });
  }
  SearchListUserAdmin(userFilterAdmin, pageNumber, PageCount) {

    this.userService.getalluserbyrole(this.userFilterAdmin, this.pageNumberAdmin, this.PageCountAdmin, 1).subscribe(data => {
      this.allItemsAdmin = data.listData;
      this.total_pagesAdmin = data.dataCount
      this.PageLoadAdmin(this.pageNumberAdmin);

    }, err => {
      var meg = JSON.parse(err._body);
      this.alertService.error(meg.status, true);
      $('.alert').css({ 'display': 'block' });
      setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
    });
  }

  SearchListUserOfficer(userFilterOfficer, pageNumber, PageCount) {
    this.userService.getalluserbyrole(this.userFilterOfficer, this.pageNumberOfficer, this.PageCountOfficer, 2).subscribe(data => {

      this.allItemsAdminofficer = data.listData;
      this.total_pagesofficer = data.dataCount
      this.PageLoadOfficer(this.pageNumberOfficer);
    }, err => {
      var meg = JSON.parse(err._body);
      this.alertService.error(meg.status, true);
      $('.alert').css({ 'display': 'block' });
      setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
    });
  }

  SearchListUserOfficerManger(userFilterOfficerManger, pageNumber, PageCount) {

    this.userService.getalluserbyrole(this.userFilterOfficerManger, this.pageNumberOfficerManger, this.PageCountOfficerManger, 3).subscribe(data => {
      this.allItemsAdminofficerManger = data.listData;
      this.total_pagesofficermanger = data.dataCount
      this.PageLoadOfficerManger(this.pageNumberOfficerManger);

    }, err => {
      var meg = JSON.parse(err._body);
      this.alertService.error(meg.status, true);
      $('.alert').css({ 'display': 'block' });
      setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
    });
  }

  //#endregion 

  //#region Set pagination
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    this.pageNumber = page;
    this.PageCount = 5;
    this.SearchListUser(this.userFilter, page, this.PageCount);

  }
  PageLoad(page: any) {
    this.pager = this.pagerService.getPager(this.total_pages, page, 5);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }




  setPageAdmin(pageAdmin: number) {
    if (pageAdmin < 1 || pageAdmin > this.pagerAdmin.totalPages) {
      return;
    }
    this.pageNumberAdmin = pageAdmin;
    this.PageCountAdmin = 5;
    this.SearchListUserAdmin(this.userFilterAdmin, pageAdmin, this.PageCountAdmin);

  }
  PageLoadAdmin(pageAdmin: any) {

    this.pagerAdmin = this.pagerService.getPager(this.total_pagesAdmin, pageAdmin, 5);

    var user = this.allItemsAdmin.slice(this.pagerAdmin.startIndex, this.pagerAdmin.endIndex + 1);
  }


  setPageOfficer(pageOfficer: number) {
    ;
    if (pageOfficer < 1 || pageOfficer > this.pagerOfficer.totalPages) {
      return;
    }
    this.pageNumberOfficer = pageOfficer;
    this.PageCountOfficer = 5;
    this.SearchListUserOfficer(this.userFilter, pageOfficer, this.PageCountOfficer);

  }
  PageLoadOfficer(pageOfficer: any) {

    this.pagerOfficer = this.pagerService.getPager(this.total_pagesofficer, pageOfficer, 5);
    var allI = this.allItemsAdminofficer.slice(this.pagerOfficer.startIndex, this.pagerOfficer.endIndex + 1);
  }




  setPageOfficerManger(pageOfficerManger: number) {
    if (pageOfficerManger < 1 || pageOfficerManger > this.pagerOfficerManger.totalPages) {
      return;
    }

    this.pageNumberOfficerManger = pageOfficerManger;
    this.PageCountOfficerManger = 5;
    this.SearchListUserOfficerManger(this.userFilterOfficerManger, pageOfficerManger, this.PageCountOfficerManger);

  }
  PageLoadOfficerManger(pageOfficerManger: any) {

    this.pagerOfficerManger = this.pagerService.getPager(this.total_pagesofficermanger, pageOfficerManger, 5);
    var pagedIs = this.allItemsAdminofficerManger.slice(this.pagerOfficerManger.startIndex, this.pagerOfficerManger.endIndex + 1);
  }

  //#endregion

  //#region Show User
  showUser(user_info: any) {
    this.region_name = "";

    this.userData = user_info;

    this.userService.getregion(user_info.region_id).subscribe(data => {
      this.region_name = data.objData.desc;
    });
    $('#userModal').modal('show');
  }

  //#endregion

}
