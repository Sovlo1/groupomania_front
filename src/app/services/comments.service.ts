import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  addComment(comment: Comment, postId: number | undefined) {
    const options = {
      body: {
        comment: comment,
        postId: postId,
      },
    };
    return this.http.post('http://localhost:3000/api/comment/new', options);
  }
}
