import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoiY2VzYXIxMjE0IiwiYSI6ImNrdTJzdnR4bjRiNjQycXBxemJ5YWs0cmkifQ.nuKwaMp6GcopSRRkYr1zKw';


if (!navigator.geolocation) {
  alert('Navegador no soporta la Geolocalizacion')
  throw new Error("Navegador no soporta la Geolocalizacion");

}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
