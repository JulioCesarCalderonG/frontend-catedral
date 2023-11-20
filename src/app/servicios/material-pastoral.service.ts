import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MaterialPastoralService {
  url = `${environment.backendUrl}/materialpastoral`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getMaterial(estado:string): Observable<any> {
    return this.http.get(this.url,{params:{estado}});
  }
  getMaterialId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postMaterial(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putMaterial(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putLogoMaterial(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/logo/${id}`, body)
  }
  putPDFMaterial(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/pdf/${id}`, body)
  }
  deleteMaterial(id: number,estado:number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`,{params:{estado}});
  }

}
