import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { MapViewComponent } from './map-view/map-view.component';
import { LoadingComponent } from './loading/loading.component';
import { BtnBtnLocacionComponent } from './btn-btn-locacion/btn-btn-locacion.component';



@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    MapViewComponent,
    LoadingComponent,
    BtnBtnLocacionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    MapViewComponent,
    LoadingComponent,
    BtnBtnLocacionComponent
  ]
})
export class SharedModule { }
