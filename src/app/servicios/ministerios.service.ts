import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinisteriosService {
  url = `${environment.backendUrl}/ministerio`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getMinisterio(): Observable<any> {
    return this.http.get(this.url);
  }
  getMinisterioId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postMinisterio(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putMinisterio(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putLogoMinisterio(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/logo/${id}`, body)
  }
  putPDFMinisterio(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/pdf/${id}`, body)
  }
  deleteMinisterio(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
