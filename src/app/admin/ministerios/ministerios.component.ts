import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  LogoMinisterioForm,
  Ministerio,
  MinisterioForm,
  ResultMinisterio,
  ResultMinisterios,
} from 'src/app/interface/ministerios.interface';
import { MinisteriosService } from 'src/app/servicios/ministerios.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ministerios',
  templateUrl: './ministerios.component.html',
  styleUrls: ['./ministerios.component.css'],
})
export class MinisteriosComponent implements OnInit {
  listMinisterio?: Ministerio[];
  urlPDF = `${environment.backendUrl}/ministerio/pdf`;
  urlLogo = `${environment.backendUrl}/ministerio/logo`;
  ids: string = '';
  ministerioForm: MinisterioForm = {
    nombre: '',
    titulo: '',
    logo: '',
    pdf: '',
  };
  editarMinisterioForm:MinisterioForm={
    nombre:'',
    titulo:''
  }
  logoMinisterioForm:LogoMinisterioForm={
    logo:''
  }
  pdfMinisterioForm:LogoMinisterioForm={
    pdf:''
  }
  imgDefaultLogo: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFileLogo?: File;
  @ViewChild('fileInputLogo', { static: false }) fileInputLogo?: ElementRef;

  imgDefaultPDF: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFilePDF?: File;
  @ViewChild('fileInputPDF', { static: false }) fileInputPDF?: ElementRef;
  constructor(
    private ministerioService: MinisteriosService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.mostrarMinisterio();
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
  agregarDirectorio() {
    if (
      this.ministerioForm.nombre === '' ||
      this.ministerioForm.titulo === '' ||
      this.ministerioForm.logo === '' ||
      this.ministerioForm.pdf === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', this.ministerioForm.nombre);
    formData.append('titulo', this.ministerioForm.titulo!);
    formData.append('logo', this.uploadFileLogo!);
    formData.append('archivo', this.uploadFilePDF!);
    this.ministerioService.postMinisterio(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarMinisterio();
        this.cancelar();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarMinisterio(){
    const formData = new FormData();
      formData.append('nombre',this.editarMinisterioForm.nombre);
      formData.append('titulo',this.editarMinisterioForm.titulo!);
    this.ministerioService.putMinisterio(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMinisterio();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarLogoMinisterio(){
    if (this.logoMinisterioForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFileLogo!);
    this.ministerioService.putLogoMinisterio(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMinisterio();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarPDFMinisterio(){
    if (this.pdfMinisterioForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('archivo',this.uploadFilePDF!);
    this.ministerioService.putPDFMinisterio(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMinisterio();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  eliminarMinisterio(id:number){
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
        this.ministerioService.deleteMinisterio(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarMinisterio();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.ministerioService.getMinisterioId(id).subscribe({
      next:(data:ResultMinisterio)=>{
        this.ids=String(id);
        this.editarMinisterioForm={
          nombre:data.ministerio.nombre,
          titulo:data.ministerio.titulo,
        }
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  capturarFileLogo(event: any) {
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.ministerioForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileLogo!.size > 1072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.ministerioForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.ministerioForm.logo = 'cargado';
      });
    }
  }
  capturarFileImagen(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.ministerioForm.pdf = '';
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
      this.ministerioForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.ministerioForm.pdf = 'cargado';
      });
    }
  }
  capturarFileLogo2(event: any) {
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.logoMinisterioForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileLogo!.size > 1072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.logoMinisterioForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.logoMinisterioForm.logo = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.pdfMinisterioForm.pdf = '';
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
      this.pdfMinisterioForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.pdfMinisterioForm.pdf = 'cargado';
      });
    }
  }
  extraserBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (e) {
        reject(e);
      }
    });
  reset() {
    this.fileInputLogo!.nativeElement.value = '';
    this.imgDefaultLogo =
      'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
    this.fileInputPDF!.nativeElement.value = '';
    this.imgDefaultPDF =
      'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  cancelar() {
    this.ministerioForm = {
      pdf: '',
      logo: '',
      nombre: '',
      titulo: '',
    };
    this.editarMinisterioForm={
      nombre:'',
      titulo:''
    }
    this.logoMinisterioForm={
      logo:''
    }
    this.pdfMinisterioForm={
      pdf:''
    }
    this.ids = '';
    this.reset();
  }
}
