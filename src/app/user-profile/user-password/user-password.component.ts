import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss'],
})
export class UserPasswordComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  leaveForm(): void {
    this.router.navigate(['../profile']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }
}
