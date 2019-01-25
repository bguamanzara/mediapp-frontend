import { Component, OnInit, ViewChild } from '@angular/core';
import { SignoVital } from 'src/app/_model/signoVital';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SignoVitalService } from 'src/app/_service/SignoVital.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<SignoVital>;
  displayedColumns = ['idSignoVital', 'fecha', 'temperatura', 'pulso', 'ritmoCardiaco', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(private signoVitalService: SignoVitalService, private snackBar: MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {
    this.signoVitalService.signoVitalCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signoVitalService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signoVitalService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(idSignoVital: number) {
    this.signoVitalService.eliminar(idSignoVital).subscribe(data => {
      this.signoVitalService.listar().subscribe(data => {
        this.signoVitalService.signoVitalCambio.next(data);
        this.signoVitalService.mensajeCambio.next('Se eliminó');
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
