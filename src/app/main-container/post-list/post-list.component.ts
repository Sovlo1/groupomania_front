import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, tap } from 'rxjs';
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
  public postId?: number;
  public commentId?: number;
  public newCommentForm!: FormGroup;
  public postIndex!: number;
  public commentIndex?: number;
  public newComment: boolean = false;
  public postList!: Post[];
  public file!: File;
  public id?: string | null;
  public deleteThisPost: boolean = false;
  public deleteIndex!: number;
  public deleteThisComment: boolean = false;
  public isAdmin?: boolean;
  public isMod?: boolean;
  public posts$!: Observable<Post[]>;
  public defaultProfilePicture: any = '../assets/images/defaultuser.png';
  public currentWindowWidth!: number;
  public image?: string;
  public error: boolean = false;
  public errorLog?: string;

  constructor(
    private post: PostsService,
    private formBuilder: FormBuilder,
    private comment: CommentsService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
    this.isAdmin = this.auth.getAdminStatus();
    this.isMod = this.auth.getModStatus();
    this.id = this.auth.getUserId();
    this.newCommentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
      file: [null],
    });
    this.posts$ = this.post.posts$;
    this.post.getPosts().subscribe((post) => {
      this.postList = post.reverse();
    });
  }

  likeStatus(i: number) {
    if (
      this.postList[i].Likes.find(
        (like: { UserId: string }) => like.UserId == this.id
      )
    ) {
      return 'fa-solid';
    } else {
      return 'fa-regular';
    }
  }

  postComment(index: number) {
    this.image = undefined;
    this.commentIndex = index;
    this.newComment = true;
    this.postId = this.postList[index].id;
    this.newCommentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
      file: [null],
    });
  }

  closeComment() {
    this.newComment = false;
    this.commentIndex = undefined;
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.newCommentForm.get('file')!.setValue(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editPost(index: number) {
    this.postId = this.postList[index].id;
    this.router.navigate(['edit/' + this.postId], { relativeTo: this.route });
  }

  likePost(i: number) {
    this.postId = this.postList[i].id;
    this.post.likePost(this.postId!, this.id!).subscribe(() => {
      this.updatePostList();
    });
  }

  updatePostList() {
    return this.post.getPosts().subscribe((post) => {
      this.post.posts$;
      this.postList = post.reverse();
    });
  }

  deletePost(index: number) {
    this.deleteThisPost = true;
    this.deleteIndex = index;
  }

  deleteComment(index: number, i: number) {
    this.deleteThisComment = true;
    this.deleteIndex = index;
    this.postIndex = i;
    this.commentIndex = index;
  }

  cancelCommentDelete() {
    this.deleteThisComment = false;
  }

  confirmCommentDelete() {
    const userId =
      this.postList[this.postIndex].Comments![this.deleteIndex].userId;
    const commentId =
      this.postList[this.postIndex].Comments![this.deleteIndex].id;
    if (this.id == userId || this.isAdmin || this.isMod) {
      this.comment
        .deleteComment(userId, commentId)
        .pipe(
          tap(() => {
            this.post.getPosts().subscribe((post) => {
              this.postList = post.reverse();
            });
          })
        )
        .subscribe();
    }
    this.deleteThisComment = false;
  }

  cancelPostDelete() {
    this.deleteThisPost = false;
  }

  confirmPostDelete() {
    const userId = this.postList[this.deleteIndex].UserId;
    const postId = this.postList[this.deleteIndex].id;
    if (this.id == userId || this.isAdmin || this.isMod) {
      this.post
        .deletePost(userId, postId)
        .pipe(
          tap(() => {
            this.post.getPosts().subscribe((post) => {
              this.postList = post.reverse();
            });
          })
        )
        .subscribe();
    }
    this.deleteThisPost = false;
  }

  goToThatProfile(id: number) {
    this.router.navigate(['./profile/' + id]);
  }

  submitComment(): any {
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
            this.newComment = false;
            this.commentIndex = undefined;
          });
        }),
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .subscribe();
  }

  postImage(index: number) {
    this.postId = this.postList[index].id;
    this.router.navigate(['post/image/' + this.postId], {
      relativeTo: this.route,
    });
  }

  commentImage(index: number, i: number) {
    this.commentId = this.postList[i].Comments![index].id;
    this.router.navigate(['comment/image/' + this.commentId], {
      relativeTo: this.route,
    });
  }
}
