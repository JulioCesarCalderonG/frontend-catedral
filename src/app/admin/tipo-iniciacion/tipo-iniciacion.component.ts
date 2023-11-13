import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Iniciacion, ResultIniciaciones } from 'src/app/interface/iniciacion.interface';
import {
  ResultTipoIniciaciones,
  ResultTipoIniciacion,
  Tipoiniciacion,
} from 'src/app/interface/tipo.iniciacion.interface';
import { IniciacionService } from 'src/app/servicios/iniciacion.service';
import { TipoIniciacionService } from 'src/app/servicios/tipo-iniciacion.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-iniciacion',
  templateUrl: './tipo-iniciacion.component.html',
  styleUrls: ['./tipo-iniciacion.component.css'],
})
export class TipoIniciacionComponent implements OnInit {
  listTipoIniciacion?: Tipoiniciacion[];
  listIniciacion?:Iniciacion[];
  iniciacionForm: FormGroup;
  editarIniciacionForm: FormGroup;
  ids:string='';
  p: number = 1;
  constructor(
    private tipoIniciacionService: TipoIniciacionService,
    private iniciacionService: IniciacionService,
    private router: Router,
    private fb: FormBuilder,
    private toastr:ToastrService,
    private wsService:WebsocketService
  ) {
    this.iniciacionForm = this.fb.group({
      descripcion: ['', Validators.required],
      id_iniciacion: ['', Validators.required],
    });
    this.editarIniciacionForm = this.fb.group({
      descripcion: ['', Validators.required],
      id_iniciacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mostrarTipoIniciacion();
    this.mostrarIniciacion();
  }
  mostrarTipoIniciacion() {
    this.tipoIniciacionService.getTipoIniciacion().subscribe({
      next: (data: ResultTipoIniciaciones) => {
        console.log(data);
        this.listTipoIniciacion = data.tipoiniciacion;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  mostrarIniciacion() {
    this.iniciacionService.getIniciacion('1').subscribe({
      next: (data:ResultIniciaciones) => {
        this.listIniciacion=data.iniciacion;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  agregarTipoIniciacion(){
    const formData = new FormData();
    formData.append('descripcion',this.iniciacionForm.get('descripcion')?.value);
    formData.append('id_iniciacion',this.iniciacionForm.get('id_iniciacion')?.value);

    this.tipoIniciacionService.postTipoIniciacion(formData).subscribe({
      next:data=>{
        this.toastr.success(data.msg,'Registrado');
        this.mostrarTipoIniciacion();
        this.cancelar();
        this.wsService.emit('nueva-iniciacion');
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  editarTipoIniciacion(){
    const formData = new FormData();
    formData.append('descripcion',this.editarIniciacionForm.get('descripcion')?.value);
    formData.append('id_iniciacion',this.editarIniciacionForm.get('id_iniciacion')?.value);

    this.tipoIniciacionService.putTipoIniciacion(formData,this.ids).subscribe({
      next:data=>{
        this.toastr.success(data.msg,'editado');
        this.mostrarTipoIniciacion();
        //this.cancelar();
        console.log(data);

      },
      error:error=>{
        console.log(error);

      }
    })
  }
  obtenerDatos(id: number) {
    this.tipoIniciacionService.getTipoIniciacionID(id).subscribe({
      next:(data:ResultTipoIniciacion)=>{
        this.editarIniciacionForm.setValue({
          descripcion:data.tipoiniciacion.descripcion,
          id_iniciacion:data.tipoiniciacion.id_iniciacion
        });
        this.ids=String(data.tipoiniciacion.id_iniciacion)
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  eliminar(id: number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se eliminara el tipo de iniciacion!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText:'cancelar',
    }).then((result) => {
      this.tipoIniciacionService.deleteTipoIniciacion(id).subscribe({
        next:data=>{
          if (result.isConfirmed) {
            Swal.fire(
              'Eliminado!',
              data.msg,
              'success'
            );

          }
          this.mostrarTipoIniciacion();
        },
        error:error=>{
          console.log(error);

        }
      })

    })
  }
  cancelar(){
    this.editarIniciacionForm.setValue({
      descripcion:'',
      id_iniciacion:''
    });
    this.iniciacionForm.setValue({
      descripcion:'',
      id_iniciacion:''
    });
    this.ids='';
  }
}
