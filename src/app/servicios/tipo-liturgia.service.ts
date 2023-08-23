import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TipoLiturgiaForm } from '../interface/tipo.liturgia.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoLiturgiaService {
  url = `${environment.backendUrl}/tipoliturgia`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTipoLiturgia():Observable<any>{
    return this.http.get(this.url);
  }
  getTipoLiturgiaID(id:string|number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoLiturgia(body:TipoLiturgiaForm):Observable<any>{
    return this.http.post(this.url,body);
  }
  putTipoLiturgia(body:TipoLiturgiaForm,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  deleteTipoLiturgia(id:string| number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }

}
