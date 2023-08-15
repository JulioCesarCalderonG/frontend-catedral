import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import { LocationService } from 'src/app/servicios/location.service';
import { MapService } from 'src/app/servicios/map.service';
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
  constructor(
    private locationService: LocationService,
    private mapService:MapService
  ) {
  }
  ngAfterViewInit(): void {
    if (!this.locationService.useLocation) throw Error('No hay Ubicacion del Personal');
    console.log(this.locationService.useLocation);
    this.map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.locationService.useLocation!, // starting position [lng, lat]
      zoom: 14, // starting zoom
    })
    ;
      const popup = new Popup().setHTML(`
      <h6>Serenazgo</h6>
      <span>Mi Ubicacion</span>
    `);
    this.marker = new Marker({
      draggable:true
    })
      .setLngLat(this.locationService.useLocation!)
      .setPopup(popup)
      .addTo(this.map!);
    //this.mostrarMarcador();
    /* if (!this.locationService.useLocation) throw Error('No hay Ubicacion del Personal');


    this.mostrarMarcador(); */
  }
  mostrarMarcador() {
    this.locationService.getUserLocation();
    const popup = new Popup().setHTML(`
    <h6>Serenazgo</h6>
    <span>Mi Ubicacion</span>
  `);
  const div = document.createElement('div');
  const width = 65;
  const height= 70;
  div.className='marker';
  div.style.backgroundImage=`url(https://res.cloudinary.com/dkxwh94qt/image/upload/v1683831912/coche-de-policia_1_fmjznc.png)`;
  div.style.width=`${width}px`;
  div.style.height=`${height}px`;
     this.marker = new Marker()
      .setLngLat(this.locationService.useLocation!)
      .setPopup(popup)
      .addTo(this.map!);

    this.mapService.setMap(this.map!);

  }
}
