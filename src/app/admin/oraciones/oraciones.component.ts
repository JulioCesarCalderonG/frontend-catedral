import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Oracione, OracionesForm, ResultOracion, ResultOraciones } from 'src/app/interface/oracion.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OracionesService } from 'src/app/servicios/oraciones.service';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { WebsocketService } from 'src/app/socket/websocket.service';

@Component({
  selector: 'app-oraciones',
  templateUrl: './oraciones.component.html',
  styleUrls: ['./oraciones.component.css']
})
export class OracionesComponent implements OnInit{

  listOraciones?:Oracione[];
  estado:string='1';
  url=`${environment.backendUrl}/oraciones/imagen`;
  oracionForm:OracionesForm={
    nombre:'',
    logo:'',
    multiple:''
  }
  editarOracionForm:OracionesForm={
    nombre:'',
    multiple:''
  }
  logoOracionForm:OracionesForm={
    logo:''
  }
  imgDefault:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFiles?: File;
  ids:string='';
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;
  constructor(
    private oracionService:OracionesService,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ){
  }

  ngOnInit(): void {
    this.mostrarOraciones();
  }
  mostrarOraciones(){
    this.oracionService.getOraciones(this.estado).subscribe({
      next:(data:ResultOraciones)=>{
        this.listOraciones = data.oraciones;
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  agregarOraciones(){
    if (this.oracionForm.logo==='' || this.oracionForm.multiple==='' || this.oracionForm.nombre==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('nombre',this.oracionForm.nombre!);
    formData.append('multiple',this.oracionForm.multiple!);
    formData.append('logo',this.uploadFiles!);
    this.oracionService.postOraciones(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarOraciones();
        this.cancelar();
        this.wsService.emit('nueva-oracion');
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarOraciones(){
    if (this.editarOracionForm.nombre===''||this.editarOracionForm.multiple==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    this.oracionService.putOraciones(this.editarOracionForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Editado');
        this.mostrarOraciones();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarLogoOraciones(){
    if (this.logoOracionForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFiles!);
    this.oracionService.putOracionesLogo(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarOraciones();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  habiDesOraciones(id:number,estado:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara deshabilitado la oracion":"Se habilitara la oracion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.oracionService.deleteOraciones(id,String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarOraciones();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.oracionService.getOracionId(id).subscribe({
      next:(data:ResultOracion)=>{
        this.editarOracionForm={
          nombre:data.oraciones.nombre,
          multiple:String(data.oraciones.multiple)
        }

        this.ids=String(data.oraciones.id);
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatosLogo(id:number){
    this.oracionService.getOracionId(id).subscribe({
      next:(data:ResultOracion)=>{
        this.ids=String(data.oraciones.id);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarOraciones();
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.oracionForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.oracionForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.oracionForm.logo='cargado';
      });
    }
  }
  capturarFile2(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.logoOracionForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.logoOracionForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.logoOracionForm.logo='cargado';
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
    this.oracionForm={
      nombre:'',
      logo:'',
      multiple:''
    }
    this.editarOracionForm={
      nombre:'',
      multiple:''
    }
    this.logoOracionForm={
      logo:'',
    }
    this.ids='';
    this.reset();
  }
}
