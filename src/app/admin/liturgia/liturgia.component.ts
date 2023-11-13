import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Liturgia, LiturgiaForm, ResultLiturgia, ResultLiturgias } from 'src/app/interface/liturgia.interface';
import { LiturgiaService } from 'src/app/servicios/liturgia.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liturgia',
  templateUrl: './liturgia.component.html',
  styleUrls: ['./liturgia.component.css']
})
export class LiturgiaComponent implements OnInit{
  listLiturgia?:Liturgia[];
  estado:string='1';
  ids:string='';
  liturgiaForm:LiturgiaForm={
    logo:'',
    nombre:'',
    pdf:''
  };
  editarLiturgiaForm:LiturgiaForm={
    nombre:''
  };
  logoLiturgiaForm:LiturgiaForm={
    logo:''
  };
  pdfLiturgiaForm:LiturgiaForm={
    logo:''
  };
  url=`${environment.backendUrl}/liturgia/imagen`;
  urlPDF = `${environment.backendUrl}/liturgia/pdf`;
  imgDefault:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFiles?: File;
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;

  imgDefaultPDF: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFilePDF?: File;
  @ViewChild('fileInputPDF', { static: false }) fileInputPDF?: ElementRef;
  p: number = 1;
  constructor(
    private liturgiaService:LiturgiaService,
    private toastr:ToastrService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ){

  }

  ngOnInit(): void {
    this.mostrarLiturgia()
  }

  mostrarLiturgia(){
    this.liturgiaService.getLiturgia(this.estado).subscribe({
      next:(data:ResultLiturgias)=>{
        this.listLiturgia = data.liturgia;
        console.log(this.listLiturgia);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarLiturgia(){
    if (this.liturgiaForm.logo==='' || this.liturgiaForm.nombre==='', this.liturgiaForm.pdf==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('nombre',this.liturgiaForm.nombre!);
    formData.append('logo',this.uploadFiles!);
    formData.append('archivo', this.uploadFilePDF!);
    this.liturgiaService.postLiturgia(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarLiturgia();
        this.cancelar();
        this.wsService.emit('nueva-liturgia');
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarLiturgia(){
    if (this.editarLiturgiaForm.nombre==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    this.liturgiaService.putLiturgia(this.editarLiturgiaForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Editado');
        this.mostrarLiturgia();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarLogoLiturgia(){
    if (this.logoLiturgiaForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFiles!);
    this.liturgiaService.putLogoLiturgia(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarLiturgia();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarPDFLiturgia(){
    if (this.pdfLiturgiaForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('archivo',this.uploadFilePDF!);
    this.liturgiaService.putPDFLiturgia(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarLiturgia();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.liturgiaService.getLiturgiaID(id).subscribe({
      next:(data:ResultLiturgia)=>{
        this.editarLiturgiaForm={
          nombre:data.liturgia.nombre,
        }

        this.ids=String(data.liturgia.id);
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  habiDesLiturgia(id:number,estado:number){
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
        this.liturgiaService.deleteLiturgia(id,String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarLiturgia();
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
      this.liturgiaForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.liturgiaForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.liturgiaForm.logo='cargado';
      });
    }
  }
  capturarFile2(event:any){
    this.uploadFiles = event.target.files[0];
    console.log(this.uploadFiles);
    if (!this.uploadFiles) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.logoLiturgiaForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.logoLiturgiaForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        this.imgDefault = imagen.base;
        this.logoLiturgiaForm.logo='cargado';
      });
    }
  }
  capturarFileImagen(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.liturgiaForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFilePDF!.size > 1072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.liturgiaForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.liturgiaForm.pdf = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.pdfLiturgiaForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFilePDF!.size > 1072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.pdfLiturgiaForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.pdfLiturgiaForm.pdf = 'cargado';
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
    this.mostrarLiturgia();
  }
  cancelar(){
    this.liturgiaForm={
      nombre:'',
      logo:'',
      pdf:''
    }
    this.editarLiturgiaForm={
      nombre:'',
    }
    this.logoLiturgiaForm={
      logo:'',
    }
    this.pdfLiturgiaForm={
      pdf:''
    }
    this.ids='';
    this.reset();
  }
}
