import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoticiaImagenService {

  url=`${environment.backendUrl}/noticiaimagen`
  constructor(
    private http:HttpClient
  ) { }

  getNotiImagenIdNoticia(id:number|string):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }

}
