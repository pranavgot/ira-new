import { Injectable } from '@angular/core';
import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
//import { LocalStorageService } from 'src/app/core/services/common/local-storage.service';
// import { LocalStorageService } from 'src/app/core/services/common/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}
    private tokenObj: any = '';
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const obj: any = JSON.parse(localStorage?.getItem('user') || localStorage?.getItem('userr')||'{}');
        console.log(obj);
        
        if (obj !== undefined && obj !== null) {
            if (obj.token != undefined && obj.token != null) {
                this.tokenObj = obj.token;
            }
            if (obj.authority?.accessToken != undefined && obj.authority?.accessToken != null) {
                console.log(obj.authority?.accessToken);
                this.tokenObj = obj.authority?.accessToken;
            }
        }

        if (!req.headers.has('enctype')) {
            req = req.clone({
                // headers: req.headers.set('Content-Type', 'application/json'),
            });
        }
        const authReq = req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + this.tokenObj,
                // accessToken:this.tokenObj
            },
        });
        return next.handle(authReq);
    }
}
