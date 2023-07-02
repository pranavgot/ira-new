import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss']
})
export class ViewServiceComponent implements OnInit {
  service1: any;
  // id="A6376313-3CA3-40F5-9108-995BF5D3031F";
  reqid: any;
  service: any;
  RequestId: any;
  servicedata: any;
  flag1: boolean = false;
  flag2: boolean = false;
  flag3: boolean = false;
  flag4: boolean = false;
  msg: any;

  constructor(
    private route: ActivatedRoute,
    private Master: MastersService,
  ) { }

  ngOnInit(): void {
    this.getserviceByUserId()
    this.getByServiceRequestId()
  }
  getserviceByUserId(){
    // let data = this.id;
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.getserviceByUserId(data.userId).subscribe((res: any) => {
      console.log("subscription", res);
      this.service = res.responseData;
      this.service1 = res.responseData[0].serviceRequestDetailResponseList;
      console.log("reqid",this.service);
    })
   }

   getByServiceRequestId(){
      this.reqid = this.route.snapshot.paramMap.get('RequestId');
    // console.log("reqid",this.service.serviceRequestId);
    this.Master.getByServiceRequestId(this.reqid).subscribe((res: any) => {
      this.msg= res.responseData
      this.servicedata = res.responseData.serviceRequestDetailResponseList;
      console.log("reqid",this.service);
   
      this.servicedata.forEach((element:any) => {  
            if(element.requestType == 'Renew Solution'){
              this.flag1 = true;
            }
            else if(element.requestType == 'Renew WorkSpace'){
              this.flag2 = true;
            }
            else if(element.requestType == 'new Solution'){
              this.flag3 = true;
            }
            else if(element.requestType == 'new WorkSpace'){
              this.flag4 = true;
            }
        })
      })
    }
}
