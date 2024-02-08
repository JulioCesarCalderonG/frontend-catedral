import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems?: any[];
  constructor(private sidebarService: SidebarService, private authService:AuthService) {
    this.menuItems = this.sidebarService.menu;
  }

  ngOnInit(): void {
  }
  logout(){
    this.authService.loggoud();
  }
}
