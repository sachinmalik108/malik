import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Article } from './interface.service';
import { BehaviorSubject, ReplaySubject, Observable, throwError } from 'rxjs'
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {


  constructor(
    private http: HttpClient,
  ) { }

  getArticles(filters?) {
    const params = filters;
    return this.http.get("https://conduit.productionready.io/api/articles", { params })
      .pipe(
        catchError(err => {
          return throwError(err.error)
        })
      )
  }

  getFeedArticles(filters?) {
    const params = filters;
    let option = this.addHeader()
    option["params"] = params; 
    return this.http.get("https://conduit.productionready.io/api/articles/feed", option)
      .pipe(
        catchError(err => {
          return throwError(err.error)
        })
      )
  }

  getSingleArticle(slug: string) {
    return this.http.get("https://conduit.productionready.io/api/articles/" + slug)
      .pipe(
        catchError(err => {
          return throwError(err.error)
        }),
        map(
          (data) => {
            return data;
          }
        )
      )
  }

  createArticle(payload) {
    return this.http.post("https://conduit.productionready.io/api/articles/",
      {
        article: payload
      },
      this.addHeader())
      .pipe(
        catchError(err => {
          return throwError(err.error)
        }),
        map(
          (data) => {
            return data['article'];
          }
        )
      )
  }

  updateArticle(payload) {
    return this.http.put("https://conduit.productionready.io/api/articles/" + payload.slug,
      {
        article: payload
      },
      this.addHeader())
      .pipe(
        catchError(err => {
          return throwError(err.error)
        }),
        map(
          (data) => {
            return data['article'];
          }
        )
      )
  }

  deleteArticle(slug: string) {
    return this.http.delete("https://conduit.productionready.io/api/articles/" + slug,
    this.addHeader())
  }

  addHeader() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem("jwt")
      })
    };
    return httpOptions;
  }
}
