import { Component, OnInit } from "@angular/core";
import { ChequesDataService } from "../cheques-data.service";
export interface Motif {
  id?;
  motifAr?;
  motifFr?;
}

@Component({
  selector: "app-motifs",
  template: `
    <p-table
      [columns]="cols"
      [value]="motifs"
      selectionMode="single"
      [(selection)]="selectedMotif"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="15"
    >
      <ng-template pTemplate="caption">
        Liste des Motifs de refus de paiment
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
      header="Motif Details"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '500px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="Motif">
        <!--<div class="ui-g-12">
          <div class="ui-g-4">
            <label for="id">ID</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="id" [(ngModel)]="Motif.id" autofocus />
          </div>
        </div>-->
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="motifAr">Motif Ar</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="motifAr" [(ngModel)]="Motif.motifAr" />
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="motifFr">Motif Fr</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="motifFr" [(ngModel)]="Motif.motifFr" />
          </div>
        </div>
        <!--<div class="ui-g-12">
          <div class="ui-g-4">
            <label for="color">Color</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="color" [(ngModel)]="Motif.color" />
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
export class MotifsComponent implements OnInit {
  displayDialog: boolean;

  Motif: Motif = {};

  selectedMotif: Motif;

  newMotif: boolean;

  motifs: Motif[];

  cols: any[];

  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.data
      .allMotifs()
      .toPromise()
      .then((motifs: Motif[]) => (this.motifs = motifs));

    this.cols = [
      { field: "id", header: "ID" },
      { field: "motifAr", header: "MOTIF Ar" },
      { field: "motifFr", header: "MOTIF Fr" }
    ];
  }

  showDialogToAdd() {
    this.newMotif = true;
    this.Motif = {};
    this.displayDialog = true;
  }

  save() {
    let motifs = [...this.motifs];
    if (this.newMotif) motifs.push(this.Motif);
    else motifs[this.motifs.indexOf(this.selectedMotif)] = this.Motif;

    this.motifs = motifs;
    this.Motif = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.motifs.indexOf(this.selectedMotif);
    this.motifs = this.motifs.filter((val, i) => i != index);
    this.Motif = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newMotif = false;
    this.Motif = this.cloneMotif(event.data);
    this.displayDialog = true;
  }

  cloneMotif(c: Motif): Motif {
    let Motif = {};
    for (let prop in c) {
      Motif[prop] = c[prop];
    }
    return Motif;
  }
}
