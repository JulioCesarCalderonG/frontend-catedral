import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Directorio, DirectorioForm, ResultDirectorio, ResultDirectorios } from 'src/app/interface/directorio.interface';
import { DirectorioService } from 'src/app/servicios/directorio.service';
import { LocationService } from 'src/app/servicios/location.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

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
  editarDirectorioForm:DirectorioForm={
    direccion:'',
    nombre:'',
    social:'',
    telefono:''
  }
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
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ){
  }
  ngOnInit(): void {
    this.mostrarDirectorio();
  }
  mostrarDirectorio(){
    this.directorioService.getDirectorio(this.estado).subscribe({
      next:(data:ResultDirectorios)=>{
        this.listDirectorio= data.directorio;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  agregarDirectorio(){
    if (this.directorioForm.archivo==='' || this.directorioForm.logo==='' || this.directorioForm.nombre==='' || this.directorioForm.direccion==='') {
      this.toastr.warning('Complete los datos que son obligatorios','ALERTA');
      return;
    }
    else{
      const formData = new FormData();
      formData.append('nombre',this.directorioForm.nombre);
      formData.append('telefono',this.directorioForm.telefono!);
      formData.append('direccion',this.directorioForm.direccion);
      formData.append('social',this.directorioForm.social!);
      formData.append('logo',this.uploadFileLogo!);
      formData.append('archivo',this.uploadFileImagen!);

      this.directorioService.postDirectorio(formData).subscribe({
        next:(data)=>{
          this.toastr.success(data.msg,'REGISTRADO');
          this.mostrarDirectorio();
          this.cancelar();
        },
        error:error=>{
          console.log(error);

        }
      });


    }
  }
  editarDirectorio(){
    const formData = new FormData();
      formData.append('nombre',this.editarDirectorioForm.nombre);
      formData.append('telefono',this.editarDirectorioForm.telefono!);
      formData.append('direccion',this.editarDirectorioForm.direccion);
      formData.append('social',this.editarDirectorioForm.social!);
    this.directorioService.putDirectorio(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarDirectorio();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  eliminarDirectorio(estado:number,id:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara de publicar el directorio":"Se publicara el directorio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.directorioService.deleteDirectorio(String(id),String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Sin publicar":"Publicado",
              data.msg,
              'success'
            );
            this.wsService.emit('nueva-ubicacion');
            this.mostrarDirectorio();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  actualizarLogo(){
    const formData = new FormData();
    formData.append('logo',this.uploadFileLogo!);
    this.directorioService.putLogoDirectorio(formData,this.ids).subscribe({
      next:data=>{
        this.toastr.success(data.msg,'LOGO EDITADO');
        this.mostrarDirectorio();
        this.cancelar();
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  actualizarImagen(){
    const formData = new FormData();
    formData.append('archivo',this.uploadFileImagen!);
    this.directorioService.putImagenDirectorio(formData,this.ids).subscribe({
      next:data=>{
        this.toastr.success(data.msg,'IMAGEN EDITADO');
        this.mostrarDirectorio();
        this.cancelar();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  obtenerDatos(id:number){
    this.directorioService.getDirectorioId(id).subscribe({
      next:(data:ResultDirectorio)=>{
        this.ids=String(id);
        this.editarDirectorioForm={
          direccion:data.directorio.direccion,
          nombre:data.directorio.nombre,
          social:data.directorio.social,
          telefono:data.directorio.telefono
        }
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  localizacion(titulo:string,lat:number,lng:number, id:number){
    this.router.navigateByUrl(`admin/directorio-localizacion/${titulo}/${id}/${lat}/${lng}`)
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
      this.fileInputLogo!.nativeElement.value = "";
      this.imgDefaultLogo='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileLogo!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.directorioForm.logo='';
      this.fileInputLogo!.nativeElement.value = "";
      this.imgDefaultLogo='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
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
      this.fileInputImagen!.nativeElement.value = "";
      this.imgDefaultImagen='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileImagen!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.directorioForm.archivo='';
      this.fileInputImagen!.nativeElement.value = "";
      this.imgDefaultImagen='https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
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

  cancelar(){
    this.reset();
    this.directorioForm={
      archivo:'',
      direccion:'',
      logo:'',
      nombre:'',
      social:'',
      telefono:''
    };
    this.editarDirectorioForm={
      direccion:'',
      nombre:'',
      social:'',
      telefono:''
    }
    this.ids='';
  }
}
