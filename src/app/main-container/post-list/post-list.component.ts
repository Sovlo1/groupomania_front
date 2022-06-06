import { Component, OnInit } from '@angular/core';
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
  public clicked: boolean = false;
  public commentIndex?: number;
  public newComment: boolean = false;
  public posts$!: Observable<Post[]>;
  public postList!: Post[];

  constructor(
    private post: PostsService,
    private formBuilder: FormBuilder,
    private comment: CommentsService
  ) {}

  ngOnInit(): void {
    this.newCommentForm = this.formBuilder.group({
      content: [null, Validators.required],
    });
    this.posts$ = this.post.posts$;
    this.post.getPosts().subscribe((post) => {
      this.postList = post.reverse();
    });
  }

  postComment(index: number) {
    this.commentIndex = index;
    this.postId = this.postList[this.commentIndex].id;
    this.newComment = true;
  }

  submit() {
    const newComment = new Comment();
    newComment.content = this.newCommentForm.get('content')!.value;
    this.comment
      .addComment(newComment, this.postId)
      .pipe(
        tap(async () => {
          this.post.getPosts().subscribe((post) => {
            this.postList = post.reverse();
            this.newComment = false;
          });
        })
      )
      .subscribe();
  }
}
