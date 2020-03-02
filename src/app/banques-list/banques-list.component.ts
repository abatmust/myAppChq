import { Component, OnInit } from "@angular/core";
import { ChequesDataService } from "../cheques-data.service";
import { SortEvent } from "primeng/api/sortevent";

export interface Banque {
  id?;
  bqAr?;
  bqFr?;
}

@Component({
  selector: "app-banques-list",
  template: `
    <p-table
      [columns]="cols"
      [value]="Banques"
      selectionMode="single"
      [(selection)]="selectedBanque"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="15"
    >
      <ng-template pTemplate="caption">
        Liste des Banques
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
            label="Ajouter une nouvelle banque"
          ></button>
        </div>
      </ng-template>
    </p-table>

    <p-dialog
      header="Banque Details"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '500px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="Banque">
        <!--<div class="ui-g-12">
          <div class="ui-g-4">
            <label for="vin">ID</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="vin" [(ngModel)]="Banque.id" autofocus />
          </div>
        </div>-->
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="bqFr">Banque Fr</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="bqFr" [(ngModel)]="Banque.bqFr" />
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="bqAr">Banque Ar</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="bqAr" [(ngModel)]="Banque.bqAr" />
          </div>
        </div>
      </div>
      <div class="ui-g-12" class="spinner">
        <p-progressSpinner
          *ngIf="spinnerOn"
          [style]="{ width: '70px', height: '70px', margin: auto }"
          strokeWidth="8"
          fill="#EEEEEE"
          animationDuration=".5s"
        ></p-progressSpinner>
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
  styles: [
    `
      .spinner {
        text-align: center;
      }
    `
  ]
})
export class BanquesListComponent implements OnInit {
  spinnerOn: boolean = false;
  displayDialog: boolean;

  Banque: Banque = {};

  selectedBanque: Banque;

  newBanque: boolean;

  Banques: Banque[];

  cols: any[];

  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.getAllBanques();

    this.cols = [
      { field: "id", header: "ID" },
      { field: "bqFr", header: "BANQUE Fr" },
      { field: "bqAr", header: "BANQUE Ar" }
    ];
  }
  getAllBanques() {
    this.data
      .allBanques()
      .toPromise()
      .then((Banques: Banque[]) => (this.Banques = Banques));
  }

  showDialogToAdd() {
    this.newBanque = true;
    this.Banque = {};
    this.displayDialog = true;
  }

  save() {
    let Banques = [...this.Banques];
    this.spinnerOn = true;
    // if (this.newBanque) Banques.push(this.Banque);
    // else Banques[this.Banques.indexOf(this.selectedBanque)] = this.Banque;

    if (confirm("êtes vous sure?")) {
      if (this.Banque && this.Banque.id) {
        this.data
          .updateBanque(this.Banque)
          .toPromise()
          .then((res: { message: string }) => {
            //alert(res.message);

            this.getAllBanques();
            setTimeout(() => {
              this.spinnerOn = false;
            }, 700);
            setTimeout(() => {
              this.displayDialog = false;
            }, 700);
          });
      } else {
        this.data
          .addBanque(this.Banque)
          .toPromise()
          .then((res: { message: string }) => {
            alert(res.message);
            this.getAllBanques();
          });
      }
    }

    this.Banques = Banques;
    this.Banque = null;
  }

  delete() {
    let index = this.Banques.indexOf(this.selectedBanque);
    this.Banques = this.Banques.filter((val, i) => i != index);
    this.Banque = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newBanque = false;
    this.Banque = this.cloneBanque(event.data);
    this.displayDialog = true;
  }

  cloneBanque(c: Banque): Banque {
    let Banque = {};
    for (let prop in c) {
      Banque[prop] = c[prop];
    }
    return Banque;
  }
}
