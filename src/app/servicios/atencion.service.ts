import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AtencionService {
  url = `${environment.backendUrl}/atencion`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getAtencion():Observable<any>{
    return this.http.get(this.url);
  }
  getAtencionID(id:number):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }
  postAtencion(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
  putAtencion(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);
  }
  deleteAtencion(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }
}
