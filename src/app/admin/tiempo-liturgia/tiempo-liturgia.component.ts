import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResultTiempoLiturgia, ResultTiempoLiturgias, TiempoLiturgiaForm, Tiempoliturgia } from 'src/app/interface/tiempo.liturgia.interface';
import { TiempoLiturgiaService } from 'src/app/servicios/tiempo-liturgia.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import Swal from 'sweetalert2';

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
    private toastr:ToastrService,

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
    if (this.tiempoLiturgiaForm.descripcion==='') {
      this.toastr.warning('El campo descripcion es obligatorio','Datos incompletos');
    }else{
      this.tiempoLiturgiaService.postTiempoLiturgia(this.tiempoLiturgiaForm).subscribe({
        next:(data)=>{
          this.mostrarTiempo();
          this.toastr.success(data.msg,'Registrado');
          this.cancelar();
        },
        error:error=>{
          console.log(error);

        }
      })
    }
  }
  editarTiempoLiturgia(){
    if (this.editarTiempoLiturgiaForm.descripcion==='') {
      this.toastr.warning('El campo descripcion es obligatorio','Datos incompletos');
    }else{
      this.tiempoLiturgiaService.putTiempoLiturgia(this.editarTiempoLiturgiaForm,this.ids).subscribe({
        next:(data)=>{
          this.mostrarTiempo();
          this.toastr.success(data.msg,'EDITADO')
        },
        error:error=>{
          console.log(error);

        }
      })
    }
  }
  obtenerDatos(id:number){
    this.tiempoLiturgiaService.getTiempoLiturgiaID(id).subscribe({
      next:(data:ResultTiempoLiturgia)=>{
        this.editarTiempoLiturgiaForm={
          descripcion:data.tiempoliturgia.descripcion
        }
        this.ids=String(data.tiempoliturgia.id);
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarTiempoLiturgia(id:number,estado:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara deshabilitado el tiempo liturgia":"Se habilitara el tiempo liturgia",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tiempoLiturgiaService.deleteTiempoLiturgia(id,String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarTiempo();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarTiempo();
  }
  cancelar(){
    this.tiempoLiturgiaForm={
      descripcion:''
    }
    this.editarTiempoLiturgiaForm={
      descripcion:''
    }
    this.ids='';
  }
}
