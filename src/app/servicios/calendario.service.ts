import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  url = `${environment.backendUrl}/calendario`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getCalendario(): Observable<any> {
    return this.http.get(this.url);
  }
  getCalendarioId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postCalendario(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putCalendario(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putImagenCalendario(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/img/${id}`, body)
  }
  deleteCalendario(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
