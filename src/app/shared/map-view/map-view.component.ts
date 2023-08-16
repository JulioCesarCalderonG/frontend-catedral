import { Component, ElementRef, OnInit, ViewChild, AfterViewInit,Output,EventEmitter,Input } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import { LocationService } from 'src/app/servicios/location.service';
import { MapService } from 'src/app/servicios/map.service';

interface Lugar{
  lng:number,
  lat:number
}

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})


export class MapViewComponent {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  map?: Map;
  marker?:Marker;
  divGeneral = document.querySelector('#listado');
  @Output('lngLatEmiter') lngLatEmiter = new EventEmitter<Lugar>();
  @Input() ubicacion?: Lugar;
  constructor(
    private locationService: LocationService,
    private mapService:MapService
  ) {


  }
  ngAfterViewInit(): void {


    if (!this.ubicacion!) throw Error('No hay Ubicacion del Personal');
    const locacion:[number,number] = [this.ubicacion!.lng,this.ubicacion!.lat];
    console.log(this.ubicacion);
    //console.log(this.locationService.useLocation);
    this.map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: locacion!, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });
    this.lngLatEmiter.emit(this.ubicacion!);
    this.agregarMarcador(this.ubicacion!)
  }
  agregarMarcador(marcador:Lugar) {
    const popup = new Popup().setHTML(`
      <h6>Iglesia</h6>
      <span>Mi Ubicacion</span>
    `);
    const marker = new Marker({
      draggable:true
    })
      .setLngLat(marcador!)
      .setPopup(popup)
      .addTo(this.map!);
    marker.on('drag',()=>{
      const lngLat = marker.getLngLat();
      this.lngLatEmiter.emit(lngLat);
      //console.log(lngLat);
    });
    this.mapService.setMap(this.map!);
  }
}
