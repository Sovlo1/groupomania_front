import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-image',
  templateUrl: './comment-image.component.html',
  styleUrls: ['./comment-image.component.scss'],
})
export class CommentImageComponent implements OnInit {
  public comment$!: Observable<Comment[]>;
  public id!: string;
  public image!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comment: CommentsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
    });
    this.comment.getSingleComment(this.id).subscribe((comment) => {
      this.image = comment.fileUrl!;
    });
  }

  leaveForm(): void {
    this.router.navigate(['../home']);
  }
}
