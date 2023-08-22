import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { LiturgiaForm } from '../interface/liturgia.interface';

@Injectable({
  providedIn: 'root'
})
export class LiturgiaService {
  url = `${environment.backendUrl}/liturgia`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getLiturgia(estado:string):Observable<any>{
    return this.http.get(this.url,{params:{estado}});
  }
  getLiturgiaID(id:string | number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postLiturgia(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putLiturgia(body:LiturgiaForm,id:string| number):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  putLogoLiturgia(body:FormData,id:string|number):Observable<any>{
    return this.http.put(`${this.url}/imagen/${id}`,body);
  }
  deleteLiturgia(id:string|number,  estado:string):Observable<any>{
    return this.http.delete(`${this.url}/${id}`,{params:{estado}});
  }
}

