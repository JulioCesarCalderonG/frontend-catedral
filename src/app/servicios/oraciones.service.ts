import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OracionesService {
  url=`${environment.backendUrl}/oraciones`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getOraciones(estado:string):Observable<any>{
    return this.http.get(this.url,{params:{estado}});
  }
}
