import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
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
export class PostListComponent implements OnInit, OnDestroy {
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
      content: [null, Validators.required],
      file: [null],
    });
    this.posts$ = this.post.posts$;
    this.post.getPosts().subscribe((post) => {
      this.postList = post.reverse();
      console.log(post);
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
      console.log(this.postList);
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
    console.log(this.commentIndex, this.postIndex);
  }

  cancelCommentDelete() {
    this.deleteThisComment = false;
  }

  confirmCommentDelete() {
    const userId =
      this.postList[this.postIndex].Comments![this.deleteIndex].userId;
    const commentId =
      this.postList[this.postIndex].Comments![this.deleteIndex].id;
    console.log(userId, commentId);
    if (this.id == userId || this.isAdmin || this.isMod) {
      this.comment
        .deleteComment(userId, commentId)
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
    this.deleteThisComment = false;
  }

  cancelPostDelete() {
    this.deleteThisPost = false;
  }

  confirmPostDelete() {
    const userId = this.postList[this.deleteIndex].UserId;
    const postId = this.postList[this.deleteIndex].id;
    console.log('allo ', userId, postId);
    if (this.id == userId || this.isAdmin || this.isMod) {
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
    this.deleteThisPost = false;
  }

  goToThatProfile(id: number) {
    this.router.navigate(['./profile/' + id]);
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

  postImage(index: number) {
    this.postId = this.postList[index].id;
    this.router.navigate(['post/image/' + this.postId], {
      relativeTo: this.route,
    });
    console.log('pouet');
    console.log(index);
  }

  commentImage(index: number, i: number) {
    this.commentId = this.postList[i].Comments![index].id;
    this.router.navigate(['comment/image/' + this.commentId], {
      relativeTo: this.route,
    });
    console.log('pouet');
    console.log(index);
    console.log(this.commentId);
  }

  ngOnDestroy(): void {}
}
