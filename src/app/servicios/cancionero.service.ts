import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CancioneroForm } from '../interface/cancioner.interface';

@Injectable({
  providedIn: 'root'
})
export class CancioneroService {
  url = `${environment.backendUrl}/cancionero`;
  constructor(
    private http: HttpClient,
    private router: Router) { }
  getCancionero(estado: string): Observable<any> {
    return this.http.get(this.url, { params: { estado } });
  }
  getCancioneroId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postCancionero(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putCancionero(body: CancioneroForm, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putImagenCancionero(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/imagen/${id}`,body)
  }
  deleteCancionero(id: string, estado: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { params: { estado } });
  }
}
