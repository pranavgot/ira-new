import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';


@Component({
  selector: 'app-assigned-solutions',
  templateUrl: './assigned-solutions.component.html',
  styleUrls: ['./assigned-solutions.component.scss']
})
export class AssignedSolutionsComponent implements OnInit {
  usersubs: any;
  // id="F81B7026-7D64-4C62-A6F1-BBA60EBBBA18";
  userworkspace: any;

  constructor(
    private LeadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router,
    private userservice: UsersService
  ) { }

  ngOnInit(): void {
    this.getByUserIdSubscritpionDetails()
  }
  getByUserIdSubscritpionDetails(){
    // let data = this.route.snapshot.paramMap.get("id");
    // let data = this.id;
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.userservice.getSubscriptionDetailsByUserId(data.userId).subscribe((res: any) => {
      console.log("subs", res);
      this.usersubs= res.responseData.subscriptionDto;
      this.userworkspace= res.responseData.subsciptionTypeDetailsDto;
    },
    (err:any)=>{
      this.usersubs= []
      this.userworkspace=[]
    })
    
  }
  createProject(data:any){
    localStorage.setItem('projectProcess',JSON.stringify(data))
    this.router.navigate(['/user/admin1/new-project']);
    // ,{createproject: JSON.stringify(data)}
  }
}
