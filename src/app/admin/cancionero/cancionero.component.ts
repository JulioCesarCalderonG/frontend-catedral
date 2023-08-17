import { Component, OnInit } from '@angular/core';
import { Cancionero, ResultCancioneros } from 'src/app/interface/cancioner.interface';
import { CancioneroService } from 'src/app/servicios/cancionero.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancionero',
  templateUrl: './cancionero.component.html',
  styleUrls: ['./cancionero.component.css']
})
export class CancioneroComponent implements OnInit{

  listCancionero?:Cancionero[];
  estado:string='1';
  url=`${environment.backendUrl}/cancionero/imagen`;
  constructor(
    private cancioneroService:CancioneroService
  ){

  }

  ngOnInit(): void {
    this.mostrarCancionero();
  }

  mostrarCancionero(){
    this.cancioneroService.getCancionero(this.estado).subscribe({
      next:(data:ResultCancioneros)=>{
        this.listCancionero=data.cancionero
      },
      error:error=>{
        console.log(error);

      }
    })
  }
  habiDesCancionero(id:number,estado:number){
    Swal.fire({
      title: 'Estas seguro?',
      text: (estado===0)?"Se dejara deshabilitado el cancionero":"Se habilitara el cancionero",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, seguro!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancioneroService.deleteCancionero(String(id),String(estado)).subscribe({
          next:(data)=>{
            Swal.fire(
              (estado===0)?"Deshabilitado":"Habilitado",
              data.msg,
              'success'
            );
            this.mostrarCancionero();
          },
          error:(error)=>{
            console.log(error);

          }
        })

      }
    })
  }
  showEvent(event:any){
    console.log(event.target.value);
    this.estado = event.target.value;
    this.mostrarCancionero();
  }
}
