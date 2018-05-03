$(function() {

  var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = mm + '-' + dd + '-' + yyyy;

    $('#rangepicker').daterangepicker({
      autoUpdateInput: false,
      locale: {
        format: 'MM-DD-YYYY',    
        cancelLabel: 'Clear'
},         

      separator: ' - ',
      minDate: today +" "+"00:00:00",
     });
     $('#rangepicker').on('apply.daterangepicker', function(ev, picker) {  
        $(this).val(picker.startDate.format('MM-DD-YYYY') + ' - ' + picker.endDate.format('MM-DD-YYYY'));
        $("#rangepicker").removeAttr("class");
        $('#rangepicker').addClass('form-control date-picker');
        $("#datelabelerrorr").removeAttr("class");
        $('#datelabelerrorr').addClass('col-sm-2 col-xs-4 control-label');

     var Broswer=get_browser();
     let startDate;
     let endDate;
     if(Broswer.name=="IE")
     { 
          startDate = picker.startDate.format('MM/DD/YYYY HH:mm:ss');
          endDate =picker.endDate.format('MM/DD/YYYY HH:mm:ss');
     }
     else{
         startDate = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
         endDate =picker.endDate.format('YYYY-MM-DD HH:mm:ss');
     }


  localStorage.setItem('startDate',JSON.stringify(startDate));
  localStorage.setItem('endDate',JSON.stringify(endDate));
  });

  $('#rangepicker').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

     $("#condtion").select2();  
     $('#Work').removeClass('uib-tab nav-item').addClass('uib-tab nav-item active');  
     
     

     
  } );  

  function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }