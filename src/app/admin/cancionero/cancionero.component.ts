import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Cancionero, CancioneroForm, ResultCancionero, ResultCancioneros } from 'src/app/interface/cancioner.interface';
import { CancioneroService } from 'src/app/servicios/cancionero.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancionero',
  templateUrl: './cancionero.component.html',
  styleUrls: ['./cancionero.component.css']
})
export class CancioneroComponent implements OnInit{

  listCancionero?:Cancionero[];
  estado:string='1';
  ids:string='';
  cancioneroForm:CancioneroForm={
    nombre:'',
    logo:''
  }
  editarCancioneroForm:CancioneroForm={
    nombre:'',
  }
  logocancioneroForm:CancioneroForm={
    logo:''
  }
  url=`${environment.backendUrl}/cancionero/imagen`;
  imgDefault:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFiles?: File;
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;

  constructor(
    private cancioneroService:CancioneroService,
    private toastr:ToastrService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ){

  }

  ngOnInit(): void {
    this.mostrarCancionero();
  }

  mostrarCancionero(){
    this.cancioneroService.getCancionero(this.estado).subscribe({
      next:(data:ResultCancioneros)=>{
        this.listCancionero=data.cancionero
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarCancionero(){
    if (this.cancioneroForm.nombre==='' || this.cancioneroForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('nombre',this.cancioneroForm.nombre!);
    formData.append('logo',this.uploadFiles!);
    this.cancioneroService.postCancionero(formData).subscribe({
      next:data=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarCancionero();
        this.cancelar();
        this.wsService.emit('nueva-cancionero');
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarCancionero(){
    if (this.editarCancioneroForm.nombre==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    this.cancioneroService.putCancionero(this.editarCancioneroForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Editado');
        this.mostrarCancionero();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarLogoOraciones(){
    if (this.logocancioneroForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFiles!);
    this.cancioneroService.putImagenCancionero(formData,this.ids).subscribe({
      next:(data)=>{
        console.log(data);

        this.toastr.success(data.msg,'EDITADO');
        this.mostrarCancionero();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  habiDesCancionero(id:number,estado:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara deshabilitado el cancionero":"Se habilitara el cancionero",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancioneroService.deleteCancionero(String(id),String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarCancionero();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.cancioneroService.getCancioneroId(id).subscribe({
      next:(data:ResultCancionero)=>{
        this.editarCancioneroForm={
          nombre:data.cancionero.nombre,
        }
        this.ids=String(data.cancionero.id);
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarCancionero();
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.cancioneroForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.cancioneroForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.cancioneroForm.logo='cargado';
      });
    }
  }
  capturarFile2(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.logocancioneroForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.logocancioneroForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.logocancioneroForm.logo='cargado';
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
    this.cancioneroForm={
      nombre:'',
      logo:'',
    }
    this.editarCancioneroForm={
      nombre:'',
    }
    this.logocancioneroForm={
      logo:'',
    }
    this.ids='';
    this.reset();
  }
}
