import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TipoMinisterioForm } from '../interface/tipo.ministerio.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoMinisterioService {
  url = `${environment.backendUrl}/tipoministerio`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTipoLiturgia():Observable<any>{
    return this.http.get(this.url);
  }
  getTipoLiturgiaID(id:string|number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoLiturgia(body:TipoMinisterioForm):Observable<any>{
    return this.http.post(this.url,body);
  }
  putTipoLiturgia(body:TipoMinisterioForm,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  deleteTipoLiturgia(id:string| number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }

}
