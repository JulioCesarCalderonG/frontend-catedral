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
  postNoticia(body:FormData):Observable<any>{
    return this.http.post(this.url,body);
  }
}
