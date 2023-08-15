import { Component, AfterViewInit, OnInit } from '@angular/core';
import { LocationService } from 'src/app/servicios/location.service';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit{

  constructor(
    private locationService:LocationService,
  ){

  }
  ngOnInit(): void {

  }
  get isUserLocationReady(){
    return this.locationService.isUserLocationReady;
  }
}
