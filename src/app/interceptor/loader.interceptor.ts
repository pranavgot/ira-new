import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../core/services/loader.service';
// import { LoaderService } from 'src/app/core/services/common/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        setTimeout(() => {
            this.loaderService.show();
        }, 0);
        return next.handle(req).pipe(
            finalize(() => {
                //setTimeout(() => {
                this.loaderService.hide();
                //}, 1000);
            })
        );
    }
}
