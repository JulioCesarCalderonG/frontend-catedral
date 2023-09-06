import { Component, OnInit } from '@angular/core';
import { Cancionero, ResultCancioneros } from 'src/app/interface/cancioner.interface';
import { ResultTipoCancioneros, Tipocancionero } from 'src/app/interface/tipo.cancionero';
import { CancioneroService } from 'src/app/servicios/cancionero.service';
import { TipoCancioneroService } from 'src/app/servicios/tipo-cancionero.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tipo-cancionero',
  templateUrl: './tipo-cancionero.component.html',
  styleUrls: ['./tipo-cancionero.component.css']
})
export class TipoCancioneroComponent implements OnInit{

  listTipoCancionero?:Tipocancionero[];
  listCancionero?:Cancionero[];
  url=`${environment.backendUrl}/tipocancionero/imagen`
  constructor(
    private tipoCancioneroService:TipoCancioneroService,
    private cancioneroService:CancioneroService
  ) {

  }

  ngOnInit(): void {
      this.mostrarTipoCancionero();
      this.mostrarCancionero();
  }

  mostrarTipoCancionero(){
    this.tipoCancioneroService.getTipoCancionero().subscribe({
      next:(data:ResultTipoCancioneros)=>{
        this.listTipoCancionero=data.tipocancionero;
        console.log(this.listTipoCancionero);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarCancionero(){
    this.cancioneroService.getCancionero('1').subscribe({
      next:(data:ResultCancioneros)=>{
        this.listCancionero = data.cancionero;
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){

  }
  eliminar(id:number){

  }
}
