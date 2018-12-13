import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SerieComponent } from './serie/serie.component';
import { LoginComponent } from './login/login.component';
import { CommentsComponent } from './comments/comments.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'serie/:id', component: SerieComponent },
  { path: 'contacto', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'comment', component: CommentsComponent },
  { path: '**', redirectTo: '/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
