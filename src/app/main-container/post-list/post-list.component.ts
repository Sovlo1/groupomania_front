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
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  public id?: string;

  constructor(
    private post: PostsService,
    private formBuilder: FormBuilder,
    private comment: CommentsService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.auth.getUserId();
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
    this.maxComments = this.maxComments + 3;
  }

  postComment(index: number) {
    this.commentIndex = index;
    this.newComment = true;
    this.postId = this.postList[index].id;
    this.newCommentForm = this.formBuilder.group({
      content: ['', Validators.required],
      file: [null],
    });
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.newCommentForm.get('file')!.setValue(file);
  }

  editPost(index: number) {
    this.postId = this.postList[index].id;
    this.router.navigate(['edit/' + this.postId], { relativeTo: this.route });
  }

  deletePost(index: number) {
    if (confirm('Etes vous certain de vouloir supprimer ce message?')) {
      const userId = this.postList[index].UserId;
      const postId = this.postList[index].id;
      console.log(userId, postId);
      if (this.id == userId) {
        this.post
          .deletePost(userId, postId)
          .pipe(
            tap(() => {
              this.post.getPosts().subscribe((post) => {
                this.postList = post.reverse();
                console.log(post);
              });
            })
          )
          .subscribe();
      }
    }
  }

  submitComment() {
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
