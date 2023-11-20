import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TipoMaterialService {
  url = `${environment.backendUrl}/tipomaterial`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getTipoMaterial(): Observable<any> {
    return this.http.get(this.url);
  }
  getTipoMaterialId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postTipoMaterial(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putTipoMaterial(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putPDFTipoMaterial(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/pdf/${id}`, body)
  }
  deleteTipoMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
