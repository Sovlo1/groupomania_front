import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  public newPostForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private post: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newPostForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.email]],
      content: [null, Validators.required],
    });
  }

  leaveForm(): void {
    this.router.navigate(['../home']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  submit(): void {
    const title: string = this.newPostForm.get('title')!.value;
    const content: string = this.newPostForm.get('content')!.value;
    this.post
      .addPost(title, content)
      .pipe(
        tap(() => {
          this.router.navigate(['../home']);
          this.post.getPosts();
        })
      )
      .subscribe();
  }
}
