import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appFileDragAndDrop]'
})
export class FileDragAndDropDirective {
  @Output() private filesChangeEmiter : EventEmitter<any[]> = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) { }


  @HostListener('dragover', ['$event']) public onDragOver(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
  
  }

  @HostListener('drop', ['$event']) public onDrop(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    
    // debugger;
    // let files = evt.dataTransfer.files;
    // let valid_files : Array<File> = files;
    this.filesChangeEmiter.emit(evt);
  }
}
