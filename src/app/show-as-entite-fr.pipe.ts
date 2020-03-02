import { Pipe, PipeTransform } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { entite } from "./entites/entites.component";
import { environment } from "src/environments/environment";

@Pipe({
  name: "showAsEntiteFr"
})
export class ShowAsEntiteFrPipe implements PipeTransform {
  myUrl: string = environment.urlApi;
  entites: entite[];
  constructor(private http: HttpClient) {
    this.http
      .get(`${this.myUrl}/cheques/api/allEntites.php`)
      .toPromise()
      .then(
        (x: entite[]) => (this.entites = x),
        err => console.warn(err)
      );
  }

  transform(value: number): string {
    let entite: entite = this.entites.find(entite => entite.id === value);
    return entite ? entite.entiteFr || "------------" : ".. .....";
  }
}
