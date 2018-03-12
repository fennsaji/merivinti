import { Injectable } from "@angular/core";
import { AuthService } from "./auth";
import { Observable } from "rxjs/Observable";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class ChurchService {
  token: string;
  httpOptions : Object;
  url : string = 'http://192.168.43.54:8080/church/';

  constructor(private authSer: AuthService,
    private http: HttpClient) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
  }

  searchChurch(search: string) {
    return this.http.post<any>(this.url + 'search', {search}, this.httpOptions)
      .map(data => data.churches);
  }

  getChurchProfile(churchId: string): Observable<any> {
    return this.http.post<any>(this.url + 'getDetails', {churchId}, this.httpOptions)
  }
}
