import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Noticia, ResultNoticia, ResultNoticias } from 'src/app/interface/noticia.interface';
import { NoticiaService } from 'src/app/servicios/noticia.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NoticiaImagenService } from 'src/app/servicios/noticia-imagen.service';
import { NotiImagen, ResultNoticiaImagen } from 'src/app/interface/noticia.imagen.interface';
import { environment } from 'src/environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit{

  listNoticias?:Noticia[];
  listNoticiaImagen?:NotiImagen[];
  estado:string='0';
  noticiaForm:FormGroup;
  url=`${environment.backendUrl}/noticiaimagen/imagen`;
  ids:string='';
  uploadFiles?: File[];
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;
  constructor(
    private noticiaService:NoticiaService,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private notiImagenService:NoticiaImagenService,
    private sanitizer: DomSanitizer
  ){
    this.noticiaForm=this.fb.group({
      titulo:['', Validators.required],
      subtitulo:['', Validators.required],
      descripcion:['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.mostrarNoticias();
  }

  mostrarNoticias(){
    this.noticiaService.getNoticias(this.estado).subscribe(
      {
        next:(data:ResultNoticias)=>{
          this.listNoticias=data.noticia;
          console.log(this.listNoticias);

        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }
  agregarNoticia(){
    console.log('hola');
    const formData = new FormData();
    formData.append('titulo',this.noticiaForm.get('titulo')?.value);
    formData.append('subtitulo',this.noticiaForm.get('subtitulo')?.value);
    formData.append('descripcion',this.noticiaForm.get('descripcion')?.value);
    this.noticiaService.postNoticia(formData).subscribe(
      {
        next:(data)=>{
          console.log(data);
          this.toastr.success(data.msg,'Registrado');
          this.mostrarNoticias();
        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }
  mostrarImagen(id:number){
    this.notiImagenService.getNotiImagenIdNoticia(id).subscribe({
      next:(data:ResultNoticiaImagen)=>{
        this.listNoticiaImagen = data.notiImagen;
        console.log(this.listNoticiaImagen);

      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  eliminarNoticiaImagen(id:number){
    console.log(id);

  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files;
    console.log(this.uploadFiles);

    /* if (this.uploadFiles!.size > 1072383) {
      this.toastr.warning('El tamaño maximo es de 1 MB','ARCHIVO EXCEDE LO ESTIMADO');
      this.reset();
    }
    else{
      this.extraserBase64(this.uploadFiles).then((imagen:any) => {
        //this.imagenAreaPri = imagen.base;

      });
    } */
  }
  reset(){
    this.fileInput!.nativeElement.value = "";
  }
  cancelar(){
    this.noticiaForm.setValue({
      titulo:'',
      subtitulo:'',
      descripcion:''
    })
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
  })
}
