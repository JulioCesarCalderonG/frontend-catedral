import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Liturgia, ResultLiturgias } from 'src/app/interface/liturgia.interface';
import { ResultTiempoLiturgias, Tiempoliturgia } from 'src/app/interface/tiempo.liturgia.interface';
import { ResultTipoLiturgia, ResultTipoLiturgias, TipoLiturgiaForm, Tipoliturgia } from 'src/app/interface/tipo.liturgia.interface';
import { LiturgiaService } from 'src/app/servicios/liturgia.service';
import { TiempoLiturgiaService } from 'src/app/servicios/tiempo-liturgia.service';
import { TipoLiturgiaService } from 'src/app/servicios/tipo-liturgia.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
import { WebsocketService } from 'src/app/socket/websocket.service';
@Component({
  selector: 'app-tipo-liturgia',
  templateUrl: './tipo-liturgia.component.html',
  styleUrls: ['./tipo-liturgia.component.css']
})
export class TipoLiturgiaComponent implements OnInit{

  listTipoLiturgia?:Tipoliturgia[];
  listTiempoLiturgia?:Tiempoliturgia[];
  listLiturgia?:Liturgia[];
  tipoLiturgiaForm:TipoLiturgiaForm={
    descripcion:'',
    fecha:'',
    id_liturgia:'',
    id_tiempo:'',
    nom_fecha:''
  }
  editarTipoLiturgiaForm:TipoLiturgiaForm={
    descripcion:'',
    fecha:'',
    id_liturgia:'',
    id_tiempo:'',
    nom_fecha:''
  }
  ids:string='';
  estado:string='1';
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '200px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',

  };
  constructor(
    private tipoLiturgiaService:TipoLiturgiaService,
    private tiempoLiturgiaService:TiempoLiturgiaService,
    private liturgiaService:LiturgiaService,
    private toastr:ToastrService,
    private wsService:WebsocketService
  ){

  }

  ngOnInit(): void {
    this.mostrarTipoLiturgia();
    this.mostrarTiempoLiturgia();
    this.mostrarLiturgia();
  }

  mostrarTipoLiturgia(){
    this.tipoLiturgiaService.getTipoLiturgia().subscribe({
      next:(data:ResultTipoLiturgias)=>{
        this.listTipoLiturgia=data.tipoliturgia;
        console.log(this.listTipoLiturgia);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarTiempoLiturgia(){
    this.tiempoLiturgiaService.getTiempoLiturgia(this.estado).subscribe({
      next:(data:ResultTiempoLiturgias)=>{
        this.listTiempoLiturgia=data.tiempoliturgia;
        console.log(this.listTiempoLiturgia);

      }
    })
  }
  mostrarLiturgia(){
    this.liturgiaService.getLiturgia(this.estado).subscribe({
      next:(data:ResultLiturgias)=>{
        this.listLiturgia= data.liturgia;
        console.log(this.listLiturgia);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarTipoLiturgia(){
    if (this.tipoLiturgiaForm.descripcion==='' || this.tipoLiturgiaForm.fecha==='' || this.tipoLiturgiaForm.id_liturgia===''
        || this.tipoLiturgiaForm.id_tiempo==='' || this.tipoLiturgiaForm.nom_fecha===''
    ) {
      this.toastr.error('Todos los campos son obligatorios','ALERTA');
      return;
    }
    this.tipoLiturgiaService.postTipoLiturgia(this.tipoLiturgiaForm).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarTipoLiturgia();
        this.cancelar();
        this.wsService.emit('nueva-liturgia');
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarTipoLiturgia(){
    if (this.editarTipoLiturgiaForm.descripcion==='' || this.editarTipoLiturgiaForm.fecha==='' || this.editarTipoLiturgiaForm.id_liturgia===''
        || this.editarTipoLiturgiaForm.id_tiempo==='' || this.editarTipoLiturgiaForm.nom_fecha===''
    ) {
      this.toastr.error('Todos los campos son obligatorios','ALERTA');
      return;
    }
    this.tipoLiturgiaService.putTipoLiturgia(this.editarTipoLiturgiaForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoLiturgia();
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarTipoLiturgia(id:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Se eliminara este ministerio!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoLiturgiaService.deleteTipoLiturgia(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarTipoLiturgia();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    console.log(id);

    this.tipoLiturgiaService.getTipoLiturgiaID(id).subscribe({
      next:(data:ResultTipoLiturgia)=>{
        console.log(data);

        this.ids= String(data.tipoliturgia.id);
        this.editarTipoLiturgiaForm={
          descripcion:data.tipoliturgia.descripcion,
          fecha:data.tipoliturgia.fecha,
          id_liturgia:String(data.tipoliturgia.id_liturgia),
          id_tiempo:String(data.tipoliturgia.id_tiempo),
          nom_fecha:data.tipoliturgia.nom_fecha
        }
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  cancelar(){
    this.tipoLiturgiaForm={
      descripcion:'',
      fecha:'',
      id_liturgia:'',
      id_tiempo:'',
      nom_fecha:''
    }
    this.editarTipoLiturgiaForm={
      descripcion:'',
      fecha:'',
      id_liturgia:'',
      id_tiempo:'',
      nom_fecha:''
    }
    this.ids='';
  }
}
