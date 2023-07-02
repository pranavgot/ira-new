import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { UsersService } from 'src/app/core/services/users/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from 'src/app/core/services/popup.service';
import { SharedService } from 'src/app/core/services/shared.service';


@Component({
  selector: 'app-add-announcements',
  templateUrl: './add-announcements.component.html',
  styleUrls: ['./add-announcements.component.scss']
})
export class AddAnnouncementsComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  linkCtrl = new FormControl('');
  filteredlinks: Observable<string[]>;
  links: string[] = [];
  alllinks: string[] = [''];
  announcementForm!: FormGroup;
  imgFile: any = null;
  uploadedFile: any;


  @ViewChild('linkInput')
  linkInput!: ElementRef<HTMLInputElement>;
  submited: boolean = false;
  annId: any;
  annoData: any;
  

  constructor(
    private UserService: UsersService,
    private formbuilder: FormBuilder,
    private leadsService:LeadsService,
    private route: ActivatedRoute,
    private popup:PopupService,
    private router: Router,
    // private toast: ToastComponent,
    private userService: UsersService,
    private _sanitizer: DomSanitizer,
  ) {
    this.filteredlinks = this.linkCtrl.valueChanges.pipe(
      startWith(null),
      map((link: string | null) => (link ? this._filter(link) : this.alllinks.slice())),
    );
  }
  ngOnInit(): void {
    this.announcementForm = this.formbuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      description: ['', Validators.required],
      user: ['', Validators.required],
      flie: ['', Validators.required],
    })
    this.getdetailsbyid()

    // throw new Error('Method not implemented.');
  }
  announcementSubmit(){
    this.submited = true
    if (this.announcementForm.invalid) {
      // console.log(this.contactForm);
      this.popup.open(false,"Enter All the Required Fields");
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    // console.log(this.contactForm);
    let formData: FormData = new FormData();
        formData.append('imageData', this.imgFile);
        formData.append('announcementName',this.announcementForm.value.name );
        formData.append('userType',this.announcementForm.value.user);
        formData.append('announcementDescription', this.announcementForm.value.description);
        formData.append('link',this.announcementForm.value.link );

    //  let data = {
    //   name: this.announcementForm.value.name,
    //   link: this.announcementForm.value.link,
    //   description: this.announcementForm.value.description,
    //   user: this.announcementForm.value.user,
    //   flie: this.announcementForm.value.flie,
    //   }
      this.userService.add_announcement(formData).subscribe((res:any)=>{
        console.log(res);
        this.popup.open(true,"Successfully added");
        // this.toast.success({ title: 'Success', message: "Successfully added" });
        this.router.navigate(["/user/admin1/announcements"])
        // this.shared.sendClick("/user/admin1/announcements")
      })
      ,(err:any)=>{
        this.popup.open(false,err.statusMessage);
          // this.toast.error({ title: 'Error', message: err.statusMessage });
        }
    }
  
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our link
    if (value) {
      this.links.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.linkCtrl.setValue(null);
  }

  remove(link: string): void {
    const index = this.links.indexOf(link);

    if (index >= 0) {
      this.links.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.links.push(event.option.viewValue);
    this.linkInput.nativeElement.value = '';
    this.linkCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.alllinks.filter(link => link.toLowerCase().includes(filterValue));
  }

  imgFileUpload(e: any) {

    console.log(e.target.files[0]);
    
    // this.demo = null;
    // this.demoimg = false;
    this.imgFile = e.target.files[0];
    console.log(this.imgFile);
    if (this.imgFile.size < 100000) {
      if (
        this.imgFile.type === 'image/jpeg' ||
        this.imgFile.type === 'image/png' ||
        this.imgFile.type === 'image/jpg'
      ) {
      } else {
        //print incorrect format error
      }
    } else {
      //print size error
    }
  }

  getdetailsbyid() {
    this.annId = this.route.snapshot.paramMap.get('id');
    if(this.annId) {
    this.UserService.getAnnouncementByid(this.annId).subscribe((res: any) => {
      this.annoData = res.responseData;
      this.mapAnnouncementForm();
      });
    }
  }
  mapAnnouncementForm(){
    this.announcementForm?.patchValue({
      name: this.annoData?.announcementName,
      link: this.annoData?.link,
      description: this.annoData?.announcementDescription,
      user: this.annoData?.userType,
 
    });
    if(this.annoData?.imageDataresponse){
    this.uploadedFile = this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/png;base64,' + this.annoData?.imageDataresponse
    );
    }
  }
    // ,(err:any)=>{
    //   this.toast.error({ title: 'Error', message: err.statusMessage });
    // }
}
