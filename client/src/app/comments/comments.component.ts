import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CommentsService } from './comments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  commentsForm = new FormGroup({
    comment: new FormControl('')
  });

  token;
  id;

  constructor(private commentsService: CommentsService, private _route: ActivatedRoute) { }
  @Input() serie: any;
  serieById: any;

  ngOnInit() {
    this.id = this._route.snapshot.paramMap.get('id');
    this.token = sessionStorage.getItem('hash');
    this.token = this.token ? this.token.substr(9, 20) : '';

    this.commentsService.getComments(this.id);
    this.commentsService.getCommentsObservable().subscribe(serieId => {
      this.serieById = serieId;
    });
  }

  onSubmit() {
    const comments = {
      idSerie: this.serie.id,
      comment: this.commentsForm.controls['comment'].value
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    };

    this.commentsService.postComments(httpOptions, comments);

  }

}
