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
import Swal from 'sweetalert2';
import { WebsocketService } from 'src/app/socket/websocket.service';

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
  editarNoticiaForm:FormGroup;
  url=`${environment.backendUrl}/noticiaimagen/imagen`;
  ids:string='';
  uploadFiles?: File[];
  imagenUpload?:string='';
  @ViewChild('fileInput', {static: false}) fileInput?: ElementRef;
  constructor(
    private noticiaService:NoticiaService,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private notiImagenService:NoticiaImagenService,
    private sanitizer: DomSanitizer,
    private wsService:WebsocketService
  ){
    this.noticiaForm=this.fb.group({
      titulo:['', Validators.required],
      subtitulo:['', Validators.required],
      descripcion:['', Validators.required]
    });
    this.editarNoticiaForm=this.fb.group({
      titulo:['', Validators.required],
      subtitulo:['', Validators.required],
      descripcion:['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.mostrarNoticias();
  }

  mostrarNoticias(){
    this.noticiaService.getNoticias(this.estado).subscribe(
      {
        next:(data:ResultNoticias)=>{
          this.listNoticias=data.noticia;
        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }
  agregarNoticia(){
    const formData = new FormData();
    formData.append('titulo',this.noticiaForm.get('titulo')?.value);
    formData.append('subtitulo',this.noticiaForm.get('subtitulo')?.value);
    formData.append('descripcion',this.noticiaForm.get('descripcion')?.value);
    this.noticiaService.postNoticia(formData).subscribe(
      {
        next:(data)=>{
          this.toastr.success(data.msg,'Registrado');
          this.mostrarNoticias();
          this.cancelar();
        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }
  editarNoticia(){
    const formData = new FormData();
    formData.append('titulo',this.editarNoticiaForm.get('titulo')?.value);
    formData.append('subtitulo',this.editarNoticiaForm.get('subtitulo')?.value);
    formData.append('descripcion',this.editarNoticiaForm.get('descripcion')?.value);
    this.noticiaService.putNoticia(formData,this.ids).subscribe(
      {
        next:(data)=>{
          this.toastr.success(data.msg,'Editado');
          this.mostrarNoticias();
        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }
  publicarNoticia(id:number,estado:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara de publicar la noticia":"Se publicara la noticia",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiaService.publicarNoticia(id,String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Sin publicar":"Publicado",
              data.msg,
              'success'
            );
            this.wsService.emit('nueva-noticia');
            this.mostrarNoticias();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  obtenerDatos(id:number){
    this.ids=String(id);
    this.noticiaService.getNoticiaId(id).subscribe({
      next:(data:ResultNoticia)=>{
        this.editarNoticiaForm.setValue({
          titulo:data.noticia.titulo,
          subtitulo:data.noticia.subtitulo,
          descripcion:data.noticia.descripcion
        });
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  showEvent(event:any){
    this.estado = event.target.value;
    this.mostrarNoticias();
  }
  agregarImagenNoticia(){
    const formData = new FormData();
    if (this.imagenUpload==='') {
      this.toastr.warning('No selecciono ningun archivo','SIN ARCHIVOS');
    }else{
      for (let i = 0; i < this.uploadFiles!.length; i++) {
          formData.append('archivo',this.uploadFiles![i]);
      }
      formData.append('id',this.ids);
      this.notiImagenService.postNotiImagen(formData).subscribe(
        {
          next:(data)=>{
            this.mostrarImagen(this.ids);
            this.toastr.success(data.msg,'REGISTRADO');
            this.reset();
            //this.cancelar();
          },
          error:(error)=>{
            console.log(error);
          }
        }
      )

    }
  }
  mostrarImagen(id:number|string){
    this.ids=String(id);
    this.notiImagenService.getNotiImagenIdNoticia(id).subscribe({
      next:(data:ResultNoticiaImagen)=>{
        this.listNoticiaImagen = data.notiImagen;

      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  eliminarNoticiaImagen(id:number){
    this.notiImagenService.deleteNotiImagen(id).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'ELIMINADO')
        this.mostrarImagen(this.ids);
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files;
    if (this.uploadFiles?.length===0) {
      this.toastr.warning('No selecciono ningun archivo','SIN ARCHIVOS');
      this.imagenUpload='';
      this.reset();
      return;
    }
    for (let i = 0; i < this.uploadFiles!.length; i++) {
      if (this.uploadFiles![i].size > 1072383) {
        this.toastr.warning('El tamaño maximo es de 10 MB','ARCHIVO EXCEDE LO ESTIMADO');
        this.imagenUpload='';
        this.reset();
        return;
      }
    }
    this.imagenUpload='cargado';


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
  }
  cancelar(){
    this.noticiaForm.setValue({
      titulo:'',
      subtitulo:'',
      descripcion:''
    });
    this.editarNoticiaForm.setValue({
      titulo:'',
      subtitulo:'',
      descripcion:''
    });
    this.imagenUpload='';
    this.ids='';
    this.reset();
  }
}
