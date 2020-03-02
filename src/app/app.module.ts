import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerModule } from "primeng/spinner";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ListChequesComponent } from "./list-cheques/list-cheques.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { BanquesListComponent } from "./banques-list/banques-list.component";
import { DialogModule } from "primeng/dialog";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TireursComponent } from "./tireurs/tireurs.component";
import { ShowAsTireurPipe } from "./show-as-tireur.pipe";
import { MotifsComponent } from "./motifs/motifs.component";
import { ShowAsMotifFrPipe } from "./show-as-motif-fr.pipe";
import { ShowAsBanqueFrPipe } from "./show-as-banque-fr.pipe";
import { EntitesComponent } from "./entites/entites.component";
import { ShowAsEntiteFrPipe } from "./show-as-entite-fr.pipe";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { LoginComponent } from "./login/login.component";
import { FieldsetModule } from "primeng/fieldset";
import { BESPPComponent } from './be-spp/be-spp.component';

@NgModule({
  declarations: [
    AppComponent,
    ListChequesComponent,
    BanquesListComponent,
    TireursComponent,
    ShowAsTireurPipe,
    MotifsComponent,
    ShowAsMotifFrPipe,
    ShowAsBanqueFrPipe,
    EntitesComponent,

    ShowAsEntiteFrPipe,

    LoginComponent,

    BESPPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SpinnerModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule,
    TableModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    CalendarModule,
    CheckboxModule,
    FieldsetModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "fr-FR" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
