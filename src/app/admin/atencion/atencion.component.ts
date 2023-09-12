import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Atencion, ResultAtencion, ResultAtenciones } from 'src/app/interface/atencion.interface';
import { Directorio, ResultDirectorios } from 'src/app/interface/directorio.interface';
import { Horario, ResultHorarios } from 'src/app/interface/horario.interface';
import { ResultTipoAtenciones, Tipoatencion } from 'src/app/interface/tipo.atencion.interface';
import { AtencionService } from 'src/app/servicios/atencion.service';
import { DirectorioService } from 'src/app/servicios/directorio.service';
import { HorarioService } from 'src/app/servicios/horario.service';
import { TipoAtencionService } from 'src/app/servicios/tipo-atencion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit{

  listAtencion?:Atencion[];
  listHorario?:Horario[];
  listTipoAtencion?:Tipoatencion[];
  listDirectorios?:Directorio[];
  atencionForm:FormGroup;
  editarAtencionForm:FormGroup;
  ids:string='';
  constructor(
    private atencionServicie:AtencionService,
    private horarioService:HorarioService,
    private tipoAtencionService:TipoAtencionService,
    private directorioService:DirectorioService,
    private fb:FormBuilder,
    private toastr:ToastrService
  ) {
    this.atencionForm=this.fb.group({
      id_directorio:['',Validators.required],
      id_horario:['',Validators.required],
      id_tipo_atencion:['',Validators.required],
      descripcion:['',Validators.required]
    });
    this.editarAtencionForm=this.fb.group({
      id_directorio:['',Validators.required],
      id_horario:['',Validators.required],
      id_tipo_atencion:['',Validators.required],
      descripcion:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.mostrarAtencion();
    this.mostrarHorario();
    this.mostrarTipoAtencion();
    this.mostrarDirectorio();
  }

  mostrarAtencion(){
    this.atencionServicie.getAtencion().subscribe({
      next:(data:ResultAtenciones)=>{
        console.log(data);
        this.listAtencion=data.atencion;
      },
      error:error=>{
        console.log(error);

      }
    })
  }

  mostrarHorario(){
    this.horarioService.getHorarios().subscribe({
      next:(data:ResultHorarios)=>{
        console.log(data);
        this.listHorario=data.horario;
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarTipoAtencion(){
    this.tipoAtencionService.getTipoAtencion().subscribe({
      next:(data:ResultTipoAtenciones)=>{
        console.log(data);
        this.listTipoAtencion=data.tipoatencion;
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  mostrarDirectorio(){
    this.directorioService.getDirectorio('1').subscribe({
      next:(data:ResultDirectorios)=>{
        this.listDirectorios=data.directorio;
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  agregarAtencion(){
    const formData = new FormData();
    formData.append('id_directorio',this.atencionForm.get('id_directorio')?.value);
    formData.append('id_horario',this.atencionForm.get('id_horario')?.value);
    formData.append('id_tipo_atencion',this.atencionForm.get('id_tipo_atencion')?.value);
    formData.append('descripcion',this.atencionForm.get('descripcion')?.value);
    this.atencionServicie.postAtencion(formData).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarAtencion();
        this.cancelar();
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarAtencion(){
    const formData = new FormData();
    formData.append('id_directorio',this.editarAtencionForm.get('id_directorio')?.value);
    formData.append('id_horario',this.editarAtencionForm.get('id_horario')?.value);
    formData.append('id_tipo_atencion',this.editarAtencionForm.get('id_tipo_atencion')?.value);
    formData.append('descripcion',this.editarAtencionForm.get('descripcion')?.value);
    this.atencionServicie.putAtencion(formData,this.ids).subscribe({
      next:(data)=>{
        this.toastr.success(data.msg,'Editado');
        this.mostrarAtencion();
        //this.cancelar();
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id:number){
    this.atencionServicie.getAtencionID(id).subscribe({
      next:(data:ResultAtencion)=>{
        this.editarAtencionForm.setValue({
          id_directorio:data.atencion.id_directorio,
          id_horario:data.atencion.id_horario,
          id_tipo_atencion:data.atencion.id_tipo_atencion,
          descripcion:data.atencion.descripcion
        });
        this.ids=String(data.atencion.id)
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminarAtencion(id:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Se eliminara esta atencion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.atencionServicie.deleteAtencion(id).subscribe({
          next:(data)=>{
            Swal.fire(
              "Eliminado",
              data.msg,
              'success'
            );
            this.mostrarAtencion();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  cancelar(){
    this.atencionForm.setValue({
      id_directorio:'',
      id_horario:'',
      id_tipo_atencion:'',
      descripcion:''
    });
    this.editarAtencionForm.setValue({
      id_directorio:'',
      id_horario:'',
      id_tipo_atencion:'',
      descripcion:''
    });
    this.ids='';
  }
}
