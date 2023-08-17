import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Directorio, DirectorioForm, ResultDirectorios } from 'src/app/interface/directorio.interface';
import { DirectorioService } from 'src/app/servicios/directorio.service';
import { LocationService } from 'src/app/servicios/location.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit{

  listDirectorio?:Directorio[];
  estado:string='0';
  directorioForm:DirectorioForm={
    archivo:'',
    direccion:'',
    logo:'',
    nombre:'',
    social:'',
    telefono:''
  };
  ids:string='';
  urlImagen=`${environment.backendUrl}/directorio/imagen`;
  urlLogo=`${environment.backendUrl}/directorio/logo`;

  imgDefaultLogo:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFileLogo?: File;
  @ViewChild('fileInputLogo', {static: false}) fileInputLogo?: ElementRef;

  imgDefaultImagen:string='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg'
  uploadFileImagen?: File;
  @ViewChild('fileInputImagen', {static: false}) fileInputImagen?: ElementRef;
  constructor(
    private directorioService:DirectorioService,
    private locationService:LocationService,
    private router:Router,
    private toastr:ToastrService,
    private sanitizer: DomSanitizer
  ){
  }
  ngOnInit(): void {
    this.mostrarDirectorio();
  }
  mostrarDirectorio(){
    this.directorioService.getDirectorio(this.estado).subscribe({
      next:(data:ResultDirectorios)=>{
        this.listDirectorio= data.directorio;
        console.log(this.listDirectorio);

      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  agregarDirectorio(){

  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarDirectorio();
  }
  capturarFileLogo(event:any){
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.directorioForm.logo='';
      this.reset();
      return;
    }
    if (this.uploadFileLogo!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.directorioForm.logo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFileLogo).then((imagen:any) => {
        this.imgDefaultLogo = imagen.base;
        this.directorioForm.logo='cargado';
      });
    }
  }
  capturarFileImagen(event:any){
    this.uploadFileImagen = event.target.files[0];
    console.log(this.uploadFileImagen);
    if (!this.uploadFileImagen) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO','SIN LOGO');
      this.directorioForm.archivo='';
      this.reset();
      return;
    }
    if (this.uploadFileImagen!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.directorioForm.archivo='';
      this.reset();
      return;
    }
    else{
      this.extraserBase64(this.uploadFileImagen).then((imagen:any) => {
        this.imgDefaultImagen = imagen.base;
        this.directorioForm.archivo='cargado';
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
    this.fileInputLogo!.nativeElement.value = "";
    this.imgDefaultLogo='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
    this.fileInputImagen!.nativeElement.value = "";
    this.imgDefaultImagen='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  get isUserLocationReady(){
    return this.locationService.isUserLocationReady;
  }
  localizacion(){
    this.router.navigateByUrl(`admin/directorio-localizacion/${1}/${-8.383624204189573}/${-74.53290336202565}`)
  }
  cancelar(){

  }
}
