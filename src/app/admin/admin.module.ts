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
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DirectorioLocalozacionComponent } from './directorio-localozacion/directorio-localozacion.component';
import { TipoOracionesComponent } from './tipo-oraciones/tipo-oraciones.component';
import { TipoCancioneroComponent } from './tipo-cancionero/tipo-cancionero.component';
import { TipoLiturgiaComponent } from './tipo-liturgia/tipo-liturgia.component';
import { TiempoLiturgiaComponent } from './tiempo-liturgia/tiempo-liturgia.component';
import { TipoIniciacionComponent } from './tipo-iniciacion/tipo-iniciacion.component';
import { AtencionComponent } from './atencion/atencion.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { TipoMinisterioComponent } from './tipo-ministerio/tipo-ministerio.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TipoMaterialComponent } from './tipo-material/tipo-material.component';
import { PlanPastoralComponent } from './plan-pastoral/plan-pastoral.component';
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
    IniciacionCristianaComponent,
    DirectorioLocalozacionComponent,
    TipoOracionesComponent,
    TipoCancioneroComponent,
    TipoLiturgiaComponent,
    TiempoLiturgiaComponent,
    TipoIniciacionComponent,
    AtencionComponent,
    TipoMinisterioComponent,
    TipoMaterialComponent,
    PlanPastoralComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    CKEditorModule,
    NgxPaginationModule
  ]
})
export class AdminModule { }
