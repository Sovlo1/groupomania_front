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

  addComment(comment: Comment, postId: number | undefined, file: File) {
    const formData = new FormData();
    formData.append('comment', JSON.stringify(comment));
    formData.append('file', file);
    formData.append('postId', JSON.stringify(postId));
    return this.http.post('http://localhost:3000/api/comment/new', formData);
  }
}
