import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-remove',
  templateUrl: './user-remove.component.html',
  styleUrls: ['./user-remove.component.scss'],
})
export class UserRemoveComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  leaveForm(): void {
    this.router.navigate(['../profile']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }
}
