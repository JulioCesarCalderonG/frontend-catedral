import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { TiempoLiturgiaForm } from '../interface/tiempo.liturgia.interface';

@Injectable({
  providedIn: 'root'
})
export class TiempoLiturgiaService {
  url = `${environment.backendUrl}/tiempoliturgia`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTiempoLiturgia(estado:string):Observable<any>{
    return this.http.get(this.url,{params:{estado}});
  }
  getTiempoLiturgiaID(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTiempoLiturgia(body:TiempoLiturgiaForm):Observable<any>{
    return this.http.post(this.url, body);
  }
  putTiempoLiturgia(body:TiempoLiturgiaForm,id:string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  deleteTiempoLiturgia(id:string|number, estado:string|number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`,{params:{estado}})
  }
}
