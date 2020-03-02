import { Pipe, PipeTransform } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tireur } from "./tireurs/tireurs.component";
import { environment } from "src/environments/environment";

@Pipe({
  name: "showAsTireur"
})
export class ShowAsTireurPipe implements PipeTransform {
  myUrl: string = environment.urlApi;
  tireurs: Array<any> = [];
  constructor(private http: HttpClient) {
    this.http
      .get(`${this.myUrl}/cheques/api/allTireurs.php`)
      .toPromise()
      .then(
        (x: tireur[]) => (this.tireurs = x),
        err => console.warn(err)
      );
  }
  transform(value: number): string {
    let tireur = this.tireurs.find(tireur => tireur.id == value);
    return tireur.tireur || "------------";
  }
}
