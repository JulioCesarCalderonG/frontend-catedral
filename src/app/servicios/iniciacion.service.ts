import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { IniciacionForm } from '../interface/iniciacion.interface';

@Injectable({
  providedIn: 'root'
})
export class IniciacionService {
  url = `${environment.backendUrl}/iniciacion`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getIniciacion(estado:string):Observable<any>{
    return this.http.get(this.url,{params:{estado}});
  }
  getIniciacionID(id:string | number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postIniciacion(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putIniciacion(body:IniciacionForm,id:string| number):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  putLogoIniciacion(body:FormData,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/logo/${id}`,body);
  }
  deleteIniciacion(id:string|number,  estado:string):Observable<any>{
    return this.http.delete(`${this.url}/${id}`,{params:{estado}});
  }
}
