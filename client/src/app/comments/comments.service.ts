import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeService } from '../home/home.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  // Observable con todos los comentarios de la serie por id
  private listComments = new BehaviorSubject(null);

  constructor(private http: HttpClient, private homeService:HomeService) { }

  getCommentsObservable() { return this.listComments.asObservable(); }

  getComments(id) {
    this.homeService.getSerieById(id).subscribe(serie => {
      this.listComments.next(serie);
    });
  }

  postComments(authorization, comment) {
    this.http.post('http://localhost:3000/api/comment', comment, authorization).subscribe({
      complete: () => {
        this.getComments(comment.idSerie);
      }
    });
  }

}
