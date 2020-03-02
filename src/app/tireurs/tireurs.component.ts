import { Component, OnInit } from "@angular/core";

import { SortEvent } from "primeng/api/sortevent";
import { ChequesDataService } from "../cheques-data.service";
import {
  BanquesListComponent,
  Banque
} from "../banques-list/banques-list.component";
export interface tireur {
  id?;
  tireur?;
  cin?;
  RC?;
  compte?;
  banque?;
  action?;
}

@Component({
  selector: "app-tireurs",
  template: `
    <p-table
      #dt
      [columns]="cols"
      [value]="tireurs"
      (sortFunction)="customSort($event)"
      [customSort]="true"
      selectionMode="single"
      [(selection)]="selectedTireur"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="10"
    >
      <ng-template pTemplate="caption">
        <div style="text-align: right">
          <h1 style="text-align: center">LISTE DES TIREURS</h1>
          <i class="fa fa-search" style="margin:4px 4px 0 0"></i>

          <button
            style="float: left"
            type="button"
            pButton
            icon="fa fa-plus"
            (click)="showDialogToAdd()"
            label="Ajouter une nouveau tireur"
          ></button>

          <input
            type="text"
            pInputText
            size="50"
            placeholder="Global Filter"
            (input)="dt.filterGlobal($event.target.value, 'contains')"
            style="width:auto"
          />
        </div>
      </ng-template>
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns" [pSortableColumn]="col.field">
            {{ col.header }}
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr [pSelectableRow]="rowData">
          <td *ngFor="let col of columns">
            <span [ngSwitch]="col.field">
              <span *ngSwitchCase="'regle'">
                {{ regle[rowData[col.field]] }}
              </span>
              <span *ngSwitchCase="'banque'">
                {{ rowData[col.field] | showAsBanqueFr }}
              </span>

              <span *ngSwitchDefault>
                {{ rowData[col.field] }}
              </span>
            </span>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <!------------------------------------------here is the dialogue box to add and edit tireur-->
    <p-dialog
      header="Détails du tireur"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '700px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="tireur">
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="tireur">TIREUR</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="tireur" [(ngModel)]="tireur.tireur" />
          </div>

          <div class="ui-g-4">
            <div class="ui-g-4">
              <label for="cin">CIN</label>
            </div>
            <div class="ui-g-8">
              <input pInputText id="cin" [(ngModel)]="tireur.cin" />
            </div>
          </div>
          <div class="ui-g-8">
            <div class="ui-g-7">
              <label for="RC">REGISTRE DE COMMERCE</label>
            </div>
            <div class="ui-g-5">
              <input pInputText id="RC" [(ngModel)]="tireur.RC" />
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-4">
              <label for="compte">COMPTE</label>
            </div>
            <div class="ui-g-8">
              <input
                pInputText
                id="compte"
                [(ngModel)]="tireur.compte"
                binary="true"
              />
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-4">
              <label for="banque">BANQUE</label>
            </div>
            <div class="ui-g-8">
              <!--<input pInputText id="banque" [(ngModel)]="tireur.banque" />-->

              <p-dropdown
                [options]="banques"
                [(ngModel)]="tireur.banque"
                filter="true"
              >
                <ng-template let-item pTemplate="selectedItem">
                  <span
                    style="vertical-align:middle; margin-left: .5em; text-align: left"
                    >{{ item.label }}</span
                  >
                </ng-template>
                <ng-template let-banque pTemplate="item">
                  <div
                    class="ui-helper-clearfix"
                    style="position: relative;height: 25px;"
                  >
                    <div
                      style="font-size:14px;float:left;margin-top:4px; text-align: left"
                    >
                      {{ banque.label }}
                    </div>
                  </div>
                </ng-template>
              </p-dropdown>
            </div>
          </div>
        </div>
      </div>
      <p-footer>
        <div class="ui-dialog-buttonpane ui-helper-clearfix">
          <button
            type="button"
            pButton
            icon="fa fa-close"
            (click)="delete()"
            label="Delete"
          ></button>
          <button
            type="button"
            pButton
            icon="fa fa-check"
            (click)="save()"
            label="Save"
          ></button>
        </div>
      </p-footer>
    </p-dialog>
  `,
  styles: []
})
export class TireursComponent implements OnInit {
  banques: Banque[];
  tireur: tireur = {};
  selectedTireur: tireur;
  displayDialog: boolean;
  tireurs: any;
  cols = [
    { field: "id", header: "ID" },
    { field: "tireur", header: "TIREUR" },
    { field: "cin", header: "CIN" },
    { field: "RC", header: "REGISTRE DE COMMERCE" },
    { field: "compte", header: "COMPTE" },
    { field: "banque", header: "BANQUE" }
  ];
  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.data
      .allTireurs()
      .toPromise()
      .then((x: tireur[]) => (this.tireurs = x));
    this.data
      .allBanquesLabelValue()
      .toPromise()
      .then((x: Banque[]) => {
        return (this.banques = x);
      });
  }
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === "string" && typeof value2 === "string")
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
  save() {
    console.log(this.tireur);
    if (!this.tireur.id) {
      this.tireur.action = "Insert";
      this.data
        .handleTireur(this.tireur)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allTireurs()
              .toPromise()
              .then((x: tireur[]) => (this.tireurs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
    if (this.tireur.id) {
      this.tireur.action = "Edit";
      this.data
        .handleTireur(this.tireur)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allTireurs()
              .toPromise()
              .then((x: tireur[]) => (this.tireurs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
  showDialogToAdd() {
    //this.newCheque = true;
    this.tireur = {};
    this.displayDialog = true;
  }
  onRowSelect(event) {
    // this.newBanque = false;

    this.tireur = this.cloneTireur(event.data);

    this.displayDialog = true;
  }
  cloneTireur(c: tireur): tireur {
    let tireur = {};
    for (let prop in c) {
      tireur[prop] = c[prop];
    }
    return tireur;
  }
  delete() {
    if (confirm("voulez vous supprimer ce tireur?")) {
      this.tireur.action = "Delete";
      this.data
        .handleTireur(this.tireur)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allTireurs()
              .toPromise()
              .then((x: tireur[]) => (this.tireurs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
}
