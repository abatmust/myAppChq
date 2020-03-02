import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { AuthenticationService } from "./authentication.service";
import { Router, RouterStateSnapshot } from "@angular/router";
@Component({
  selector: "app-root",
  template: `
    <div id="mb" *ngIf="AuthenticationService.currentUserValue">
      <p-menubar [model]="items">
        <!--<div>
          <input type="text" pInputText placeholder="Search" />
          <button
            pButton
            label="Logout"
            icon="fa fa-sign-out"
            style="margin-left:.25em"
          ></button>
        </div>-->
        <span
          style="margin-left:.25em; background-color: red; padding: 7px; border-radius: 5px;"
          ><i class="pi pi-user" style="line-height: 1.25;"></i> :
          {{ AuthenticationService.currentUserValue.username }}
        </span>
        <button
          pButton
          label="Logout"
          icon="fa fa-sign-out"
          style="margin-left:.25em"
          (click)="logout()"
        ></button>
      </p-menubar>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      #mb {
        position: sticky;
        top: 0;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  isAdmin: boolean = false;
  title = "cheques";

  items: MenuItem[];
  constructor(
    public AuthenticationService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit() {
    this.isAdmin;
    this.items = [
      { label: "ACCUEIL", icon: "pi pi-fw pi-file", routerLink: "/" },
      { label: "CHEQUES", icon: "pi pi-fw pi-file", routerLink: "cheques" },
      { label: "BANQUES", icon: "pi pi-fw pi-file", routerLink: "banques" },
      { label: "TIREURS", icon: "pi pi-fw pi-file", routerLink: "tireurs" },
      { label: "MOTIFS", icon: "pi pi-fw pi-file", routerLink: "motifs" },
      { label: "ENTITES", icon: "pi pi-fw pi-file", routerLink: "entites" },
      { label: "Bor.Env-SPP", icon: "pi pi-fw pi-file", routerLink: "be-spp" }
    ];
  }
  logout() {
    this.AuthenticationService.logout();
    this.router.navigate(["/"]);
  }
}
