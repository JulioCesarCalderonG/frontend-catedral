import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogoTipoOracionesForm, ResultTipoOracion, ResultTipoOraciones, TipoOracionesForm, Tipooracion } from 'src/app/interface/tipo.oraciones.interface';
import { TipoOracionesService } from 'src/app/servicios/tipo-oraciones.service';
import { environment } from 'src/environments/environment.prod';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
import { OracionesService } from 'src/app/servicios/oraciones.service';
import { Oracione, ResultOraciones } from 'src/app/interface/oracion.interface';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipo-oraciones',
  templateUrl: './tipo-oraciones.component.html',
  styleUrls: ['./tipo-oraciones.component.css']
})
export class TipoOracionesComponent implements OnInit{

  listTipoOracion?:Tipooracion[];
  listOracion?:Oracione[];
  urlLogo = `${environment.backendUrl}/tipooraciones/imagen`;
  ids: string = '';
  tipoOracionForm:TipoOracionesForm={
    descripcion:'',
    id_oracion:'',
    subdescripcion:'',
    titulo:'',
    logo:''
  }
  editarTipoOracionForm:FormGroup;
  logoTipoOracionForm:LogoTipoOracionesForm={
    logo:''
  }
  imgDefaultLogo: string =
  'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
  uploadFileLogo?: File;
  @ViewChild('fileInputLogo', { static: false }) fileInputLogo?: ElementRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '200px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',

  };
  constructor(
    private tipoOracionService:TipoOracionesService,
    private oracionService:OracionesService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService,
    private fb:FormBuilder
  ){
    this.editarTipoOracionForm=this.fb.group({
      descripcion:["",Validators.required],
      id_oracion:['',Validators.required],
      subdescripcion:['',Validators.required],
      titulo:['',Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarTipoOracion();
    this.mostrarOracion();
  }

  mostrarTipoOracion(){
    this.tipoOracionService.getTipoOraciones().subscribe({
      next:(data:ResultTipoOraciones)=>{
        this.listTipoOracion= data.tipooracion;
        console.log(this.listTipoOracion);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarOracion(){
    this.oracionService.getOraciones('1').subscribe({
      next:(data:ResultOraciones)=>{
        this.listOracion=data.oraciones;
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarTipoOracion(){
    if (this.tipoOracionForm.descripcion==='' || this.tipoOracionForm.id_oracion===''
      || this.tipoOracionForm.logo==='' || this.tipoOracionForm.subdescripcion===''
      || this.tipoOracionForm.titulo===''
    ) {
      this.toastr.warning('Complete los datos que son obligatorios', 'ALERTA');
      return;
    }
    const formData = new FormData();
    formData.append('titulo',this.tipoOracionForm.titulo);
    formData.append('descripcion',this.tipoOracionForm.descripcion);
    formData.append('subdescripcion',this.tipoOracionForm.subdescripcion);
    formData.append('logo',this.uploadFileLogo!);
    formData.append('id_oracion',this.tipoOracionForm.id_oracion);
    this.tipoOracionService.postTipoOracion(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'REGISTRADO');
        this.mostrarOracion();
        this.cancelar();
        this.wsService.emit('nueva-oracion');
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarTipoOracion(){

    console.log(this.editarTipoOracionForm.get('descripcion')?.value);

    /* this.tipoOracionService.putTipoOracion(this.editarTipoOracionForm,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoOracion();
      },
      error:error=>{
        console.log(error);

      }
    }) */
  }
  editarLogoTipoOracion(){
    if (this.logoTipoOracionForm.logo==='') {
      this.toastr.warning('INGRESE TODOS LOS DATOS SOLICITADOS','ERROR DE DATOS');
      return;
    }
    const formData = new FormData();
    formData.append('logo',this.uploadFileLogo!);
    this.tipoOracionService.putLogoTipoOracion(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'EDITADO');
        this.mostrarTipoOracion();
        this.cancelar();
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.tipoOracionService.getTipoOracionID(id).subscribe({
      next:(data:ResultTipoOracion)=>{
        console.log(data.tipooracion.descripcion);

        this.ids=String(id);
        this.editarTipoOracionForm.setValue({
          descripcion:data.tipooracion.descripcion,
          titulo:data.tipooracion.titulo,
          id_oracion:String(data.tipooracion.id_oracion),
          subdescripcion:data.tipooracion.subdescripcion,
        })
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarTipoOracion(id:number){
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
        this.tipoOracionService.deleteTipoOracion(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarTipoOracion();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  capturarFileLogo(event: any) {
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.tipoOracionForm.logo = '';
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
      this.tipoOracionForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.tipoOracionForm.logo = 'cargado';
      });
    }
  }
  capturarFileLogo2(event: any) {
    this.uploadFileLogo = event.target.files[0];
    console.log(this.uploadFileLogo);
    if (!this.uploadFileLogo) {
      this.toastr.warning('NO SE SELECCIONO NINGUN ARCHIVO', 'SIN LOGO');
      this.logoTipoOracionForm.logo = '';
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
      this.logoTipoOracionForm.logo = '';
      this.fileInputLogo!.nativeElement.value = '';
      this.imgDefaultLogo =
        'https://res.cloudinary.com/dkxwh94qt/image/upload/v1691765391/no-image_zyxdfe.jpg';
      return;
    } else {
      this.extraserBase64(this.uploadFileLogo).then((imagen: any) => {
        this.imgDefaultLogo = imagen.base;
        this.logoTipoOracionForm.logo = 'cargado';
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
  }
  cancelar() {
    this.tipoOracionForm={
      descripcion:'',
      id_oracion:'',
      subdescripcion:'',
      titulo:'',
      logo:''
    }
    this.editarTipoOracionForm.setValue({
      descripcion:'',
      id_oracion:'',
      subdescripcion:'',
      titulo:'',
    })
    this.ids = '';
    this.reset();
  }
}
