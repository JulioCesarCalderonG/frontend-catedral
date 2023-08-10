import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  url=`${environment.backendUrl}/noticia`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getNoticias(estado:string):Observable<any>{
    return this.http.get(this.url,{params:{estado}})
  }
  getNoticiaId(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postNoticia(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putNoticia(body:FormData,id:number|string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  publicarNoticia(id:number,estado:string):Observable<any>{
    return this.http.delete(`${this.url}/${id}`,{params:{estado}});
  }
}
