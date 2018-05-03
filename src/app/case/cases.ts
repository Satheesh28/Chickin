export class cases {   
         public id: string;
         public case_number: string;
         public first_name: string;   
         public last_name: string;
         public middle_name: string;   
         public identification_num: string;
         public photograph: string;   
         public access_code: string;
         public case_date: any;  
         public recurring_startdate: Date; 
         public recurring_enddate: Date;
         public recurring_frequency: string;      
         public assigned_to: string;   
         public region_id: string;
         caseAddress: [
            {
        addressline1: string, addressline2: string,state: string,city: string,zipcode: string,
            }
          ] ;
          casePhone: [
            {        
               number: string        
            }
          ];            
          caseCondition: [
        {    
           desc: string;   
        }
      ];
      caseQuestion: [
        {    
           desc: string, score: number,domain_id: number  
        }
      ];
      caseRecurring: [
        {          
             duedate: DateTimeFormat,  
             completed: true 
        }
      ];
   } 

  