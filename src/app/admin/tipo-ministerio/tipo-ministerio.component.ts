import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Ministerio, ResultMinisterios } from 'src/app/interface/ministerios.interface';
import { ResultTipoMinisterio, ResultTipoMinisterios, TipoMinisterio, TipoMinisterioForm } from 'src/app/interface/tipo.ministerio.interface';
import { MinisteriosService } from 'src/app/servicios/ministerios.service';
import { TipoMinisterioService } from 'src/app/servicios/tipo-ministerio.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-ministerio',
  templateUrl: './tipo-ministerio.component.html',
  styleUrls: ['./tipo-ministerio.component.css'],
  template: `
  <ckeditor
    [(ngModel)]="ckeditorContent"
    [config]="{uiColor: '#99000'}"
    [readonly]="false"
    (change)="onChange($event)"
    (editorChange)="onEditorChange($event)" <!-- CKEditor change event -->
    (ready)="onReady($event)"
    (focus)="onFocus($event)"
    (blur)="onBlur($event)"
    (contentDom)="onContentDom($event)"
    (fileUploadRequest)="onFileUploadRequest($event)"
    (fileUploadResponse)="onFileUploadResponse($event)"
    (paste)="onPaste($event)"
    (drop)="onDrop($event)"
    debounce="500">
  </ckeditor>
  `,
})
export class TipoMinisterioComponent implements OnInit {
  listTipoMinisterio?:TipoMinisterio[];
  listMinisterio?:Ministerio[];
  tipoMinisterioForm:TipoMinisterioForm={
    descripcion:'',
    titulo:'',
    id_ministerio:'',
    nom_fecha:''
  }
  editarTipoMinisterioForm:TipoMinisterioForm={
    descripcion:'',
    titulo:'',
    id_ministerio:'',
    nom_fecha:''
  }
  ids:string='';
  estado:string='1';
  p: number = 1;
  constructor(
    private tipoMinisterioService:TipoMinisterioService,
    private ministerioService:MinisteriosService,
    private toastr:ToastrService,
    private wsService:WebsocketService
  ){

  }
  ngOnInit(): void {
    this.mostrarTipoMinisterio();
    this.mostrarMinisterio();
  }
  mostrarTipoMinisterio(){
    this.tipoMinisterioService.getTipoLiturgia().subscribe({
      next:(data:ResultTipoMinisterios)=>{
        this.listTipoMinisterio=data.tipoMinisterio;
        console.log(this.listTipoMinisterio);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarMinisterio() {
    this.ministerioService.getMinisterio().subscribe({
      next: (data: ResultMinisterios) => {
        this.listMinisterio = data.ministerio;
        console.log(this.listMinisterio);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarTipoMinisterio(){
    if (this.tipoMinisterioForm.descripcion==='' || this.tipoMinisterioForm.titulo==='' || this.tipoMinisterioForm.id_ministerio==='') {
      this.toastr.error('Todos los campos son obligatorios','ALERTA');
      return;
    }
    this.tipoMinisterioService.postTipoLiturgia(this.tipoMinisterioForm).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarTipoMinisterio();
        this.cancelar();
        this.wsService.emit('nueva-tipo-ministerio');
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarTipoMinisterio(){
    if (this.editarTipoMinisterioForm.descripcion==='' || this.editarTipoMinisterioForm.titulo==='' || this.editarTipoMinisterioForm.id_ministerio==='') {
      this.toastr.error('Todos los campos son obligatorios','ALERTA');
      return;
    }
    this.tipoMinisterioService.putTipoLiturgia(this.editarTipoMinisterioForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoMinisterio();
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarTipoMinisterio(id:number){
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
        this.tipoMinisterioService.deleteTipoLiturgia(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarTipoMinisterio();
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

    this.tipoMinisterioService.getTipoLiturgiaID(id).subscribe({
      next:(data:ResultTipoMinisterio)=>{
        console.log(data);

        this.ids= String(data.tipoMinisterio.id);
        this.editarTipoMinisterioForm={
          descripcion:data.tipoMinisterio.descripcion,
          titulo:data.tipoMinisterio.titulo,
          id_ministerio:String(data.tipoMinisterio.id_ministerio),
          nom_fecha:data.tipoMinisterio.nom_fecha
        }
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  cancelar(){
    this.tipoMinisterioForm={
      descripcion:'',
      titulo:'',
      id_ministerio:'',
      nom_fecha:''
    }
    this.editarTipoMinisterioForm={
      descripcion:'',
      titulo:'',
      id_ministerio:'',
      nom_fecha:''
    }
    this.ids='';
  }
}
