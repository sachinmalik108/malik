import { NgModule } from "@angular/core"
import {Routes, RouterModule} from "@angular/router"

import {HomepageComponent} from "./homepage/homepage.component"
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { EditorComponent } from './editor/editor.component';
import { ArticledetailComponent } from './articledetail/articledetail.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
    {path: '',component: HomepageComponent},
    {path: 'login',component: SigninComponent},
    {path: 'register',component: SignupComponent},
    {path: 'editor',component: EditorComponent},
    {path: ':username',component: ProfileComponent},
    {path: 'editor/:slug',component: EditorComponent},
    {path: 'article/:slug',component: ArticledetailComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule{

}