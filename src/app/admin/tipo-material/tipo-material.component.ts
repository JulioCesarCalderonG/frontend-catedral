import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Material, ResultMaterialPastorales } from 'src/app/interface/material.interface';
import { LogoTipoMaterialForm, ResultTipoMaterialPastoral, TipoMaterial, TipoMaterialForm } from 'src/app/interface/tipo.material.interface';
import { MaterialPastoralService } from 'src/app/servicios/material-pastoral.service';
import { TipoMaterialService } from 'src/app/servicios/tipo-material.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { environment } from 'src/environments/environment.prod';
import { ResultTipoMaterialPastorales } from '../../interface/tipo.material.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-material',
  templateUrl: './tipo-material.component.html',
  styleUrls: ['./tipo-material.component.css']
})
export class TipoMaterialComponent implements OnInit{
  listTipoMaterial?: TipoMaterial[];
  listMaterial?: Material[];
  urlPDF = `${environment.backendUrl}/tipomaterial/pdf`;
  tipoMaterialForm:TipoMaterialForm={
    titulo:'',
    pdf:'',
    id_material:''
  }
  editarTipoMaterialForm:TipoMaterialForm={
    titulo:'',
    id_material:''
  }
  pdfTipoMaterialForm:LogoTipoMaterialForm={
    pdf:''
  }
  imgDefaultPDF: string =
    'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFilePDF?: File;
  @ViewChild('fileInputPDF', { static: false }) fileInputPDF?: ElementRef;
  p: number = 1;
  estado:string='1';
  ids:string='';
  constructor(
    private tipoMaterialService:TipoMaterialService,
    private materialService: MaterialPastoralService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ) {

  }
  ngOnInit(): void {
    this.mostrarTipoMaterial();
    this.mostrarMaterial();
  }
  mostrarTipoMaterial(){
    this.tipoMaterialService.getTipoMaterial().subscribe({
      next: (data: ResultTipoMaterialPastorales) => {
        this.listTipoMaterial = data.tipoMaterial;
        console.log(this.listTipoMaterial);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  mostrarMaterial() {
    this.materialService.getMaterial(this.estado).subscribe({
      next: (data: ResultMaterialPastorales) => {
        this.listMaterial = data.material;
        console.log(this.listMaterial);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarTipoMaterial() {
    if (
      this.tipoMaterialForm.titulo === '' ||
      this.tipoMaterialForm.pdf === '' ||
      this.tipoMaterialForm.id_material ===''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', this.tipoMaterialForm.titulo!);
    formData.append('id_material', this.tipoMaterialForm.id_material!);
    formData.append('archivo', this.uploadFilePDF!);
    this.tipoMaterialService.postTipoMaterial(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarTipoMaterial();
        this.cancelar();
        this.wsService.emit('nueva-material');
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarTipoMaterial(){
    if (
      this.editarTipoMaterialForm.titulo === '' ||
      this.editarTipoMaterialForm.id_material ===''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
      formData.append('titulo',this.editarTipoMaterialForm.titulo!);
      formData.append('id_material', this.editarTipoMaterialForm.id_material!);
    this.tipoMaterialService.putTipoMaterial(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoMaterial();
        this.reset();
      },
      error:error=>{
        console.log(error);
      }
    })
  }
  editarPDFTipoMaterial(){
    if (this.pdfTipoMaterialForm.pdf==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('archivo',this.uploadFilePDF!);
    this.tipoMaterialService.putPDFTipoMaterial(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoMaterial();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.tipoMaterialService.getTipoMaterialId(id).subscribe({
      next:(data:ResultTipoMaterialPastoral)=>{
        this.ids=String(id);
        this.editarTipoMaterialForm={
          titulo:data.tipoMaterial.titulo,
          id_material:String(data.tipoMaterial.id_material)
        }
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarMaterial(id:number){
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
        this.tipoMaterialService.deleteTipoMaterial(id).subscribe({
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
  capturarFileImagen(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.tipoMaterialForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    }
    if (this.uploadFilePDF!.size > 3072383) {
      this.toastr.warning(
        'El tamaño maximo es de 1 MB',
        'ARCHIVO EXCEDE LO ESTIMADO'
      );
      this.tipoMaterialForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.tipoMaterialForm.pdf = 'cargado';
      });
    }
  }
  capturarFileImagen2(event: any) {
    this.uploadFilePDF = event.target.files[0];
    console.log(this.uploadFilePDF);
    if (!this.uploadFilePDF) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN PDF');
      this.pdfTipoMaterialForm.pdf = '';
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
      this.pdfTipoMaterialForm.pdf = '';
      this.fileInputPDF!.nativeElement.value = '';
      this.imgDefaultPDF =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFilePDF).then((imagen: any) => {
        this.imgDefaultPDF = imagen.base;
        this.pdfTipoMaterialForm.pdf = 'cargado';
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
    this.fileInputPDF!.nativeElement.value = '';
    this.imgDefaultPDF =
      'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  }
  cancelar() {
    this.tipoMaterialForm = {
      pdf: '',
      titulo: '',
      id_material:''
    };
    this.editarTipoMaterialForm={
      titulo:'',
      id_material:''
    }
    this.pdfTipoMaterialForm={
      pdf:''
    }
    this.ids = '';
    this.reset();
  }
}
