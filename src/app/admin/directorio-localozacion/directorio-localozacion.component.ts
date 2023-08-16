import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/servicios/location.service';
interface Lugar{
  lng:number,
  lat:number
}
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
  constructor(
    private rutaActiva: ActivatedRoute,
    private locationService:LocationService
  ){

  }
  ngOnInit(): void {
    const id = this.rutaActiva.snapshot.params['id'];
    const lat = Number(this.rutaActiva.snapshot.params['lat']);
    const lng = Number(this.rutaActiva.snapshot.params['lng']);
    this.lngLat={lng,lat};
    //console.log(this.latLng);


  }
  get isUserLocationReady(){
    return this.locationService.isUserLocationReady;
  }

  obtenerLatLng(event:Lugar){
    this.ubicacionFinal=event;
    console.log(this.ubicacionFinal);

  }

  guardarLocalizacion(){
    console.log('guardar');
    console.log(this.ubicacionFinal);

  }

}
