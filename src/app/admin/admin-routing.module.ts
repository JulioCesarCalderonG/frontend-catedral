import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';
import { OracionesComponent } from './oraciones/oraciones.component';
import { IniciacionCristianaComponent } from './iniciacion-cristiana/iniciacion-cristiana.component';
import { LiturgiaComponent } from './liturgia/liturgia.component';
import { CancioneroComponent } from './cancionero/cancionero.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { DirectorioComponent } from './directorio/directorio.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';
import { MaterialesPastoralesComponent } from './materiales-pastorales/materiales-pastorales.component';
import { DirectorioLocalozacionComponent } from './directorio-localozacion/directorio-localozacion.component';
import { TipoOracionesComponent } from './tipo-oraciones/tipo-oraciones.component';
import { TipoLiturgiaComponent } from './tipo-liturgia/tipo-liturgia.component';
import { TiempoLiturgiaComponent } from './tiempo-liturgia/tiempo-liturgia.component';
import { TipoIniciacionComponent } from './tipo-iniciacion/tipo-iniciacion.component';
import { TipoCancioneroComponent } from './tipo-cancionero/tipo-cancionero.component';
import { AtencionComponent } from './atencion/atencion.component';
import { TipoMinisterioComponent } from './tipo-ministerio/tipo-ministerio.component';
import { TipoMaterialComponent } from './tipo-material/tipo-material.component';
import { PlanPastoralComponent } from './plan-pastoral/plan-pastoral.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { adminGuard } from '../guard/admin.guard';

const routes: Routes = [
  {
    path:'admin',
    component:AdminComponent,
    children:[
      {path:'',component:DashboardComponent},
      {path:'grafica',component:GraficaComponent},
      {path:'oraciones',component:OracionesComponent},
      {path:'tipo-oracion',component:TipoOracionesComponent},
      {path:'iniciacion-cristiana',component:IniciacionCristianaComponent},
      {path:'tipo-iniciacion',component:TipoIniciacionComponent},
      {path:'liturgia',component:LiturgiaComponent},
      {path:'tiempo-liturgia',component:TiempoLiturgiaComponent},
      {path:'tipo-liturgia',component:TipoLiturgiaComponent},
      {path:'cancionero',component:CancioneroComponent},
      {path:'tipo-cancionero',component:TipoCancioneroComponent},
      {path:'noticias',component:NoticiasComponent},
      {path:'directorio',component:DirectorioComponent},
      {path:'directorio-localizacion/:id/:lat/:lng',component:DirectorioLocalozacionComponent},
      {path:'atencion',component:AtencionComponent},
      {path:'ministerio',component:MinisteriosComponent},
      {path:'tipo-ministerio',component:TipoMinisterioComponent},
      {path:'materiales-pastorales',component:MaterialesPastoralesComponent},
      {path:'tipo-materiales-pastorales',component:TipoMaterialComponent},
      {path:'plan-pastoral',component:PlanPastoralComponent},
      {path:'calendario',component:CalendarioComponent}
    ],
    canActivateChild: [adminGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
