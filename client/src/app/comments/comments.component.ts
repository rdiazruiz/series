import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  commentsForm = new FormGroup({
    comment: new FormControl(''),
    idSerie: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const comments = {
      comment: this.commentsForm.controls['comment'].value,
      idSerie: this.commentsForm.controls['idSerie'].value
    };
    console.log(comments);
  }

}
