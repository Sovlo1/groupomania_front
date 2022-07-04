import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrls: ['./post-image.component.scss'],
})
export class PostImageComponent implements OnInit {
  public id!: string;
  public image!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private post: PostsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
    });
    this.post.getSinglePost(this.id).subscribe((post) => {
      this.image = post[0].fileUrl!;
    });
  }

  leaveForm(): void {
    this.router.navigate(['../home']);
  }
}
