import { Component, OnInit } from "@angular/core";
import { ChequesDataService } from "../cheques-data.service";
import { SortEvent } from "primeng/api/sortevent";
import { SelectItem } from "primeng/api/selectitem";
import { tireur } from "../tireurs/tireurs.component";
import { Motif } from "../motifs/motifs.component";
import { entite } from "../entites/entites.component";
import * as moment from "moment";

export enum regle {
  "Réglé" = 1,
  "Non réglé" = 0
}
export interface cheque {
  id?;
  numero?;
  dateEmission?;
  dateRejet?;
  regle?;
  montant?;
  tireur?;
  motif?;
  entite?;
  action?;
}
@Component({
  selector: "app-list-cheques",
  template: `
    <p-table
      #dt
      [columns]="cols"
      [value]="cheques"
      (sortFunction)="customSort($event)"
      [customSort]="true"
      selectionMode="single"
      [(selection)]="selectedCheque"
      (onRowSelect)="onRowSelect($event)"
      [paginator]="true"
      [rows]="10"
    >
      <ng-template pTemplate="caption">
        <div style="text-align: right">
          <h1 style="text-align: center">LISTE DES CHEQUES</h1>
          <i class="fa fa-search" style="margin:4px 4px 0 0"></i>

          <button
            style="float: left"
            type="button"
            pButton
            icon="fa fa-plus"
            (click)="showDialogToAdd()"
            label="Ajouter une nouveau chèque"
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
          <th
            *ngFor="let col of columns"
            [pSortableColumn]="col.field"
            [ngSwitch]="col.field"
          >
            {{ col.header }}
            <p-multiSelect
              *ngSwitchCase="'tireur'"
              [options]="tireurs"
              defaultLabel="Tous les tireurs"
              (onChange)="dt.filter($event.value, col.field, 'in')"
            ></p-multiSelect>
            <p-multiSelect
              *ngSwitchCase="'motif'"
              [options]="motifs"
              defaultLabel="Tous les motifs"
              (onChange)="dt.filter($event.value, col.field, 'in')"
            ></p-multiSelect>
            <p-multiSelect
              *ngSwitchCase="'entite'"
              [options]="entites"
              defaultLabel="Toutes les entités"
              (onChange)="dt.filter($event.value, col.field, 'in')"
            ></p-multiSelect>
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
        </tr>
        <!--<tr>
          <th>
            ID
            <p-sortIcon [field]="'id'"></p-sortIcon>
          </th>
          <th>NUMERO <p-sortIcon [field]="'numero'"></p-sortIcon></th>
          <th>
            DATE EMISSION <p-sortIcon [field]="'dateEmission'"></p-sortIcon>
          </th>
          <th>DATE REJET <p-sortIcon [field]="'dateRejet'"></p-sortIcon></th>
          <th>REGLE <p-sortIcon [field]="'regle'"></p-sortIcon></th>
          <th>MONTANT <p-sortIcon [field]="'montant'"></p-sortIcon></th>
          <th>TIREUR <p-sortIcon [field]="'tireur'"></p-sortIcon></th>
          <th>MOTIF <p-sortIcon [field]="'motif'"></p-sortIcon></th>
          <th>ENTITE <p-sortIcon [field]="'entite'"></p-sortIcon></th>
        </tr>-->
      </ng-template>
      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr [pSelectableRow]="rowData">
          <td *ngFor="let col of columns">
            <span [ngSwitch]="col.field">
              <span *ngSwitchCase="'regle'">
                {{ regle[rowData[col.field]] }}
              </span>
              <span *ngSwitchCase="'tireur'">
                {{ rowData[col.field] | showAsTireur }}
              </span>

              <span *ngSwitchCase="'motif'">
                {{ rowData[col.field] | showAsMotifFr }}
              </span>
              <span *ngSwitchCase="'entite'">
                {{ rowData[col.field] | showAsEntiteFr }}
              </span>

              <span *ngSwitchDefault>
                {{ rowData[col.field] }}
              </span>
            </span>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog
      header="cheque Details"
      [(visible)]="displayDialog"
      [focusOnShow]="false"
      [responsive]="true"
      showEffect="fade"
      [modal]="true"
      [style]="{ width: '700px' }"
    >
      <div class="ui-g ui-fluid" *ngIf="cheque">
        <!--<div class="ui-g-4">
          <div class="ui-g-4">
            <label for="id">ID</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="id" [(ngModel)]="cheque.id" autofocus />
          </div>
        </div>-->
        <div class="ui-g-8">
          <div class="ui-g-4">
            <label for="numero">NUMERO</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="numero" [(ngModel)]="cheque.numero" />
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="dateEmission">DATE D'EMISSION</label>
          </div>
          <div class="ui-g-8">
            <!--<input
              pInputText
              id="dateEmission"
              [(ngModel)]="cheque.dateEmission"
            />-->

            <p-calendar
              id="dateEmission"
              [(ngModel)]="cheque.dateEmission"
              [locale]="fr"
              dateFormat="dd/mm/yy"
            ></p-calendar>
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="dateRejet">DATE DE REJET</label>
          </div>
          <div class="ui-g-8">
            <!--<input pInputText id="dateRejet" [(ngModel)]="cheque.dateRejet" />-->
            <p-calendar
              id="dateRejet"
              [(ngModel)]="cheque.dateRejet"
              [locale]="fr"
              dateFormat="dd/mm/yy"
            ></p-calendar>
          </div>
        </div>
        <div class="ui-g-4">
          <div class="ui-g-4">
            <label for="regle">REGLE</label>
          </div>
          <div class="ui-g-8">
            <!--<input
              pInputText
              id="regle"
              [(ngModel)]="cheque.regle"
              binary="true"
            />-->
            <p-checkbox
              [(ngModel)]="regleChecked"
              binary="true"
              (onChange)="updateRegle($event)"
            ></p-checkbox>
          </div>
        </div>
        <div class="ui-g-8">
          <div class="ui-g-4">
            <label for="montant">MONTANT</label>
          </div>
          <div class="ui-g-8">
            <input pInputText id="montant" [(ngModel)]="cheque.montant" />
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="tireur">TIREUR</label>
          </div>
          <div class="ui-g-8">
            <!--<input pInputText id="tireur" [(ngModel)]="cheque.tireur" />-->

            <p-dropdown
              [options]="tireurs"
              [(ngModel)]="cheque.tireur"
              filter="true"
            >
              <ng-template let-item pTemplate="selectedItem">
                <!--<img src="assets/showcase/images/demo/car/{{item.label}}.png" style="width:16px;vertical-align:middle" />-->
                <span
                  style="vertical-align:middle; margin-left: .5em; text-align: left"
                  >{{ item.label }}</span
                >
              </ng-template>
              <ng-template let-cheque pTemplate="item">
                <div
                  class="ui-helper-clearfix"
                  style="position: relative;height: 25px;"
                >
                  <!--<img src="assets/showcase/images/demo/car/{{car.label}}.png" style="width:24px;position:absolute;top:1px;left:5px"/>-->
                  <div
                    style="font-size:14px;float:left;margin-top:4px; text-align: left"
                  >
                    {{ cheque.label }}
                  </div>
                </div>
              </ng-template>
            </p-dropdown>
            <!-- <p-dropdown
              [options]="tireurs"
              [(ngModel)]="cheque.tireur"
              editable="true"
              placeholder="Selectionner le tireur"
            ></p-dropdown>-->
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="motif">MOTIF</label>
          </div>
          <div class="ui-g-8">
            <!--<input pInputText id="motif" [(ngModel)]="cheque.motif" />-->
            <p-dropdown
              [options]="motifs"
              [(ngModel)]="cheque.motif"
              filter="true"
            ></p-dropdown>
          </div>
        </div>
        <div class="ui-g-12">
          <div class="ui-g-4">
            <label for="entite">ENTITE</label>
          </div>
          <div class="ui-g-8">
            <!--<input pInputText id="entite" [(ngModel)]="cheque.entite" />-->
            <p-dropdown
              [options]="entites"
              [(ngModel)]="cheque.entite"
              filter="true"
            ></p-dropdown>
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
  styles: [``]
})
export class ListChequesComponent implements OnInit {
  regleChecked: boolean = false;
  fr: any;
  selectedCheque: cheque;
  cheque: cheque = {};
  displayDialog: boolean;
  regle = regle;
  cheques: cheque[];
  motifs: Motif[] = [];
  entites: entite[] = [];
  tireurs: tireur[];
  cols = [
    { field: "id", header: "ID" },
    { field: "numero", header: "NUMERO" },
    { field: "dateEmission", header: "DATE EMISSION" },
    { field: "dateRejet", header: "DATE REJET" },
    { field: "regle", header: "REGLE" },
    { field: "montant", header: "MONTANT" },
    { field: "tireur", header: "TIREUR" },
    { field: "motif", header: "MOTIF" },
    { field: "entite", header: "ENTITE" }
  ];
  constructor(private data: ChequesDataService) {}

  ngOnInit() {
    this.fr = {
      firstDayOfWeek: 1,
      dayNames: [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
      ],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      monthNames: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre"
      ],
      monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      today: "Today",
      clear: "Clear",
      dateFormat: "dd/mm/yy",
      weekHeader: "Wk"
    };

    this.data
      .allEntitesLabelValue()
      .toPromise()
      .then((x: entite[]) => (this.entites = x));
    this.data
      .allTireursLabelValue()
      .toPromise()
      .then((x: tireur[]) => (this.tireurs = x));
    this.data
      .allMotifsLabelValue()
      .toPromise()
      .then((x: Motif[]) => (this.motifs = x));
    this.data
      .allCheques()
      .toPromise()
      .then((x: cheque[]) => (this.cheques = x));
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
  onRowSelect(event) {
    // this.newBanque = false;

    this.cheque = this.cloneCheque(event.data);
    this.cheque.dateEmission = new Date(this.cheque.dateEmission);
    this.cheque.dateRejet = new Date(this.cheque.dateRejet);
    this.cheque.regle == 1
      ? (this.regleChecked = true)
      : (this.regleChecked = false);
    this.displayDialog = true;
  }
  cloneCheque(c: cheque): cheque {
    let cheque = {};
    for (let prop in c) {
      cheque[prop] = c[prop];
    }
    return cheque;
  }
  showDialogToAdd() {
    //this.newCheque = true;
    this.cheque = {};
    this.displayDialog = true;
  }
  save() {
    //console.log("avant", this.cheque);

    this.cheque.dateEmission = this.convertDate(this.cheque.dateEmission);
    this.cheque.dateRejet = this.convertDate(this.cheque.dateRejet);
    if (!this.cheque.id) {
      this.cheque.action = "Insert";
      this.data
        .handleCheque(this.cheque)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allCheques()
              .toPromise()
              .then((x: cheque[]) => (this.cheques = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
    if (this.cheque.id) {
      this.cheque.action = "Edit";
      this.data
        .handleCheque(this.cheque)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allCheques()
              .toPromise()
              .then((x: cheque[]) => (this.cheques = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
  convertDate(jsDate: Date) {
    return moment(jsDate).format("YYYY-MM-DD");
  }
  updateRegle(event) {
    event ? (this.cheque.regle = "1") : (this.cheque.regle = "0");
  }
  delete() {
    if (confirm("voulez vous supprimer ce chèque?")) {
      this.cheque.action = "Delete";
      this.data
        .handleCheque(this.cheque)
        .toPromise()
        .then(
          (res: { message: string }) => {
            this.data
              .allCheques()
              .toPromise()
              .then((x: cheque[]) => (this.cheques = x));
            alert(res.message);
            this.displayDialog = false;
          },
          err => console.error(err)
        );
    }
  }
}
