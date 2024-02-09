import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = `${environment.backendUrl}/usuario`;
  constructor(
    private http: HttpClient,
    private router: Router) { }
  
  putResetear(body:FormData, id:string):Observable<any>{
    return this.http.put(`${this.url}/resetear/${id}`,body);
  }
}
