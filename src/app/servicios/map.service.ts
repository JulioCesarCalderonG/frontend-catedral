import { Injectable } from '@angular/core';
import {
  Map,
  Marker,
  LngLatLike
} from 'mapbox-gl';
import { DireccionApiClient } from '../api-mapbox/api.mapbox';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  constructor(private direccionAlerta: DireccionApiClient) {}

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }
  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');
    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }
/*   flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');
    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkerAlerta(listAlerta: Alerta[], userLocation: [number, number]) {
    if (!this.map) throw Error('El mapa no esta inicializado');

    this.markers.forEach((alerta) => alerta.remove());
    const newMakers = [];
    for (const alerta of listAlerta) {
      const popup = new Popup().setHTML(`
                      <h6>${alerta.Ciudadano.nombre}</h6>
                      <span>${alerta.Ciudadano.apellido}</span>
                    `);
    const div = document.createElement('div');
    const width = 35;
    const height= 32;
    div.className='marker';
    div.style.backgroundImage=`url(https://res.cloudinary.com/dkxwh94qt/image/upload/v1685376640/ubicacion_1_kgz64r.png)`;
    div.style.width=`${width}px`;
    div.style.height=`${height}px`;
      const newMarker = new Marker(div)
        .setLngLat([alerta.lng, alerta.lat])
        .setPopup(popup)
        .addTo(this.map);
      newMakers.push(newMarker);
    }
    this.markers = newMakers;
    if (listAlerta.length === 0) return;
    //Limite del mapa
    const bounds = new LngLatBounds();
    bounds.extend(userLocation);
    this.markers.forEach((marker) => bounds.extend(marker.getLngLat()));
    this.map.fitBounds(bounds, {
      padding: 300,
    });
  } */

}
