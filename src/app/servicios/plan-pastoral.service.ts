import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanPastoralService {
  url = `${environment.backendUrl}/planpastoral`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getPlanPastoral(): Observable<any> {
    return this.http.get(this.url);
  }
  getPlanPastoralId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postPlanPastoral(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putPlanPastoral(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putPDFPlanPastoral(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/pdf/${id}`, body)
  }
  deletePlanPastoral(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
