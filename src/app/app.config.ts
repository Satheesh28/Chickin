export class AppConfig {


// Prod URL

// Dev URL
    // public readonly domain ='http://ec2-54-145-70-0.compute-1.amazonaws.com/api/';
    // public readonly domain1 ='http://ec2-54-145-70-0.compute-1.amazonaws.com/';
    

     public readonly domain ='http://ec2-52-207-214-20.compute-1.amazonaws.com:8080/api/';
    public readonly domain1 ='http://ec2-52-207-214-20.compute-1.amazonaws.com:8080/';

    // public readonly domain ='http://dev.delsight.com:8080/api/';
    // public readonly domain1 ='http://dev.delsight.com:8080/';

    public readonly xapikey='dABlAHMAdAA=';  
    public readonly Authorization = JSON.parse(localStorage.getItem('Authorization'));  
    public readonly id = JSON.parse(localStorage.getItem('id'));
    public readonly getcase = this.domain + 'Case';
    public readonly getcaseid = this.domain + 'Case/';
    public readonly getcaseidList = this.domain1 + 'cases/';
    public readonly addcase = this.domain + 'Case';
    public readonly updatecase = this.domain + 'Case';
    public readonly getcheckin = this.domain + 'Checkin'; 
    public readonly addcheckin = this.domain + 'Checkin';
    public readonly getcheckinid = this.domain + 'Checkin/';
    public readonly getquestionassessment = this.domain + 'QnA?pageNumber=1&pageSize=10';
    public readonly getquestionassessmentid = this.domain + 'QnA/';
    public readonly getemojisummery = this.domain1 + 'GetEmojiSummaryList';
    public readonly addassessment = this.domain + 'QnA';
    public readonly getassessment = this.domain + 'GetQanASummaryList?pageNumber=1&pageSize=10';
    public readonly getassessmenttest =this.domain1 + 'GetQanATestSummaryList';
    public readonly getemoji = this.domain + 'Emotion?pageNumber=1&pageSize=10';
    public readonly getnotification = this.domain + 'Notification';
    public readonly addnotification = this.domain + 'Notification';
    public readonly getcondtion = this.domain + 'Condition?pageNumber=1&pageSize=10';
    public readonly getemojiview = this.domain + 'Emotion/';
    public readonly getregion = this.domain + 'Region?pageNumber=1&pageSize=100';
    public readonly getprofile = this.domain + 'User/profile/me';
    public readonly getuserrole = this.domain + 'User/roles';
    public readonly updatepassword = this.domain + 'User/profile/update-pw';
    public readonly login = this.domain + 'User/login';
    public readonly getalldominquestion = this.domain +'DomainQuestion?pageNumber=1&pageSize=100';
    public readonly getallalert = this.domain +'Help?pageNumber=1&pageSize=10';
    public readonly alert = this.domain +'Help/';

    public readonly GetCaseOverview = this.domain1 + 'GetCaseOverviewList?pageNumber=1&pageSize=10';
    public readonly GetMetricsOverview = this.domain1 + 'GetGetMetricOverviewList?pageNumber=1&pageSize=100';
    public readonly GetDomainOverview = this.domain1 + 'GetQanASummaryList?pageNumber=1&pageSize=10';
    public readonly GetCheckinAlerts = this.domain1 + 'GetCheckinAlertList?pageNumber=1&pageSize=10';
};