import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Calendario, CalendarioForm, ImgCalendarioForm, ResultCalendarioID, ResultCalendarios } from 'src/app/interface/calendario.interface';
import { CalendarioService } from 'src/app/servicios/calendario.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit{
  listCalendario?: Calendario[];
  urlPDF = `${environment.backendUrl}/calendario/img`;
  calendarioForm: CalendarioForm = {
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen:''
  }
  editarCalendarioForm: CalendarioForm = {
    titulo: '',
    descripcion: '',
    fecha: '',
  }
  imgCalendarioForm: ImgCalendarioForm = {
    imagen: ''
  }
  imgDefaultImagen: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFileImg?: File;
  @ViewChild('fileInputPDF', { static: false }) fileInputPDF?: ElementRef;
  p: number = 1;
  estado: string = '1';
  ids: string = '';
  constructor(
    private calendarioService:CalendarioService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private wsService: WebsocketService
  ) {

  }

  ngOnInit(): void {
    this.mostrarCalendario()
  }
  mostrarCalendario() {
    this.calendarioService.getCalendario().subscribe({
      next: (data: ResultCalendarios) => {
        this.listCalendario = data.calendario;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarCalendario() {
    if (
      this.calendarioForm.titulo === '' ||
      this.calendarioForm.descripcion === '' ||
      this.calendarioForm.fecha === '' ||
      this.calendarioForm.imagen === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.calendarioForm.titulo!);
    formData.append('descripcion', this.calendarioForm.descripcion!);
    formData.append('fecha', this.calendarioForm.fecha!);
    formData.append('logo', this.uploadFileImg!);
    this.calendarioService.postCalendario(formData).subscribe({
      next: (data) => {
        this.toastr.success(data.msg, 'REGISTRADO');
        this.mostrarCalendario();
        this.cancelar();
        this.wsService.emit('nueva-calendario');
      },
      error: error => {
        console.log(error.error.msg);
        this.toastr.warning(
          error.error.msg,
          'ALERTA'
        );
      }
    })
  }
  editarCalendario() {
    if (
      this.editarCalendarioForm.titulo === '' ||
      this.editarCalendarioForm.descripcion === '' ||
      this.editarCalendarioForm.fecha === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.editarCalendarioForm.titulo!);
    formData.append('descripcion', this.editarCalendarioForm.descripcion!);
    formData.append('fecha', this.editarCalendarioForm.fecha!);
    this.calendarioService.putCalendario(formData, this.ids).subscribe({
      next: (data) => {

        this.toastr.success(data.msg, 'EDITADO');
        this.mostrarCalendario();
        this.reset();
      },
      error: error => {
        console.log(error);
      }
    })
  }
  editarLogoCalendario(){
    if (this.imgCalendarioForm.imagen==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFileImg!);
    this.calendarioService.putImagenCalendario(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarCalendario();
        this.reset();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  eliminarCalendario(id:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Se eliminara el tipo de material!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.calendarioService.deleteCalendario(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarCalendario();
            this.wsService.emit('nueva-calendario');
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.calendarioService.getCalendarioId(id).subscribe({
      next:(data:ResultCalendarioID)=>{
        this.ids=String(id);
        this.editarCalendarioForm={
          titulo:data.calendario.titulo,
          descripcion:data.calendario.descripcion,
          fecha:data.calendario.fecha
        }
      },
      error:error=>{
       console.log(error);

      }
    })
  }
  capturarFileImagen(event: any) {
    this.uploadFileImg = event.target.files[0];
    if (!this.uploadFileImg) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.calendarioForm.imagen = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultImagen =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileImg!.size > 3072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.calendarioForm.imagen = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultImagen =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileImg).then((imagen: any) => {
        this.imgDefaultImagen = imagen.base;
        this.calendarioForm.imagen = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFileImg = event.target.files[0];
    if (!this.uploadFileImg) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.imgCalendarioForm.imagen = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultImagen =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFileImg!.size > 1072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.imgCalendarioForm.imagen = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultImagen =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileImg).then((imagen: any) => {
        this.imgDefaultImagen = imagen.base;
        this.imgCalendarioForm.imagen = 'cargado';
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
    this.fileInputPDF!.nativeElement.value = "";
    this.imgDefaultImagen =
      'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  cancelar(){
    this.calendarioForm={
      descripcion:'',
      fecha:'',
      titulo:'',
      imagen:''
    }
    this.editarCalendarioForm={
      descripcion:'',
      fecha:'',
      titulo:''
    }
    this.imgCalendarioForm={
      imagen:''
    }
    this.ids = '';
    this.reset();
  }
}
