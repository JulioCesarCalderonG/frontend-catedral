import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OracionesForm } from '../interface/oracion.interface';

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
  getOracionId(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postOraciones(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putOraciones(body:OracionesForm,id:string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  putOracionesLogo(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/imagen/${id}`,body);
  }
  deleteOraciones(id:number,estado:string):Observable<any>{
    return this.http.delete(`${this.url}/${id}`,{params:{estado}})
  }
}
