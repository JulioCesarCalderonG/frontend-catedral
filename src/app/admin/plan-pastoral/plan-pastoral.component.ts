import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PdfPlanPastoralForm, PlanPastoralForm, Planpastoral, ResultPlanPastoralID, ResultPlanPastorales } from 'src/app/interface/planPastoral.interface';
import { PlanPastoralService } from 'src/app/servicios/plan-pastoral.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-pastoral',
  templateUrl: './plan-pastoral.component.html',
  styleUrls: ['./plan-pastoral.component.css']
})
export class PlanPastoralComponent implements OnInit {

  listPlanPastoral?: Planpastoral[];
  urlPDF = `${environment.backendUrl}/planpastoral/pdf`;
  planPastoralForm: PlanPastoralForm = {
    titulo: '',
    pdf: '',
    posicion: ''
  }
  editarPlanPastoralForm: PlanPastoralForm = {
    titulo: '',
    posicion: ''
  }
  pdfPlanPastoralForm: PdfPlanPastoralForm = {
    pdf: ''
  }
  imgDefaultPDF: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFilePDF?: File;
  @ViewChild('fileInputPDF', { static: false }) fileInputPDF?: ElementRef;
  p: number = 1;
  estado: string = '1';
  ids: string = '';

  constructor(
    private planPastoralService: PlanPastoralService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private wsService: WebsocketService
  ) {

  }

  ngOnInit(): void {
    this.mostrarPlanPastoral();
  }
  mostrarPlanPastoral() {
    this.planPastoralService.getPlanPastoral().subscribe({
      next: (data: ResultPlanPastorales) => {
        this.listPlanPastoral = data.planpastoral;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarPlanPastoral() {
    if (
      this.planPastoralForm.titulo === '' ||
      this.planPastoralForm.pdf === '' ||
      this.planPastoralForm.posicion === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.planPastoralForm.titulo!);
    formData.append('posicion', this.planPastoralForm.posicion!);
    formData.append('archivo', this.uploadFilePDF!);
    this.planPastoralService.postPlanPastoral(formData).subscribe({
      next: (data) => {
        this.toastr.success(data.msg, 'REGISTRADO');
        this.mostrarPlanPastoral();
        this.cancelar();
      },
      error: error => {
        console.log(error);
      }
    })
  }
  editarPlanPastoral() {
    if (
      this.editarPlanPastoralForm.titulo === '' ||
      this.editarPlanPastoralForm.posicion === ''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.editarPlanPastoralForm.titulo!);
    formData.append('posicion', this.editarPlanPastoralForm.posicion!);

    this.planPastoralService.putPlanPastoral(formData, this.ids).subscribe({
      next: (data) => {

        this.toastr.success(data.msg, 'EDITADO');
        this.mostrarPlanPastoral();
        this.reset();
      },
      error: error => {
        console.log(error);
      }
    })
  }
  editarPDFPlanPastoral(){
    if (this.pdfPlanPastoralForm.pdf==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('archivo',this.uploadFilePDF!);
    this.planPastoralService.putPDFPlanPastoral(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarPlanPastoral();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  eliminarPlanPastoral(id:number){
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
        this.planPastoralService.deletePlanPastoral(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarPlanPastoral();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  capturarFileImagen(event: any) {
    this.uploadFilePDF = event.target.files[0];
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.planPastoralForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFilePDF!.size > 10072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.planPastoralForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.planPastoralForm.pdf = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFilePDF = event.target.files[0];
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.pdfPlanPastoralForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFilePDF!.size > 10072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.pdfPlanPastoralForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.pdfPlanPastoralForm.pdf = 'cargado';
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
  obtenerDatos(id:number){
    this.planPastoralService.getPlanPastoralId(id).subscribe({
      next:(data:ResultPlanPastoralID)=>{
        this.ids=String(id);
        this.editarPlanPastoralForm={
          titulo:data.planpastoral.titulo,
          posicion:String(data.planpastoral.posicion)
        }
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  reset() {
    this.fileInputPDF!.nativeElement.value = '';
    this.imgDefaultPDF =
      'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  cancelar() {
    this.planPastoralForm = {
      pdf: '',
      titulo: '',
      posicion: ''
    };
    this.editarPlanPastoralForm = {
      titulo: '',
      posicion: ''
    }
    this.pdfPlanPastoralForm = {
      pdf: ''
    }
    this.ids = '';
    this.reset();
  }
}
