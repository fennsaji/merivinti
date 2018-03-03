import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ILoginUser } from "../models/loginUser.model";
import { IRegChurch } from "../models/regChurch.model";

@Injectable()
export class AuthService {
  url: String = 'localhost:8080/auth';
  token: String ;

  constructor(private http: HttpClient) {}

  login(loginUser: ILoginUser): Observable<any> {
    return this.http.post<any>(this.url + '/login', loginUser);
  }

  regChurch(regChurch: IRegChurch): Observable<any> {
    return this.http.post<any>(this.url + '/regChurch', regChurch);
  }

  regMember(regMemb: IRegChurch): Observable<any> {
    return this.http.post<any>(this.url + '/regMemb', {});
  }

  isAuthenticated(): boolean {
    return false;
  }
}
