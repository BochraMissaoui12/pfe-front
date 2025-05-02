import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  role!: string;
  constructor() {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.role = decodedToken.role;
    }
  }
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }
}
