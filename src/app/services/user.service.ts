import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppConfig } from '../app.config';
import { checkin } from '../checkin/checkin';
import {Observable } from 'rxjs/Observable';


@Injectable()
export class UserService {
    constructor(private http: Http, private config: AppConfig) { }

    // private admin_headers = new Headers({'Content-Type': 'application/json; charset=utf-8', 
    // 'Authorization': 'Bearer ' +this.config.Authorization,
    // 'Accept': 'application/json, text/plain',
    //  'x-api-key': this.config.xapikey});


     private headers1 = new Headers({'Content-Type': 'application/json; charset=utf-8', 
     'Authorization': 'Bearer ' + this.config.Authorization,
     'Accept': 'application/json, text/plain',
      'x-api-key': this.config.xapikey});

    getallcondtion(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getcondtion ,options).map((response: Response) => {
            return response.json();
        });
    }
    getallregion(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getregion ,options).map((response: Response) => {
            return response.json();
        });
    }
    getregionID(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.domain + 'region/' +id   ,options).map((response: Response) => {
            return response.json();
        });   
    }
    
    getalldominquestion(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getalldominquestion, options).map((response: Response) => {
            return response.json();
        }); 
    }
    getuserdata(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getprofile, options).map((response: Response) => {
            return response.json();
        }); 
    }
    getuserrole(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getuserrole, options).map((response: Response) => {
            return response.json();
        });  
    }
    postpassword(data:any){
        let options = new RequestOptions({ headers: this.headers1 });   
        let body = JSON.stringify(data);
        return this.http.put(this.config.updatepassword , body,options).map((response: Response) => {
            return response.json();
        }); 
    }
   
    postlogin(data:any){
        let options = new RequestOptions({ headers: this.headers1 });   
        let body = JSON.stringify(data); 
        return this.http.post(this.config.domain+"User/login",body,options).map((response: Response) => {
            return response.json();
        }); 
    }
    postcase(data:any){
     let options = new RequestOptions({ headers: this.headers1 });   
        let body = JSON.stringify(data);
        return this.http.post(this.config.addcase,body,options).map((response: Response) => {
            return response.json();
        }); 
    }
    putcase(data:any){
        let options = new RequestOptions({ headers: this.headers1 });   
           let body = JSON.stringify(data);
           return this.http.put(this.config.updatecase,body,options).map((response: Response) => {
               return response.json();
           }); 
       }
    getcase(searchString :any,PageNum:any,PageCount:any) {
        
           let options = new RequestOptions({ headers: this.headers1  });  
           return this.http.get(this.config.getcase+"?pageNumber="+PageNum+"&pageSize="+PageCount+"&FullName="+searchString,options).map((response: Response) => {
               return response.json();
           });     
       }

       getMetricscaseId(Caedid :any){
            let options = new RequestOptions({ headers: this.headers1  });  
       return this.http.get(this.config.GetMetricsOverview+"&caseid="+Caedid,options).map((response: Response) => {
           return response.json();
       });     
   }

    GetCaseOverviewList(){
        
         let options = new RequestOptions({ headers: this.headers1  });  
         return this.http.get(this.config.GetCaseOverview,options).map((response: Response) => {
             return response.json();
         });
     }
     GetMetricsOverviewList(){
        
         let options = new RequestOptions({ headers: this.headers1  });  
         return this.http.get(this.config.GetMetricsOverview,options).map((response: Response) => {
             return response.json();
         });
     }
     GetDomainOverviewList(){
        
         let options = new RequestOptions({ headers: this.headers1  });  
         return this.http.get(this.config.GetDomainOverview,options).map((response: Response) => {
             return response.json();
         });
     }
     GetCheckinAlertsList(){
       
         let options = new RequestOptions({ headers: this.headers1  });  
         return this.http.get(this.config.GetCheckinAlerts,options).map((response: Response) => {
             return response.json();
         });
     }
    getcaseid(id:any){
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcaseid + id,options).map((response: Response) => {
            return response.json();
        });     
    }

    getcheckinid(id:any){
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcheckinid + id,options).map((response: Response) => {
            return response.json();
        });     
    }
    
    postcheckin(checkin:checkin){
       let options = new RequestOptions({ headers: this.headers1  });
       let body = JSON.stringify(checkin);
       return this.http.post(this.config.addcheckin,body,options).map((response: Response) => {
        return response.json();
    });   
    }
    getcheckin(searchString :any,PageNum:any,PageCount:any) {
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcheckin+"?pageNumber="+PageNum+"&pageSize="+PageCount+"&FullName="+searchString,options).map((response: Response) => {
            return response.json();
        });  
    }
    getcheckinbyCaseId(CaseId:any) {
       
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcaseidList+"checkin?id="+CaseId,options).map((response: Response) => {
            return response.json();
        });  
    }

    getemoji() {
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getemoji,options).map((response: Response) => {
            return response.json();
        });
      
    }
    getemojisummary(searchString :any,PageNum:any,PageCount:any) {
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getemojisummery+"?pageNumber="+PageNum+"&pageSize="+PageCount+"&FullName="+searchString,options).map((response: Response) => {
            return response.json();
        });
      
    }

    getemojisummarybyid(caseid:any) {
       
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcaseidList+"emoji?id="+caseid,options).map((response: Response) => {
            return response.json();
        });
      
    }
    getHelpAlartid(caseid:any) {
       
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getcaseidList+"help?id="+caseid,options).map((response: Response) => {
            return response.json();
        });
      
    }
    
    getemojiview(id:number) {
        let options = new RequestOptions({ headers: this.headers1  });  
        return this.http.get(this.config.getemojiview + id,options).map((response: Response) => {
            return response.json();
        });
      
    }
    postquestions(question:any){
        let options = new RequestOptions({ headers: this.headers1 });          
        let body = JSON.stringify(question);
        return this.http.post(this.config.addassessment,body,options).map((response: Response) => {
            return response.json();
        });
    }

    getquestionassessmentid(id){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getquestionassessmentid + id,options).map((response: Response) => {
            return response.json();
        });
    }
    getassessmentquestions(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getquestionassessment,options).map((response: Response) => {
            return response.json();
        });
    }
    // getassessment(){
    //     let options = new RequestOptions({ headers: this.headers1 });   
    //     return this.http.get(this.getassessment,options).map((response: Response) => {
    //         return response.json();
    //     });
    // }
    getassessmenttest(searchstring:any,PageNum:any,PageCount:any){
        
                let options = new RequestOptions({ headers: this.headers1 });   
                return this.http.get(this.config.getassessmenttest+"?pageNumber="+PageNum+"&pageSize="+PageCount+"&FullName="+searchstring,options).map((response: Response) => {
                    return response.json();
                });
            }
    postnotifications(notification : any){
        let options = new RequestOptions({ headers: this.headers1 });          
        let body = JSON.stringify(notification);
        return this.http.post(this.config.addnotification,body,options).map((response: Response) => {
            return response.json();
        });
    }
    getalert(id:number){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getallalert,options).map((response: Response) => {
            return response.json();
        });
    }
    getnotifications(searchstring:any,PageNum:any,PageCount:any){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getnotification+"?pageNumber="+PageNum+"&pageSize="+PageCount+"&FullName="+searchstring,options).map((response: Response) => {
            return response.json();
        });
    }
    getallhelp(){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.getallalert,options).map((response: Response) => {
            return response.json();
        });
    }
    deletealert(id:number){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.delete(this.config.alert + id,options).map((response: Response) => {
            return response.json();
        });
    }

    updateprofile(profile : any){
        let options = new RequestOptions({ headers: this.headers1 });          
        let body = JSON.stringify(profile);
        return this.http.put(this.config.domain+"User/profile/update",body,options).map((response: Response) => {
            return response.json();
        });
    }
    getallrole(){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + 'User/roles'   ,options).map((response: Response) => {
            return response.json();
        });  
    }


    
    getalluser(search:string,pageNumber:number,pageSize:number){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + "User?pageNumber="+pageNumber+"&pageSize="+pageSize+"&FullName="+search,options).map((response: Response) => {
            return response.json();
        });
    }
    getalluserbyrole(search:string,pageNumber:number,pageSize:number,id:number){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + "User?pageNumber="+pageNumber+"&pageSize="+pageSize+"&FullName="+search+"&RoleId="+id   ,options).map((response: Response) => {
            return response.json();
        });
    }


    Deleteuser(id:any)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.delete(this.config.domain + 'User/'+id   ,options).map((response: Response) => {
            return response.json();
        });
    }

    getuser(id:any)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + 'User/'+id   ,options).map((response: Response) => {
            return response.json();
        });
    }
    postuser(data:Object){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.post(this.config.domain + 'User/' ,data  ,options).map((response: Response) => {
            return response.json();
        });
    }

    putuser(data:Object){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.put(this.config.domain + 'user/' ,data   ,options).map((response: Response) => {
            return response.json();
        });
    }
    
    getcondition(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + 'condition/' +id   ,options).map((response: Response) => {
            return response.json();
        });   
    }
    getregion(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + 'region/' +id   ,options).map((response: Response) => {
            return response.json();
        });   
    }
    postregion(data:Object)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.post(this.config.domain + 'Region/' ,data  ,options).map((response: Response) => {
            return response.json();
        });
    }
    putregion(data:Object)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.put(this.config.domain + 'Region/' ,data  ,options).map((response: Response) => {
            return response.json();
        });
    }
    postcondition(data:Object)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.post(this.config.domain + 'condition/' ,data  ,options).map((response: Response) => {
            return response.json();
        });
    }
    putcondition(data:Object)
    {
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.put(this.config.domain + 'condition/' ,data  ,options).map((response: Response) => {
            return response.json();
        });
    }
    getallquestiondata(){
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.get(this.config.domain + 'DomainQuestion?pageNumber=1&pageSize=100', options).map((response: Response) => {
            return response.json();
        });
    }
    postQuestiondata(data){
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.post(this.config.domain + 'DomainQuestion',data, options).map((response: Response) => {
            return response.json();
        });
    }
    putQuestiondata(data){
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.put(this.config.domain + 'DomainQuestion',data, options).map((response: Response) => {
            return response.json();
        });
    }
    deleteQuestion(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.delete(this.config.domain + 'DomainQuestion/'+id, options).map((response: Response) => {
            return response.json();
        });
    }
    protected extractArray(res: Response, showprogress: boolean = true) {
        let data = res.json();

        return data || [];
    }
    getallcondition(){
        let options = new RequestOptions({ headers: this.headers1 });  
        return this.http.get(this.config.domain + 'condition/'  ,options).map((response: Response) => {
            return response.json();
        });  
    }
    getprofile()
    {
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.get(this.config.domain + 'User/profile/me', options).map((response: Response) => {
            return response.json();
        });
    }
    getalluserbyroleRegion(Regionid:any)
    {
        let options = new RequestOptions({ headers: this.headers1 });
        return this.http.get(this.config.domain + 'User?pageNumber=1&pageSize=100&RoleId=2&RegionId='+Regionid, options).map((response: Response) => {
            return response.json();
        });
    }

    
    getallregions(search:string,pageNumber:number,pageSize:number){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.domain +'Region/?RegionName=' +
            search+'&pageNumber='+pageNumber+'&pageSize='+pageSize ,options).map((response: Response) => {
            return response.json();
        });
    }

    deleteregion(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.delete(this.config.domain + 'region/' +id   ,options) 
        .map((response: Response) => {
            return response.json();
        });  
    }
    getallconditions(search:string,pageNumber:number,pageSize:number){
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.get(this.config.domain +'Condition/?ConditionName='+search+'&pageNumber='+pageNumber+'&pageSize='+pageSize ,options).map((response: Response) => {
            return response.json();
        });
    }

    deletecondition(id:number)
    {
        let options = new RequestOptions({ headers: this.headers1 });   
        return this.http.delete(this.config.domain + 'Condition/' +id   ,options).map((response: Response) => {
            return response.json();
        });  
    }
    // private helper methods

    protected handleErrorPromise(error: any): Promise<void> {
        try {
            error = JSON.parse(error._body);
        } catch (e) {
        }

        let errMsg = error.errorMessage
            ? error.errorMessage
            : error.message
                ? error.message
                : error._body
                    ? error._body
                    : error.status
                        ? `${error.status} - ${error.statusText}`
                        : 'unknown server error';

        console.error(errMsg);
        return Promise.reject(errMsg);
    }
  
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }


    
}