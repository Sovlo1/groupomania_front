import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  public posts$!: Observable<Post[]>;
  public editPostForm!: FormGroup;
  public file!: File;
  public id!: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private post: PostsService
  ) {}

  ngOnInit(): void {
    this.editPostForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, Validators.required],
      file: [null],
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
    });
    this.posts$ = this.post.posts$;
  }

  leaveForm(): void {
    this.router.navigate(['../home']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.editPostForm.get('file')!.setValue(file);
  }

  submit() {
    console.log('pouet');
  }
}
