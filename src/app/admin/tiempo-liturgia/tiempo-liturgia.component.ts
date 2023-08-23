import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResultTiempoLiturgias, TiempoLiturgiaForm, Tiempoliturgia } from 'src/app/interface/tiempo.liturgia.interface';
import { TiempoLiturgiaService } from 'src/app/servicios/tiempo-liturgia.service';

@Component({
  selector: 'app-tiempo-liturgia',
  templateUrl: './tiempo-liturgia.component.html',
  styleUrls: ['./tiempo-liturgia.component.css']
})
export class TiempoLiturgiaComponent implements OnInit{

  listTiempoLiturgia?:Tiempoliturgia[];
  tiempoLiturgiaForm:TiempoLiturgiaForm={
    descripcion:''
  }
  editarTiempoLiturgiaForm:TiempoLiturgiaForm={
    descripcion:''
  }
  ids:string='';
  estado:string='1';
  constructor(
    private tiempoLiturgiaService:TiempoLiturgiaService,
    private toastr:ToastrService
  ) {

  }

  ngOnInit(): void {
    this.mostrarTiempo();
  }

  mostrarTiempo(){
    this.tiempoLiturgiaService.getTiempoLiturgia(this.estado).subscribe({
      next:(data:ResultTiempoLiturgias)=>{
        this.listTiempoLiturgia= data.tiempoliturgia;
        console.log(this.listTiempoLiturgia);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarTiempoLiturgia(){

  }
  obtenerDatos(id:number){

  }
  eliminarTiempoLiturgia(id:number){

  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarTiempo();
  }
  cancelar(){

  }
}
