import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ChequesDataService {
  myUrl: string = `${environment.urlApi}`;
  constructor(private http: HttpClient) {}
  public allCheques() {
    return this.http.get(`${this.myUrl}/cheques/api/allCheques.php`);
  }
  public allBanques() {
    return this.http.get(`${this.myUrl}/cheques/api/allBanques.php`);
  }
  public updateBanque(data) {
    return this.http.post(`${this.myUrl}/cheques/api/updateBanque.php`, data);
  }
  public addBanque(data) {
    return this.http.post(`${this.myUrl}/cheques/api/addBanque.php`, data);
  }
  public allTireurs() {
    return this.http.get(`${this.myUrl}/cheques/api/allTireurs.php`);
  }
  public allMotifs() {
    return this.http.get(`${this.myUrl}/cheques/api/allMotifs.php`);
  }

  public allEntites() {
    return this.http.get(`${this.myUrl}/cheques/api/allentites.php`);
  }
  public allTireursLabelValue() {
    return this.http.get(`${this.myUrl}/cheques/api/allTireursLabelValue.php`);
  }
  public allMotifsLabelValue() {
    return this.http.get(`${this.myUrl}/cheques/api/allMotifsLabelValue.php`);
  }
  public allEntitesLabelValue() {
    return this.http.get(`${this.myUrl}/cheques/api/allEntitesLabelValue.php`);
  }
  public allBanquesLabelValue() {
    return this.http.get(`${this.myUrl}/cheques/api/allBanquesLabelValue.php`);
  }
  public handleCheque(data) {
    return this.http.post(`${this.myUrl}/cheques/api/handleCheque.php`, data);
  }
  public handleTireur(data) {
    return this.http.post(`${this.myUrl}/cheques/api/handleTireur.php`, data);
  }
  public allBEnvs() {
    return this.http.get(`${this.myUrl}/cheques/api/allBEnv.php`);
  }
  public handleBEnv(data) {
    return this.http.post(`${this.myUrl}/cheques/api/handleBEnv.php`, data);
  }
}
