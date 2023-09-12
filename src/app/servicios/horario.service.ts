import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  url = `${environment.backendUrl}/horario`;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  getHorarios():Observable<any>{
    return this.http.get(this.url,{params:{estado:1}});
  }
}
