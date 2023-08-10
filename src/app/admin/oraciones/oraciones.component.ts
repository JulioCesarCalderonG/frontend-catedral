import { Component, OnInit } from '@angular/core';
import { Oracione, ResultOraciones } from 'src/app/interface/oracion.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OracionesService } from 'src/app/servicios/oraciones.service';

@Component({
  selector: 'app-oraciones',
  templateUrl: './oraciones.component.html',
  styleUrls: ['./oraciones.component.css']
})
export class OracionesComponent implements OnInit{

  listOraciones?:Oracione[];
  oracionesForm:FormGroup;
  estado:string='1';
  constructor(
    private oracionService:OracionesService,
    private fb:FormBuilder,

  ){
    this.oracionesForm = this.fb.group({
      nombre:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.mostrarOraciones();
  }
  mostrarOraciones(){
    this.oracionService.getOraciones(this.estado).subscribe({
      next:(data:ResultOraciones)=>{
        this.listOraciones = data.oraciones;
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }
}
