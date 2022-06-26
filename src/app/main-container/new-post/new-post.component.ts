import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  public newPostForm!: FormGroup;
  public file!: File;
  public postList!: Post[];

  constructor(
    private formBuilder: FormBuilder,
    private post: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newPostForm = this.formBuilder.group({
      title: [window.sessionStorage.getItem('title'), [Validators.required]],
      content: [window.sessionStorage.getItem('content'), Validators.required],
      file: [null],
    });
  }

  leaveForm(): void {
    this.router.navigate(['../home']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.newPostForm.get('file')!.setValue(file);
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  saveTitle() {
    window.sessionStorage.setItem(
      'title',
      this.newPostForm.get('title')!.value
    );
  }

  saveContent() {
    window.sessionStorage.setItem(
      'content',
      this.newPostForm.get('content')!.value
    );
  }

  submit(): void {
    const newPost = new Post();
    newPost.title = this.newPostForm.get('title')!.value;
    newPost.content = this.newPostForm.get('content')!.value;
    window.sessionStorage.clear();
    this.post
      .addPost(newPost, this.newPostForm.get('file')!.value)
      .pipe(
        tap(() => {
          this.post.posts$;
          this.post.getPosts().subscribe((post) => {
            this.postList = post.reverse();
            this.redirectTo('../home');
          });
        })
      )
      .subscribe();
  }
}
