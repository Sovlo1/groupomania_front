import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public currentWindowWidth!: number;

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  constructor(private auth: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
  }
}
