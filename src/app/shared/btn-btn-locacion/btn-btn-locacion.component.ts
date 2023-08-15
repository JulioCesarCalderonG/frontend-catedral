import { Component } from '@angular/core';
import { LocationService } from 'src/app/servicios/location.service';
import { MapService } from 'src/app/servicios/map.service';

@Component({
  selector: 'app-btn-btn-locacion',
  templateUrl: './btn-btn-locacion.component.html',
  styleUrls: ['./btn-btn-locacion.component.css']
})
export class BtnBtnLocacionComponent {
  constructor(
    private locationService:LocationService,
    private mapService:MapService
  ) { }
  goToMyLocation(){
    if(!this.locationService.isUserLocationReady) throw Error('No hay ubicacion del usuario');
    if(!this.mapService.isMapReady) throw Error('No se ha inicializado el mapa')
    this.mapService.flyTo(this.locationService.useLocation!);

  }
}
