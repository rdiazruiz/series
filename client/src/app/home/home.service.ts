import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private listSeries = new BehaviorSubject(null);
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getSeries() {
    return this.listSeries.asObservable();
  }

  getListSeries() {
    return this.http.get('http://localhost:3000/api/series');
  }

  getListSeriesFilter(title) {
    return this.http.get('http://localhost:3000/api/search/' + title);
  }

  getSerieById(id) {
    return this.http.get('http://localhost:3000/api/series/' + id);
  }

  getListSerie(title?) {
    if (!title) {
      this.getListSeries().subscribe(series => {
        this.listSeries.next(series);
      });
    } else {
      this.getListSeriesFilter(title).subscribe(series => {
        this.listSeries.next(series);
      });
    }
  }

  postComments(authorization, comment) {
    console.log(comment.idSerie);
    this.http.post('http://localhost:3000/api/comment', comment, authorization).subscribe();

  }
}
