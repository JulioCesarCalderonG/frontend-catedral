import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Lugar } from '../interface/lugar.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorioService {
  url = `${environment.backendUrl}/directorio`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getDirectorio(estado: string): Observable<any> {
    return this.http.get(this.url, { params: { estado } });
  }
  getDirectorioId(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  postDirectorio(body: FormData): Observable<any> {
    return this.http.post(this.url, body);
  }
  putDirectorio(body: FormData, id: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }
  putLogoDirectorio(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/logo/${id}`,body)
  }
  putImagenDirectorio(body:FormData,id:string):Observable<any>{
    return this.http.put(`${this.url}/imagen/${id}`,body)
  }
  putLocalizacion(lugar:Lugar,id:string):Observable<any>{
    return this.http.put(`${this.url}/localizacion/${id}`,lugar);
  }
  deleteDirectorio(id: string, estado: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { params: { estado } });
  }


}
