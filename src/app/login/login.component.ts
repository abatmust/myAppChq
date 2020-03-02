import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { User } from "../user";

@Component({
  selector: "app-login",
  template: `
    <p-fieldset legend="LOGIN" class="ui-g myLoginContainer">
      <!--<div class="ui-g ui-fluid">
        <div class="ui-g-12 ui-md-4">-->
      <div class="ui-inputgroup ui-g-12">
        <span class="ui-inputgroup-addon"
          ><i class="pi pi-user" style="line-height: 1.25;"></i
        ></span>
        <input
          type="text"
          pInputText
          placeholder="Username"
          [(ngModel)]="user.username"
        />
      </div>
      <div class="ui-inputgroup ui-g-12">
        <span class="ui-inputgroup-addon"
          ><i class="pi pi-lock" style="line-height: 1.25;"></i
        ></span>
        <input
          type="password"
          pInputText
          placeholder="Password"
          [(ngModel)]="user.password"
        />
      </div>
      <div class="ui-inputgroup ui-g-12">
        <button
          pButton
          type="button"
          label="login"
          class="ui-button-raised"
          (click)="login()"
        ></button>
      </div>

      <!-- </div>
      </div>-->
    </p-fieldset>
  `,
  styles: [
    `
      .myLoginContainer {
        width: 40%;
        margin: 100px auto;
      }
      input {
        width: 100%;
      }
      button {
        width: 30%;
        margin: auto;
      }
    `
  ]
})
export class LoginComponent implements OnInit {
  user: User = {};
  returnUrl: string;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/cheques";
  }
  login() {
    //console.log(this.user);
    this.authenticationService
      .login(this.user.username, this.user.password)
      .pipe(first())
      .subscribe(
        data => {
          //console.log(data);

          this.router.navigate([this.returnUrl]);
        },
        error => {
          //this.error = error;
          //this.loading = false;
        }
      );
  }
}
