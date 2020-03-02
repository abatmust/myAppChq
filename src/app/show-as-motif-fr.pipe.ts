import { Pipe, PipeTransform } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Motif } from "./motifs/motifs.component";
import { environment } from "src/environments/environment";

@Pipe({
  name: "showAsMotifFr"
})
export class ShowAsMotifFrPipe implements PipeTransform {
  myUrl: string = environment.urlApi;
  motifs: Motif[] = [];
  constructor(private http: HttpClient) {
    this.http
      .get(`${this.myUrl}/cheques/api/allMotifs.php`)
      .toPromise()
      .then(
        (x: Motif[]) => (this.motifs = x),
        err => console.warn(err)
      );
  }
  transform(value: number): string {
    let motif: Motif = this.motifs.find(motif => motif.id == value);
    return motif.motifFr || "------------";
  }
}
