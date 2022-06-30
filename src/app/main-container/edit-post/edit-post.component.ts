import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
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
  public image?: string;
  public error: boolean = false;
  public errorLog?: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private post: PostsService
  ) {}

  ngOnInit(): void {
    this.editPostForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(2)]],
      content: [null, [Validators.required, Validators.minLength(2)]],
      file: [null],
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
    });
    this.post$ = this.post.post$;
    this.post.getSinglePost(this.id).subscribe((post) => {
      if (post[0].fileUrl) {
        this.image = post[0].fileUrl;
        this.editPostForm = this.formBuilder.group({
          title: [
            post[0].title,
            [Validators.required, Validators.minLength(2)],
          ],
          content: [
            post[0].content,
            [Validators.required, Validators.minLength(2)],
          ],
          file: [null],
        });
      } else {
        this.editPostForm = this.formBuilder.group({
          title: [
            post[0].title,
            [Validators.required, Validators.minLength(2)],
          ],
          content: [
            post[0].content,
            [Validators.required, Validators.minLength(2)],
          ],
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
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(file);
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
        }),
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .subscribe();
  }
}
