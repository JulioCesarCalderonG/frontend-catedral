import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TipoIniciacionService {
  url = `${environment.backendUrl}/tipoiniciacion`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTipoIniciacion():Observable<any>{
    return this.http.get(this.url);
  }
  getTipoIniciacionID(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoIniciacion(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putTipoIniciacion(body:FormData, id:string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  deleteTipoIniciacion(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }
}
