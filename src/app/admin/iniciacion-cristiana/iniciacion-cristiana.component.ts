import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Iniciacion, IniciacionForm, ResultIniciacion, ResultIniciaciones } from 'src/app/interface/iniciacion.interface';
import { IniciacionService } from 'src/app/servicios/iniciacion.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iniciacion-cristiana',
  templateUrl: './iniciacion-cristiana.component.html',
  styleUrls: ['./iniciacion-cristiana.component.css']
})
export class IniciacionCristianaComponent implements OnInit{

  listIniciacion?:Iniciacion[];
  estado:string='1';
  ids:string='';
  iniciacionForm:IniciacionForm={
    logo:'',
    nombre:''
  };
  editarIniciacionForm:IniciacionForm={
    nombre:''
  };
  logoIniciacionForm:IniciacionForm={
    logo:''
  };
  url=`${environment.backendUrl}/iniciacion/logo`;
  imgDefault:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFiles?: File;
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;
  constructor(
    private iniciacionService:IniciacionService,
    private toastr:ToastrService,
    private sanitizer: DomSanitizer
  ){

  }

  ngOnInit(): void {
    this.mostrarIniciacion();
  }

  mostrarIniciacion(){
    this.iniciacionService.getIniciacion(this.estado).subscribe({
      next:(data:ResultIniciaciones)=>{
        this.listIniciacion = data.iniciacion;
        console.log(this.listIniciacion);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarIniciacion(){
    if (this.iniciacionForm.logo==='' || this.iniciacionForm.nombre==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('nombre',this.iniciacionForm.nombre!);
    formData.append('logo',this.uploadFiles!);
    this.iniciacionService.postIniciacion(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarIniciacion();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarIniciacion(){
    if (this.editarIniciacionForm.nombre==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    this.iniciacionService.putIniciacion(this.editarIniciacionForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Editado');
        this.mostrarIniciacion();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarLogoIniciacion(){
    if (this.logoIniciacionForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFiles!);
    this.iniciacionService.putLogoIniciacion(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarIniciacion();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.iniciacionService.getIniciacionID(id).subscribe({
      next:(data:ResultIniciacion)=>{
        this.editarIniciacionForm={
          nombre:data.iniciacion.nombre,
        }

        this.ids=String(data.iniciacion.id);
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  habiDesIniciacion(id:number,estado:number){
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
        this.iniciacionService.deleteIniciacion(id,String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarIniciacion();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.iniciacionForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.iniciacionForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.iniciacionForm.logo='cargado';
      });
    }
  }
  capturarFile2(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.logoIniciacionForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.logoIniciacionForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.logoIniciacionForm.logo='cargado';
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
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarIniciacion();
  }
  cancelar(){
    this.iniciacionForm={
      nombre:'',
      logo:'',
    }
    this.editarIniciacionForm={
      nombre:'',
    }
    this.logoIniciacionForm={
      logo:'',
    }
    this.ids='';
    this.reset();
  }
}
