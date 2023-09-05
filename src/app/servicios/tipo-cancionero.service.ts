import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCancioneroService {
  url = `${environment.backendUrl}/tipocancionero`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTipoCancionero():Observable<any>{
    return this.http.get(this.url);
  }
  getTipoCancioneroID(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoCancionero(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putTipoCancionero(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body)
  }
  deleteTipoCancionero(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }
}
