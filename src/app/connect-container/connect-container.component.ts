import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connect-container',
  templateUrl: './connect-container.component.html',
  styleUrls: ['./connect-container.component.scss'],
})
export class ConnectContainerComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}
}
