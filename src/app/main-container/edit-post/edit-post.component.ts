import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  public post$!: Observable<Post[]>;
  public editPostForm!: FormGroup;
  public file!: File;
  public id!: string;
  public postList!: Post[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private post: PostsService
  ) {}

  ngOnInit(): void {
    this.editPostForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, Validators.required],
      file: [null],
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
    });
    this.post$ = this.post.post$;
    this.post.getSinglePost(this.id).subscribe((post) => {
      console.log(post);
      if (post[0].fileUrl) {
        this.editPostForm = this.formBuilder.group({
          title: [post[0].title, [Validators.required]],
          content: [post[0].content, Validators.required],
          file: [null],
        });
      } else {
        this.editPostForm = this.formBuilder.group({
          title: [post[0].title, [Validators.required]],
          content: [post[0].content, Validators.required],
          file: [null],
        });
      }
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
    this.editPostForm.get('file')!.setValue(file);
  }

  submit() {
    const updatedPost = new Post();
    updatedPost.title = this.editPostForm.get('title')!.value;
    updatedPost.content = this.editPostForm.get('content')!.value;
    this.post
      .updatePost(updatedPost, this.editPostForm.get('file')!.value, this.id!)
      .pipe(
        tap(() => {
          this.post.posts$;
          this.post.getPosts().subscribe((post) => {
            this.postList = post.reverse();
            this.router.navigate(['../home']);
          });
        })
      )
      .subscribe();
  }
}
