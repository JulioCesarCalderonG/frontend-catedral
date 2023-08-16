import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/servicios/location.service';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit{

  constructor(
    private locationService:LocationService,
    private router:Router
  ){

  }
  ngOnInit(): void {

  }
  get isUserLocationReady(){
    return this.locationService.isUserLocationReady;
  }
  localizacion(){
    this.router.navigateByUrl(`admin/directorio-localizacion/${1}/${-8.383624204189573}/${-74.53290336202565}`)
  }
}
