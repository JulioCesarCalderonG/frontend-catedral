import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${environment.backendUrl}/auth`;
  constructor(
    private http: HttpClient,
    private router: Router) { }
  
  postLogin(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  getToken(){
    return sessionStorage.getItem('x-token');
  }
  loggoud(){
    sessionStorage.removeItem('x-token');
    this.router.navigate(['/auth']);
  }
  resetPassword(body:FormData):Observable<any>{
    return this.http.put(`${this.url}/password`,body);
  }
}
