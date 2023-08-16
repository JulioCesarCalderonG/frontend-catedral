import { Component,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/servicios/location.service';
import { MapService } from 'src/app/servicios/map.service';

@Component({
  selector: 'app-btn-btn-locacion',
  templateUrl: './btn-btn-locacion.component.html',
  styleUrls: ['./btn-btn-locacion.component.css']
})
export class BtnBtnLocacionComponent {
  @Output('btnGuardar') btnGuardar = new EventEmitter();
  constructor(
    private locationService:LocationService,
    private mapService:MapService,
    private router:Router
  ) { }
  goToMyLocation(){
    if(!this.locationService.isUserLocationReady) throw Error('No hay ubicacion del usuario');
    if(!this.mapService.isMapReady) throw Error('No se ha inicializado el mapa')
    this.mapService.flyTo(this.locationService.useLocation!);

  }

  guardar(){
    this.btnGuardar.emit();
  }

  atras(){
    this.router.navigate(['/admin/directorio'])
  }
}
