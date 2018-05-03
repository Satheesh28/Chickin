import { Component, OnInit } from '@angular/core';
import { UserService, PagerService, AlertService } from '../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Region } from '../region/region';
import { Observable } from 'rxjs/Observable';
declare var $: any;
@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  isEdit: boolean = false;
  private region_id: number;
  regions: Region[];
  region = new Region();
  allItems: any[];
  userFilter: string = '';
  pager: any = {};
  pagedItems: any[];
  pageNumber: any;
  allItemsDataCount: any;
  PageCount: any;
  default_pageSize = 10;
  constructor(private userService: UserService, private route: ActivatedRoute,
    private pagerService: PagerService, private alertService: AlertService, private router: Router) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.region_id = params['id'];
        this.userService.getregion(this.region_id).subscribe(data => {
          this.region = data.objData;
        });
      }

    });


  }

  //#region  ngOnInit & Token Validation
  ngOnInit() {

    this.refreshData();
    this.region = new Region();
    if (this.isEdit) {
    }
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

  //#region  Get List Items
  SearchList(searchstring, pageNumber, PageCount) {

    this.userService.getallregions(this.userFilter, this.pageNumber, this.PageCount)
      .subscribe(data => {
        this.regions = data.listData;
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
    this.pagedItems = this.regions.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  //#region Delete Item
  deleteregion(id: number) {
    this.userService.deleteregion(id)

      .subscribe(data => {
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          this.setPage(1);
          $('.alert').css({ 'display': 'block' });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
          this.router.navigate(['/region']);

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

  //#region Save Item
  save_region() {
    if (this.isEdit) {
      this.userService.putregion(this.region).subscribe(data => {
        const id = this.region['id'];

        for (let i = 0; i < this.regions.length; i++) {
          if (this.regions[i]['id'] === id) {
            this.regions[i].desc = this.region.desc;
          }
        }
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
          this.region = new Region();
          this.router.navigate(['/region']);
        } else {
          this.alertService.error(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        }


      }, err => {
        var meg = JSON.parse(err._body);
        this.alertService.error(meg.status, true);
        $('.alert').css({ 'display': 'block' });
        setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
      });
    } else {
      this.userService.postregion(this.region).subscribe(data => {
        this.region['id'] = data.listData[0];
        this.regions.push(this.region);
        if (data.operationSatus) {
          this.alertService.success(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
          this.region = new Region();

        } else {
          this.alertService.error(data.status, true);
          $('.alert').css({ "display": "block" });
          setTimeout(function () { $('.alert').css({ "display": "none" }); }, 3000);
        }
        this.router.navigate(['/region']);
      });
    } 
  }

  //#endregion
}
