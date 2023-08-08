import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';
import { SharedModule } from '../shared/shared.module';
import { CancioneroComponent } from './cancionero/cancionero.component';
import { OracionesComponent } from './oraciones/oraciones.component';
import { LiturgiaComponent } from './liturgia/liturgia.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { DirectorioComponent } from './directorio/directorio.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';
import { MaterialesPastoralesComponent } from './materiales-pastorales/materiales-pastorales.component';
import { IniciacionCristianaComponent } from './iniciacion-cristiana/iniciacion-cristiana.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    GraficaComponent,
    CancioneroComponent,
    OracionesComponent,
    LiturgiaComponent,
    NoticiasComponent,
    DirectorioComponent,
    MinisteriosComponent,
    MaterialesPastoralesComponent,
    IniciacionCristianaComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
