import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ArticlesService } from '../shared/articles.service'
import { Article, User } from '../shared/interface.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy {

  title: string;
  description: string;
  body: string;
  curretUser: User;
  slug:string;
  errors: Array<string> = [];

  subscription1: Subscription;

  constructor(
    private authservice: AuthService,
    private articleservice: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    this.subscription1 = this.authservice.currentUser.subscribe(
      userData => {
        console.log(userData)
        if (userData === {}) {
          this.authservice.logout();
        }
        this.curretUser = userData;
      }
    )

    this.route.params.subscribe(
      (params: Params) => {
        if (params["slug"]) {
          this.slug = params["slug"]
          this.articleservice.getSingleArticle(params["slug"]).subscribe(
            data => {
              if (this.curretUser.username === data["article"].author.username) {
                console.log(data)
                this.title = data["article"].title;
                this.description = data["article"].description;
                this.body = data["article"].body;
              } else {
                this.authservice.logout();
              }
            },
            err => {
              console.log(err)
              this.authservice.logout();
            }
          )
        }
      }
    )
  }

  createArticle(form: NgForm) {
    console.log(form.value)
    let payload = {
      title: form.value.title,
      description: form.value.description,
      body: form.value.body,
      slug: this.slug,
      tagList: []
    }
   if(this.slug){
    this.articleservice.updateArticle(payload).subscribe(
      article => {
        this.router.navigate(['/article/', article.slug])
      },
      error => {
        this.errors = Object.keys(error.errors || {})
          .map(key => `${key} ${error.errors[key]}`)
      }
    )
   }else{
    this.articleservice.createArticle(payload).subscribe(
      article => {
        this.router.navigate(['/article/', article.slug])
      },
      error => {
        this.errors = Object.keys(error.errors || {})
          .map(key => `${key} ${error.errors[key]}`)
      }
    )
   }
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe()
  }

}
