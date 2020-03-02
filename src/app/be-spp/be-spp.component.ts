import { Component, OnInit } from "@angular/core";

import { SortEvent } from "primeng/api/sortevent";
import { ChequesDataService } from "../cheques-data.service";
import {
  BanquesListComponent,
  Banque
} from "../banques-list/banques-list.component";
export interface BEnv {
  id?;
  numSPP?;
  dateSPP?;
  action?;
}

@Component({
  selector: "app-BEnvs",
  template: `
    <p-table
      #dt
      [columns]="cols"
      [value]="BEnvs"
      (sortFunction)="customSort($event)"
      [customSort]="true"
      selectionMode="single"
      [(selection)]="selectedBEnv"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="10"
    >
      <ng-template pTemplate="caption">
        <div style="text-align: right">
          <h1 style="text-align: center">LISTE DES BOR. ENVOIS SPP</h1>
          <i class="fa fa-search" style="margin:4px 4px 0 0"></i>

          <button
            style="float: left"
            type="button"
            pButton
            icon="fa fa-plus"
            (click)="showDialogToAdd()"
            label="Ajouter une nouveau BEnv"
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
    <!------------------------------------------here is the dialogue box to add and edit BEnv-->
    <p-dialog
      header="Détails du BEnv"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '700px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="BEnv">
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="numSPP">NUM SPP</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="BEnv" [(ngModel)]="BEnv.numSPP" />
          </div>

          <div class="ui-g-12">
            <div class="ui-g-4">
              <label for="dateSPP">dateSPP</label>
            </div>
            <div class="ui-g-8">
              <input pInputText id="dateSPP" [(ngModel)]="BEnv.dateSPP" />
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
export class BESPPComponent implements OnInit {
  banques: Banque[];
  BEnv: BEnv = {};
  selectedBEnv: BEnv;
  displayDialog: boolean;
  BEnvs: any;
  cols = [
    { field: "id", header: "ID" },
    { field: "numSPP", header: "NUM SPP" },
    { field: "dateSPP", header: "DATE SPP" }
  ];
  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.data
      .allBEnvs()
      .toPromise()
      .then((x: BEnv[]) => (this.BEnvs = x));
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
    console.log(this.BEnv);
    if (!this.BEnv.id) {
      this.BEnv.action = "Insert";
      this.data
        .handleBEnv(this.BEnv)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allBEnvs()
              .toPromise()
              .then((x: BEnv[]) => (this.BEnvs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
    if (this.BEnv.id) {
      this.BEnv.action = "Edit";
      this.data
        .handleBEnv(this.BEnv)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allBEnvs()
              .toPromise()
              .then((x: BEnv[]) => (this.BEnvs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
  showDialogToAdd() {
    //this.newCheque = true;
    this.BEnv = {};
    this.displayDialog = true;
  }
  onRowSelect(event) {
    // this.newBanque = false;

    this.BEnv = this.cloneBEnv(event.data);

    this.displayDialog = true;
  }
  cloneBEnv(c: BEnv): BEnv {
    let BEnv = {};
    for (let prop in c) {
      BEnv[prop] = c[prop];
    }
    return BEnv;
  }
  delete() {
    if (confirm("voulez vous supprimer ce BEnv?")) {
      this.BEnv.action = "Delete";
      this.data
        .handleBEnv(this.BEnv)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allBEnvs()
              .toPromise()
              .then((x: BEnv[]) => (this.BEnvs = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
}
