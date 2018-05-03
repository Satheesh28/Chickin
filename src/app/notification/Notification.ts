export class notification {
    public id: string;
    public type: string;
    public desc: string;
    public received: boolean;
    public completed: boolean;
    public case_id: string;
    case_id_list: [
      {
        case_id: string, 
      }
    ] ;
} 

