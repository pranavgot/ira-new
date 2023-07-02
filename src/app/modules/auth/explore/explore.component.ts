import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
// import { ToastComponent } from '../../user/all-common/toast/toast.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  process: any;
  data: any;
  processSearch: any;
  processidd: any;
  requiredId: any;
  videoId: any;
  demo: any;
  brochures: any;
  displayStyle = "none";
  brochure: any
  AddEventProceeding: boolean | undefined;
  AddEventProceeding1: boolean | undefined;
  video: any

  constructor(
    private master: MastersService,
    private loader: LoaderService,
    private popup: PopupService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getAllProcess()
  }
  getAllProcess() {
    this.loader.show()
    this.master.getAllProcessBasedPublishedAndFeatureList(1).subscribe((res: any) => {
      this.process = res.responseData;
      this.processSearch = res.responseData;
      console.log(this.process);
      this.process.forEach((element: any) => {
        element.image = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + element.imageUrl)
        element.video = this._sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,' + element.videoUrl)
        element.brochure = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + element.brochureUrl)
      });
      console.log(res, this.process);
      this.loader.hide()
    })
  }
  openPopup(data: any) {
    this.data = data
    this.displayStyle = "block";
  }
  openPopup1(data: any) {
    this.data = data
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }
  ShowDemo(item: any) {
    this.processidd = item.processId;
    this.videoId = item.videoId;
    if (item.videoId != null) {
      this.master.brochureanddemo(this.videoId, this.processidd).subscribe((res: any) => {
        this.demo = res.responseData;
        this.AddEventProceeding = true
        this.brochure = this.demo
        this.video = this._sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,' + this.demo)
      })
    }
    else {
      this.AddEventProceeding = false
      this.popup.open(false, "Demo Video is not available for this process");
    }
  }
  ShowBrochure(item: any) {
    console.log(item);
    this.processidd = item.processId;
    this.requiredId = item.brochureId;
    if (item.brochureId != null) {
      this.master.brochureanddemo(this.requiredId, this.processidd).subscribe((res: any) => {
        this.brochures = res.responseData;
        this.AddEventProceeding1 = true
        this.brochure = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + this.brochures)
      })
    }
    else {
      this.popup.open(false, "Brochure is not available for this process");
    }
  }

  CloseModel() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
  }

  applyFilter(event: any) {
    this.processSearch = this.process.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }
}