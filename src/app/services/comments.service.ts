import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comment$ = new Subject<Comment>();

  constructor(private http: HttpClient) {}

  addComment(comment: Comment, postId: number | undefined, file: File) {
    const formData = new FormData();
    formData.append('comment', JSON.stringify(comment));
    formData.append('file', file);
    formData.append('postId', JSON.stringify(postId));
    return this.http.post('http://localhost:3000/api/comment/new', formData);
  }

  deleteComment(userId: number | undefined, commentId: number | undefined) {
    const options = {
      body: {
        userId: userId,
        commentId: commentId,
      },
    };
    return this.http.delete(
      'http://localhost:3000/api/comment/delete',
      options
    );
  }

  getSingleComment(id: string) {
    return this.http
      .get<Comment>('http://localhost:3000/api/comment/' + id)
      .pipe(
        tap((comment: Comment) => {
          this.comment$.next(comment);
        })
      );
  }
}
