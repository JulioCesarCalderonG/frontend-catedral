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

const routes: Routes = [
  {
    path:'admin',
    component:AdminComponent,
    children:[
      {path:'',component:DashboardComponent},
      {path:'grafica',component:GraficaComponent},
      {path:'oraciones',component:OracionesComponent},
      {path:'iniciacion-cristiana',component:IniciacionCristianaComponent},
      {path:'liturgia',component:LiturgiaComponent},
      {path:'cancionero',component:CancioneroComponent},
      {path:'noticias',component:NoticiasComponent},
      {path:'directorio',component:DirectorioComponent},
      {path:'ministerio',component:MinisteriosComponent},
      {path:'materiales-pastorales',component:MaterialesPastoralesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
