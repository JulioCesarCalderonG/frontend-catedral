import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogoMaterialForm, Material, MaterialForm, ResultMaterialPastoral, ResultMaterialPastorales } from 'src/app/interface/material.interface';
import { MaterialPastoralService } from 'src/app/servicios/material-pastoral.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materiales-pastorales',
  templateUrl: './materiales-pastorales.component.html',
  styleUrls: ['./materiales-pastorales.component.css']
})
export class MaterialesPastoralesComponent implements OnInit{

  listMaterial?: Material[];
  urlPDF = `${environment.backendUrl}/materialpastoral/pdf`;
  urlLogo = `${environment.backendUrl}/materialpastoral/logo`;
  ids: string = '';
  materialForm: MaterialForm = {
    nombre: '',
    titulo: '',
    logo: '',
    pdf: '',
  };
  editarMaterialForm:MaterialForm={
    nombre:'',
    titulo:''
  }
  logoMaterialForm:LogoMaterialForm={
    logo:''
  }
  pdfMaterialForm:LogoMaterialForm={
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
    private materialService: MaterialPastoralService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ){

  }

  ngOnInit(): void {
    this.mostrarMaterial();
  }
  mostrarMaterial() {
    this.materialService.getMaterial().subscribe({
      next: (data: ResultMaterialPastorales) => {
        this.listMaterial = data.material;
        console.log(this.listMaterial);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarMaterial() {
    if (
      this.materialForm.nombre === '' ||
      this.materialForm.titulo === '' ||
      this.materialForm.logo === '' ||
      this.materialForm.pdf === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', this.materialForm.nombre);
    formData.append('titulo', this.materialForm.titulo!);
    formData.append('logo', this.uploadFileLogo!);
    formData.append('archivo', this.uploadFilePDF!);
    this.materialService.postMaterial(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarMaterial();
        this.cancelar();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarMaterial(){
    const formData = new FormData();
      formData.append('nombre',this.editarMaterialForm.nombre);
      formData.append('titulo',this.editarMaterialForm.titulo!);
    this.materialService.putMaterial(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMaterial();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarLogoMaterial(){
    if (this.logoMaterialForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFileLogo!);
    this.materialService.putLogoMaterial(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMaterial();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  editarPDFMaterial(){
    if (this.pdfMaterialForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('archivo',this.uploadFilePDF!);
    this.materialService.putPDFMaterial(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarMaterial();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  eliminarMaterial(id:number){
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
        this.materialService.deleteMaterial(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarMaterial();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.materialService.getMaterialId(id).subscribe({
      next:(data:ResultMaterialPastoral)=>{
        this.ids=String(id);
        this.editarMaterialForm={
          nombre:data.material.nombre,
          titulo:data.material.titulo,
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
      this.materialForm.logo = '';
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
      this.materialForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.materialForm.logo = 'cargado';
      });
    }
  }
  capturarFileImagen(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.materialForm.pdf = '';
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
      this.materialForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.materialForm.pdf = 'cargado';
      });
    }
  }
  capturarFileLogo2(event: any) {
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.logoMaterialForm.logo = '';
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
      this.logoMaterialForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.logoMaterialForm.logo = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.pdfMaterialForm.pdf = '';
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
      this.pdfMaterialForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.pdfMaterialForm.pdf = 'cargado';
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
    this.materialForm = {
      pdf: '',
      logo: '',
      nombre: '',
      titulo: '',
    };
    this.editarMaterialForm={
      nombre:'',
      titulo:''
    }
    this.logoMaterialForm={
      logo:''
    }
    this.pdfMaterialForm={
      pdf:''
    }
    this.ids = '';
    this.reset();
  }
}
