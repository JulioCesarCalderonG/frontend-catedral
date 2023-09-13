import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { Cancionero, ResultCancioneros } from 'src/app/interface/cancioner.interface';
import { LogoTipoCancioneroForm, ResultTipoCancionero, ResultTipoCancioneros, TipoCancioneroForm, Tipocancionero } from 'src/app/interface/tipo.cancionero';
import { CancioneroService } from 'src/app/servicios/cancionero.service';
import { TipoCancioneroService } from 'src/app/servicios/tipo-cancionero.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-cancionero',
  templateUrl: './tipo-cancionero.component.html',
  styleUrls: ['./tipo-cancionero.component.css']
})
export class TipoCancioneroComponent implements OnInit{

  listTipoCancionero?:Tipocancionero[];
  listCancionero?:Cancionero[];
  tipoCancioneroForm:TipoCancioneroForm={
    descripcion:'',
    id_cancionero:'',
    numero:'',
    subdescripcion:'',
    titulo:'',
    logo:''
  }
  editarTipoCancioneroForm:TipoCancioneroForm={
    descripcion:'',
    id_cancionero:'',
    numero:'',
    subdescripcion:'',
    titulo:'',
    logo:''
  }
  logoTipoCancioneroForm:LogoTipoCancioneroForm={
    logo:''
  }
  ids:string='';
  url=`${environment.backendUrl}/tipocancionero/imagen`;
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
  imgDefault:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFiles?: File;
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;
  constructor(
    private tipoCancioneroService:TipoCancioneroService,
    private cancioneroService:CancioneroService,
    private sanitizer: DomSanitizer,
    private toastr:ToastrService,
    private wsService:WebsocketService
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
  agregarTipoCancionero(){
    if (this.tipoCancioneroForm.descripcion===''|| this.tipoCancioneroForm.id_cancionero===''||
    this.tipoCancioneroForm.logo===''||this.tipoCancioneroForm.numero===''||this.tipoCancioneroForm.subdescripcion===''
    || this.tipoCancioneroForm.titulo==='') {
      this.toastr.warning('Completar todos los datos solicitados','Datos Incompletos')
    }else{
      const formData = new FormData();
      formData.append('titulo',this.tipoCancioneroForm.titulo);
      formData.append('descripcion',this.tipoCancioneroForm.descripcion);
      formData.append('subdescripcion',this.tipoCancioneroForm.subdescripcion);
      formData.append('id_cancionero',this.tipoCancioneroForm.id_cancionero);
      formData.append('numero',this.tipoCancioneroForm.numero);
      formData.append('logo',this.uploadFiles!)
      this.tipoCancioneroService.postTipoCancionero(formData).subscribe({
        next:(data)=>{
          this.mostrarTipoCancionero();
          this.toastr.success(data.msg,'Registrado');
          this.cancelar();
          this.wsService.emit('nueva-cancionero');
        },
        error:error=>{
          console.log(error);

        }
      })

    }
  }
  editarTipoCancionero(){
    if (this.editarTipoCancioneroForm.descripcion===''|| this.editarTipoCancioneroForm.id_cancionero===''||
    this.editarTipoCancioneroForm.logo===''||this.editarTipoCancioneroForm.numero===''||this.editarTipoCancioneroForm.subdescripcion===''
    || this.editarTipoCancioneroForm.titulo==='') {
      this.toastr.warning('Completar todos los datos solicitados','Datos Incompletos')
    }else{
      const formData = new FormData();
      formData.append('titulo',this.editarTipoCancioneroForm.titulo);
      formData.append('descripcion',this.editarTipoCancioneroForm.descripcion);
      formData.append('subdescripcion',this.editarTipoCancioneroForm.subdescripcion);
      formData.append('id_cancionero',this.editarTipoCancioneroForm.id_cancionero);
      formData.append('numero',this.editarTipoCancioneroForm.numero);
      this.tipoCancioneroService.putTipoCancionero(formData,this.ids).subscribe({
        next:(data)=>{
          this.mostrarTipoCancionero();
          this.toastr.success(data.msg,'Registrado');
        },
        error:error=>{
          console.log(error);

        }
      })
    }
  }
  editarLogoCancionero(){
    if (this.logoTipoCancioneroForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFiles!);
    this.tipoCancioneroService.putLogoTipoCancionero(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoCancionero();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.tipoCancioneroService.getTipoCancioneroID(id).subscribe({
      next:(data:ResultTipoCancionero)=>{
        this.editarTipoCancioneroForm={
          descripcion:data.tipocancionero.descripcion,
          subdescripcion:data.tipocancionero.subdescripcion,
          id_cancionero:`${data.tipocancionero.id_cancionero}`,
          numero:data.tipocancionero.numero,
          titulo:data.tipocancionero.titulo
        }
        this.ids=String(data.tipocancionero.id);
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  eliminar(id:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se eliminara el tipo de Cancionero!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText:'cancelar'
    }).then((result) => {
        this.tipoCancioneroService.deleteTipoCancionero(id).subscribe({
          next:data=>{
            if (result.isConfirmed) {
              Swal.fire(
                'Eliminado!',
                data.msg,
                'success'
              )
            }
            this.mostrarTipoCancionero();
          },
          error:error=>{
            console.log(error);

          }
        })

    })
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.tipoCancioneroForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.tipoCancioneroForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.tipoCancioneroForm.logo='cargado';
      });
    }
  }
  capturarFile2(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.logoTipoCancioneroForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.logoTipoCancioneroForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.logoTipoCancioneroForm.logo='cargado';
      });
    }
  }
  extraserBase64 = async($event :any)=> new Promise((resolve, reject)=>{
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload=()=>{
        resolve({
          base: reader.result
        })
      };
      reader.onerror=error=>{
        resolve({
          base: null
        })
      }
    } catch (e) {
      reject(e)
    }
  });
  reset(){
    this.fileInput!.nativeElement.value = "";
    this.imgDefault='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  cancelar(){
    this.tipoCancioneroForm={
      descripcion:'',
      id_cancionero:'',
      numero:'',
      subdescripcion:'',
      titulo:'',
      logo:''
    }
    this.editarTipoCancioneroForm={
      descripcion:'',
      id_cancionero:'',
      numero:'',
      subdescripcion:'',
      titulo:'',
      logo:''
    }
    this.ids='';
    this.reset();
  }
}
