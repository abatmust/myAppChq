import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListChequesComponent } from "./list-cheques/list-cheques.component";
import { BanquesListComponent } from "./banques-list/banques-list.component";
import { TireursComponent } from "./tireurs/tireurs.component";
import { MotifsComponent } from "./motifs/motifs.component";
import { EntitesComponent } from "./entites/entites.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { BESPPComponent } from "./be-spp/be-spp.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "cheques",
    component: ListChequesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "banques",
    component: BanquesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "tireurs",
    component: TireursComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "motifs",
    component: MotifsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "entites",
    component: EntitesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "be-spp",
    component: BESPPComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
