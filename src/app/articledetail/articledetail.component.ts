import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ArticlesService } from '../shared/articles.service'
import { CommentsService } from '../shared/comments.service'
import { Article, Comment, User } from '../shared/interface.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-articledetail',
  templateUrl: './articledetail.component.html',
  styleUrls: ['./articledetail.component.css']
})
export class ArticledetailComponent implements OnInit {

  isAuthenticated: Boolean = false;
  article: Article = null;
  comments: Comment[];
  currentUser: User;

  constructor(
    private authservice: AuthService,
    private articleservice: ArticlesService,
    private commentservice: CommentsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.authservice.isAuthenticated.subscribe(
      (bool) => {
        this.isAuthenticated = bool;
      }
    );
    this.authservice.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );

    this.route.params.subscribe(
      (params: Params) => {
        this.articleservice.getSingleArticle(params["slug"]).subscribe(
          data => {
            this.article = data["article"]
            this.populateComments()
          },
          err => console.log(err)
        )
      }
    )

  }

  populateComments() {
    this.commentservice.getAllComments(this.article.slug)
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  addComment(form: NgForm) {
    this.commentservice
      .addComment(this.article.slug, form.value.comment)
      .subscribe(
        comment => {
          this.comments.unshift(comment);
        },
        errors => {
          console.log(errors)
          this.authservice.logout()
        }
      );
    form.reset();
  }

  deleteComment(comment: Comment) {
    this.commentservice.destroyComment(comment.id, this.article.slug)
      .subscribe(
        success => {
          this.comments = this.comments.filter((item) => item !== comment);
        },
        error => {
          console.log(error);
          this.authservice.logout()
        }
      );
  }

  deleteArticle(slug: string){
    this.articleservice.deleteArticle(slug).subscribe(
      success => this.router.navigate(['']),
      error => this.authservice.logout()
    )
  }
}
