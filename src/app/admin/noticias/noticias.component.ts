import { Component, OnInit } from '@angular/core';
import { Noticia, ResultNoticia, ResultNoticias } from 'src/app/interface/noticia.interface';
import { NoticiaService } from 'src/app/servicios/noticia.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit{

  listNoticias?:Noticia[];
  estado:string='0';
  constructor(
    private noticiaService:NoticiaService
  ){

  }
  ngOnInit(): void {
    this.mostrarNoticias();
  }

  mostrarNoticias(){
    this.noticiaService.getNoticias(this.estado).subscribe(
      {
        next:(data:ResultNoticias)=>{
          this.listNoticias=data.noticia;
          console.log(this.listNoticias);

        },
        error:(error)=>{
          console.log(error);

        }
      }
    )
  }

}
