import { Component, HostListener, OnInit } from '@angular/core';

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
    console.log(this.currentWindowWidth);
  }

  constructor() {}

  ngOnInit(): void {}
}
