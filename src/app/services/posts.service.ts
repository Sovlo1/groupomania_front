import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http
      .get<Post[]>('http://localhost:3000/api/post/posts')
      .pipe(
        tap((posts: Post[]) => {
          this.posts$.next(posts);
          console.log(posts);
        })
      )
      .subscribe();
  }

  addPost(title: string, content: string) {
    return this.http.post('http://localhost:3000/api/post/new', {
      title: title,
      content: content,
    });
  }
}
