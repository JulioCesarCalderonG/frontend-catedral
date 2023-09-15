import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TipoOracionesForm } from '../interface/tipo.oraciones.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoOracionesService {
  url = `${environment.backendUrl}/tipooraciones`;
  constructor(
    private http: HttpClient,
    private router: Router) { }
  getTipoOraciones():Observable<any>{
    return this.http.get(this.url);
  }
  getTipoOracionID(id:string|number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoOracion(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putTipoOracion(body:FormData,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  putLogoTipoOracion(body:FormData,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/imagen/${id}`,body);
  }
  deleteTipoOracion(id:string|number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }
}
