import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NgModule} from '@angular/core';
import {CreateComponent} from './create/create.component';

export const routes: Routes = [
  {path: 'execution/:executionId', component: CreateComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}, // Redirection par défaut vers la route /home
  {path: '**', redirectTo: 'home'} // Route wildcard pour gérer les chemins non définis
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
