import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Comment } from './interface.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addComment(slug, payload): Observable<Comment> {

    return this.http.post
      ("https://conduit.productionready.io/api/articles/" + slug + "/comments",
      {
        comment: {
          body: payload
        }
      },
      this.addHeader())
      .pipe(map(data => data["comment"]));
  }

  getAllComments(slug): Observable<Comment[]> {
    return this.http.get("https://conduit.productionready.io/api/articles/" + slug + "/comments")
      .pipe(map(data => data["comments"]));
  }

  destroyComment(commentId, articleSlug) {
    return this.http
      .delete("https://conduit.productionready.io/api/articles/" + articleSlug + "/comments/" + commentId,
      this.addHeader());
  }

  addHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem("jwt")
      })
    };
    return httpOptions;
  }
}
