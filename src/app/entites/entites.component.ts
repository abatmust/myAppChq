import { Component, OnInit } from "@angular/core";
import { ChequesDataService } from "../cheques-data.service";
export interface entite {
  id?;
  entiteAr?;
  entiteFr?;
}
@Component({
  selector: "app-entites",
  template: `
    <p-table
      [columns]="cols"
      [value]="entites"
      selectionMode="single"
      [(selection)]="selectedentite"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="15"
    >
      <ng-template pTemplate="caption">
        Liste des entites de la régie
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
            {{ rowData[col.field] }}
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="summary" let-rowData>
        <div style="text-align:left">
          <button
            type="button"
            pButton
            icon="fa fa-plus"
            (click)="showDialogToAdd()"
            label="Add"
          ></button>
        </div>
      </ng-template>
    </p-table>

    <p-dialog
      header="entite Details"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '500px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="entite">
        <!--<div class="ui-g-12">
      <div class="ui-g-4">
        <label for="id">ID</label>
      </div>
      <div class="ui-g-8">
        <input pInputText id="id" [(ngModel)]="entite.id" autofocus />
      </div>
    </div>-->
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="entiteAr">entite Ar</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="entiteAr" [(ngModel)]="entite.entiteAr" />
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="entiteFr">entite Fr</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="entiteFr" [(ngModel)]="entite.entiteFr" />
          </div>
        </div>
        <!--<div class="ui-g-12">
      <div class="ui-g-4">
        <label for="color">Color</label>
      </div>
      <div class="ui-g-8">
        <input pInputText id="color" [(ngModel)]="entite.color" />
      </div>
    </div>-->
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
export class EntitesComponent implements OnInit {
  displayDialog: boolean;

  entite: entite = {};

  selectedentite: entite;

  newentite: boolean;

  entites: entite[];

  cols: any[];

  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.data
      .allEntites()
      .toPromise()
      .then((entites: entite[]) => (this.entites = entites));

    this.cols = [
      { field: "id", header: "ID" },
      { field: "entiteAr", header: "entite Ar" },
      { field: "entiteFr", header: "entite Fr" }
    ];
  }

  showDialogToAdd() {
    this.newentite = true;
    this.entite = {};
    this.displayDialog = true;
  }

  save() {
    let entites = [...this.entites];
    if (this.newentite) entites.push(this.entite);
    else entites[this.entites.indexOf(this.selectedentite)] = this.entite;

    this.entites = entites;
    this.entite = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.entites.indexOf(this.selectedentite);
    this.entites = this.entites.filter((val, i) => i != index);
    this.entite = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newentite = false;
    this.entite = this.cloneentite(event.data);
    this.displayDialog = true;
  }

  cloneentite(c: entite): entite {
    let entite = {};
    for (let prop in c) {
      entite[prop] = c[prop];
    }
    return entite;
  }
}
