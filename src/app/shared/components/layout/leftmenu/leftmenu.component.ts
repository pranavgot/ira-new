import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss']
})
export class LeftmenuComponent implements OnInit {
  solshow: boolean = false;
  proshow: boolean = false;
  menu: any;

  admin1 = [
    {
      name: 'Workspace', path: 'user/admin1/solution-board-dashboard', showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
    },
    { name: 'Dashboard', path: 'user/admin1/dashboard', showChild: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Leads', path: 'user/admin2/lead', showChild: false, child: false, icon: 'dds-icon_users' },
    { name: 'User Management', path: 'user/admin2/user-management', showChild: false, child: true, icon: 'dds-icon_users' },
    { name: 'Subscription Management', path: 'user/admin2/subscription', showChild: false, child: true, icon: 'dds-icon_money__l__stroke' },
    { name: 'Approvals', path: 'user/admin1/approvals', showChild: false, child: false, icon: 'dds-icon_delegate_user__l__stroke' },
    {
      name: 'My Projects', path: 'user/admin1/my-project', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },
    { name: 'Master Data Management', path: 'user/admin1/master', showChild: false, child: false, icon: 'dds-icon_resize__l__stroke' },
    { name: 'Client Info', path: 'user/admin1/client-info', showChild: false, child: false, icon: 'dds-icon_info__l__stroke' },
    { name: 'Explore Solutions ', path: 'user/external_user/explore-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Announcements', path: 'user/admin1/announcements', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }

  ]

  admin2 = [
    {
      name: 'Workspace', path: 'user/admin1/solution-board-dashboard', showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
    },
    { name: 'Dashboard', path: 'user/admin1/dashboard', showChild: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Leads', path: 'user/admin2/lead', showChild: false, child: false, icon: 'dds-icon_users' },
    { name: 'User Management', path: 'user/admin2/user-management', showChild: false, child: false, icon: 'dds-icon_users' },
    { name: 'Subscription Management', path: 'user/admin2/subscription', showChild: false, child: false, icon: 'dds-icon_money__l__stroke' },
    { name: 'Approvals', path: 'user/admin1/approvals', showChild: false, child: false, icon: 'dds-icon_delegate_user__l__stroke' },
    {
      name: 'My Projects', path: 'user/admin1/my-project', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },
    { name: 'Master Data Management', path: 'user/admin1/master', showChild: false, child: false, icon: 'dds-icon_resize__l__stroke' },
    { name: 'Client Info', path: 'user/admin1/client-info', showChild: false, child: false, icon: 'dds-icon_info__l__stroke' },
    { name: 'Explore Solutions ', path: 'user/external_user/explore-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Announcements', path: 'user/admin1/announcements', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }

  ]

  admin = [
    {
      name: 'Workspace', path: 'user/admin1/solution-board-dashboard', showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
    },
    { name: ' Dashboard', path: 'user/admin1/dashboard', showChild: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Master Data Management', path: 'user/admin1/master', showChild: false, child: false, icon: 'dds-icon_resize__l__stroke' },
    { name: 'User Management', path: 'user/admin1/user-management', showChild: false, child: false, icon: 'dds-icon_users' },
    {
      name: 'My Projects', path: 'user/admin1/my-project', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },
    { name: 'Client Info', path: 'user/admin1/client-info', showChild: false, child: false, icon: 'dds-icon_info__l__stroke' },
    { name: 'Explore Solutions ', path: 'user/external_user/explore-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Approvals', path: 'user/admin1/approvals', showChild: false, child: false, icon: 'dds-icon_delegate_user__l__stroke' },
    { name: 'Notifications', showChild: false, child: false, icon: 'dds-icon_notification__l__stroke' },
    { name: 'Announcements', path: 'user/admin1/announcements', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }

  ]

  internal = [
    // { name: 'Access Request Page', path: 'user/internal_user/access', showChild: false, child: false, icon: 'dds-icon_service__l__stroke' },
    // { name: 'Dashboard', path: 'user/internal_user/dashboard', showChild: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Dashboard', path: 'user/external_user/dashboard', showChildclient: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Subscriptions', path: 'user/external_user/assigned-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    {
      name: 'My Projects', path: 'user/admin1/my-project', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },

    { name: 'Explore Solutions ', path: 'user/external_user/explore-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Service Request', path: 'user/external_user/service-request', showChild: false, child: false, icon: 'dds-icon_service__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }

  ]
  client = [
    { name: 'Dashboard', path: 'user/external_client/dashboard', showChild: false, child: false, icon: 'dds-icon_' },
    { name: 'Subscription', path: 'user/external_client/subscription', showChild: false, child: false, icon: 'dds-icon_' },
    { name: 'User Management', path: 'user/external_client/user-management', showChild: false, child: false, icon: 'dds-icon_add_user__l__stroke' },
    {
      name: 'My Projects', path: 'user/external_client/dashboard', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },
    {
      name: 'Workspace', path: 'user/external_client/dashboard', showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
    },
    { name: 'Extended workspace', path: 'user/external_client/dashboard', showChild: false, child: false, icon: 'dds-icon_resize__l__stroke' },
    { name: 'Explore Solutions', path: 'user/external_client/explore-solution', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },

    { name: 'Service Request', path: 'user/external_client/service-request', showChild: false, child: false, icon: 'dds-icon_service__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }

  ]
  user = [
    { name: 'Dashboard', path: 'user/external_user/dashboard', showChildclient: false, child: false, icon: 'dds-icon_screen' },
    { name: 'Subscriptions', path: 'user/external_user/assigned-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    {
      name: 'My Projects', path: 'user/admin1/my-project', showChild: false, child: true, icon: 'dds-icon_many_files__l__stroke'
    },

    { name: 'Explore Solutions ', path: 'user/external_user/explore-solutions', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' },
    { name: 'Service Request', path: 'user/external_user/service-request', showChild: false, child: false, icon: 'dds-icon_service__l__stroke' },
    { name: 'Notifications', path: 'user/admin1/notifications', showChild: false, child: false, icon: 'dds-icon_lightbulb__l__stroke' }


  ]

  menus: any;
  subsData: any;
  hover: boolean = false;

  constructor(
    private shared: SharedService,
    private Master: MastersService,
    private router: Router
  ) {
    this.menu = JSON.parse(localStorage.getItem('users') || '{}');
    console.log(this.menu)
    if (this.menu.roleName == undefined || this.menu.roleName == null) {

      this.menu = {

        roleName: (localStorage.getItem('userss') || '{}')
      }

    }
    if (this.menu.anySolution == 1 ) {
      let obj = {
        name: 'Workspace',
        path: 'user/admin1/solution-board-dashboard',
        showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
      }
      this.user.splice(3, 0, obj)
    }
    console.log(this.menu)
    this.menuList()

  }

  ngOnInit(): void {
    // this.subscriptionDashboard()
    console.log(this.router.url);
    this.shared.getroute().subscribe((res: any) => {
      console.log(res);
      this.menus?.forEach((element: any) => {
        if (element.name == 'Dashboard') {
          this.pageActive(element);
          this.router.navigateByUrl(element.path)
        }
      });
    })


  }

  dropdown(data: any) {
    if (data == 'sol') {
      this.solshow = !this.solshow;
      this.proshow = false;
    }
    else if (data == 'pro') {
      this.proshow = !this.proshow;
      this.solshow = false;
    }
  }
  menuList() {
    switch (this.menu.roleName) {
      case "Level 1-Admin":this.menus = this.admin1;break;
      case "Level 2-Admin":this.menus = this.admin2;break;
      case "External User":this.menus = this.user;break;
      case "Internal User":this.menus = this.internal;break;
      // default: this.menus = this.admin1
    }
    this.getactivetab()
  }
  getactivetab() {
    this.menus?.forEach((element: any) => {
      if (element.path == this.router.url) {
        this.pageActive(element)
      }
    });
  }


  pageActive(data: any) {
    let ind: any
    console.log(data);
    this.menus?.forEach((element: any, i: any) => {
      if (element.name != data.name) {
        element.active = false;
      }
      else {
        ind = i
      }
    });
    this.menus[ind].active = true;
  }
  // subscriptionDashboard() {
  //   let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
  //   console.log('userInfo----->', data);
  //   this.Master.subscriptionDashboard(data.userId).subscribe((res: any) => {
  //     this.subsData = res.responseData.subscriptionDTO;
  //     let obj = {
  //       name: 'Solution Board',
  //       path: 'user/admin1/solution-board-dashboard',
  //       showChild: false, child: true, icon: 'dds-icon_lightbulb__l__stroke'
  //     }
  //     this.user.splice(3, 0, obj)
  //   })
  // }
  LeftHov(data: any) {
    if (data.child) {
      this.hover = true;
      this.shared.sendLeftHov(this.hover)
    }
  }
  LeftOut() {
    this.hover = false;
    this.shared.sendLeftHov(this.hover)
  }

  menuClick(page: any) {
    localStorage.removeItem('project')
    localStorage.removeItem('process')
  }
}

