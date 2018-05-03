import { Component, OnInit } from '@angular/core';
import { UserService, PagerService, AlertService } from '../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Condition } from './condition';
import { Region } from '../region/region';
declare var $: any;
@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit {
  isEdit: boolean = false;
  private region_id: number;
  regions;
  region = new Condition();
  userFilter: string = '';
  pager: any = {};
  pagedItems: any[];
  allItems = [];
  allItemsDataCount: any;
  PageCount: any;
  default_pageSize = 5;
  pageNumber: any;
  constructor(private userService: UserService, private route: ActivatedRoute,
    private pagerService: PagerService, private alertService: AlertService, private router: Router) {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.region_id = params['id'];

        this.userService.getcondition(this.region_id).subscribe(data => {

          this.region = data.objData;

        });

      }

    });


  }

  //#region ngOnInit & Token Validation
  ngOnInit() {
    this.refreshData();
    this.region = new Condition();
    this.setPage(1);
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

  //#region  Get List 
  SearchList(userFilter, pageNumber, PageCount) {

    this.userService.getallconditions(this.userFilter, this.pageNumber, this.PageCount)
      .subscribe(data => {
        this.allItems = data.listData;
        this.allItemsDataCount = data.dataCount;
        this.PageLoad(this.pageNumber);
      }, err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
      });
  }
  //#endregion

  //#region Pagination
  PageLoad(page: any) {

    this.pager = this.pagerService.getPager(this.allItemsDataCount, page, this.default_pageSize);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  setPage(page: number) {

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.PageCount = this.default_pageSize;
    this.SearchList(this.userFilter, page, this.PageCount);

  }
  //#endregion

  //#region Delete Condition
  delete_condition(id: number) {
    this.userService.deletecondition(id).subscribe(data => {
      if (data.operationSatus) {
        this.alertService.success(data.status, true);
        this.setPage(1);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        this.router.navigate(['/condition']);
      } else {
        this.alertService.error(data.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
      }
    });
  }

  //#endregion

  //#region  Save Condition
  save_region() {
    if (this.isEdit) {
      this.userService.putcondition(this.region).subscribe(data => {
        const id = this.region['id'];

        for (let i = 0; i < this.allItems.length; i++) {
          if (this.allItems[i]['id'] === id) {
            this.allItems[i].desc = this.region.desc;
          }

          if (data.operationSatus) {
            this.alertService.success(data.status, true);
            $('.alert').css({ 'display': 'block' });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
            this.router.navigate(['/condition']);
          } else {
            this.alertService.error(data.status, true);
            $('.alert').css({ 'display': 'block' });
            setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
          }

        }
        this.region = new Region();
      }, err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
      });
    } else {
      this.userService.postcondition(this.region).subscribe(data => {
        this.region['id'] = data.listData[0];
        this.allItems.push(this.region);
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          $('.alert').css({ 'display': 'block' });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        }
        else {
          this.alertService.error(data.status, true);
          $('.alert').css({ 'display': 'block' });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        }
        this.region = new Region();
        this.router.navigate(['/condition']);
      });
    }

  }
  //#endregion
}
