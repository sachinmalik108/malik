import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ArticlesService } from '../shared/articles.service'
import { Article } from '../shared/interface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  isAuthenticated: Boolean = false;
  articles : Array<Article> = [];
  feeds: Array<Article> = [];
  loading:Boolean = true;

  constructor(
    private authservice: AuthService,
    private articleservice: ArticlesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authservice.isAuthenticated.subscribe(
      (bool) => {
        this.isAuthenticated = bool;
        if(bool){
          this.getFeeds();
        }
      }
    );

      this.getArticles();
  }

  getArticles() {

    this.articleservice.getArticles({limit:20}).subscribe(
      (data) => {
        this.articles = data["articles"];
        this.loading = false;
      },
      (err) => {
        console.log(err.error)
      }
    )
  }

  getFeeds() {

    this.articleservice.getFeedArticles({limit:20}).subscribe(
      (data) => {
        this.feeds = data["articles"];
        console.log(this.articles)
        this.loading = false;
      },
      (err) => {
        console.log(err.error)
      }
    )
  }

  fetchArticle(slug:string){
    this.articleservice.getSingleArticle(slug).subscribe(
      (data) => {
        this.router.navigate(['/article/',slug]);
      },
      (err) => {
        console.log(err.error)
      }
    )
  }
}
