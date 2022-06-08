import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Comment } from 'src/app/models/comment.model';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  public postId?: number | undefined;
  public newCommentForm!: FormGroup;
  public commentIndex?: number;
  public newComment: boolean = false;
  public posts$!: Observable<Post[]>;
  public postList!: Post[];
  public file!: File;
  public maxComments: number = 3;
  public test!: number;

  constructor(
    private post: PostsService,
    private formBuilder: FormBuilder,
    private comment: CommentsService
  ) {}

  ngOnInit(): void {
    this.newCommentForm = this.formBuilder.group({
      content: [null, Validators.required],
      file: [null],
    });
    this.posts$ = this.post.posts$;
    this.post.getPosts().subscribe((post) => {
      this.postList = post.reverse();
      console.log(post);
    });
  }

  updateMaxComments(index: number) {
    this.commentIndex = index;
    console.log(this.commentIndex);
    this.maxComments = this.maxComments + 3;
    console.log(this.maxComments);
  }

  postComment(index: number) {
    console.log(this.postList);
    this.test = this.postList.length;
    console.log(this.test);
    this.commentIndex = index;
    console.log(this.commentIndex);
    this.newComment = true;
    this.postId = this.postList[this.commentIndex].id;
    console.log(this.postId);
    this.newCommentForm = this.formBuilder.group({
      content: ['', Validators.required],
      file: [null],
    });
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.newCommentForm.get('file')!.setValue(file);
  }

  submit() {
    console.log(this.postId);
    const newComment = new Comment();
    newComment.content = this.newCommentForm.get('content')!.value;
    this.comment
      .addComment(
        newComment,
        this.postId,
        this.newCommentForm.get('file')!.value
      )
      .pipe(
        tap(async () => {
          this.post.getPosts().subscribe((post) => {
            this.postList = post.reverse();
            console.log(post);
            this.newComment = false;
            this.commentIndex = undefined;
          });
        })
      )
      .subscribe();
  }
}
