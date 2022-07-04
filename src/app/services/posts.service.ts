import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts$ = new Subject<Post[]>();
  post$ = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<Post[]>('http://localhost:3000/api/post/posts').pipe(
      tap((posts: Post[]) => {
        this.posts$.next(posts);
      })
    );
  }

  getSinglePost(id: string) {
    return this.http.get<Post[]>('http://localhost:3000/api/post/' + id).pipe(
      tap((post: Post[]) => {
        this.post$.next(post);
      })
    );
  }

  addPost(post: Post, file: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('file', file);
    return this.http.post('http://localhost:3000/api/post/new', formData);
  }

  deletePost(userId: number | undefined, postId: number | undefined) {
    const options = {
      body: {
        userId: userId,
        postId: postId,
      },
    };
    return this.http.delete('http://localhost:3000/api/post/delete', options);
  }

  updatePost(post: Post, file: File, id: string) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('file', file);
    return this.http.put('http://localhost:3000/api/post/edit/' + id, formData);
  }

  likePost(postId: number, userId: string) {
    return this.http.put('http://localhost:3000/api/post/like/' + postId, {
      postId,
      userId,
    });
  }
}
