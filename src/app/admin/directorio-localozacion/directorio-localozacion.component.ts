import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lugar } from 'src/app/interface/lugar.interface';
import { DirectorioService } from 'src/app/servicios/directorio.service';
import { LocationService } from 'src/app/servicios/location.service';
import Swal from 'sweetalert2';

interface Datos{
  id:string,
  lat:string,
  lng:string
}
@Component({
  selector: 'app-directorio-localozacion',
  templateUrl: './directorio-localozacion.component.html',
  styleUrls: ['./directorio-localozacion.component.css']
})
export class DirectorioLocalozacionComponent implements OnInit{

  lngLat:Lugar={
    lng:0,
    lat:0
  }
  ubicacionFinal:Lugar={
    lng:0,
    lat:0
  }
  id:string='';
  titulo:string='';
  constructor(
    private rutaActiva: ActivatedRoute,
    private locationService:LocationService,
    private directorioService:DirectorioService
  ){

  }
  ngOnInit(): void {
    this.id = this.rutaActiva.snapshot.params['id'];
    this.titulo=this.rutaActiva.snapshot.params['titulo'];
    const lat = Number(this.rutaActiva.snapshot.params['lat']);
    const lng = Number(this.rutaActiva.snapshot.params['lng']);
    this.lngLat={lng,lat};
  }
  get isUserLocationReady(){
    return this.locationService.isUserLocationReady;
  }

  obtenerLatLng(event:Lugar){
    this.ubicacionFinal=event;
  }

  guardarLocalizacion(){
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se actualizara la ubicacion del directorio!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.ubicacionFinal);
        this.directorioService.putLocalizacion(this.ubicacionFinal,this.id).subscribe({
          next:data=>{
            console.log(data);
            Swal.fire(
              'Actualizado!',
              data.msg,
              'success'
            )
          },
          error:error=>{
            console.log(error);
          }
        })

      }
    })


  }

}
