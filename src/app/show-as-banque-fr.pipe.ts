import { Pipe, PipeTransform } from "@angular/core";
import { Banque as banque } from "./banques-list/banques-list.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Pipe({
  name: "showAsBanqueFr"
})
export class ShowAsBanqueFrPipe implements PipeTransform {
  myUrl: string = environment.urlApi;
  banques: banque[] = [];
  constructor(private http: HttpClient) {
    this.http
      .get(`${this.myUrl}/cheques/api/allBanques.php`)
      .toPromise()
      .then(
        (x: banque[]) => (this.banques = x),
        err => console.warn(err)
      );
  }
  transform(value: number): string {
    let banque: banque = this.banques.find(banque => banque.id == value);
    return banque.bqFr || "------------";
  }
}
