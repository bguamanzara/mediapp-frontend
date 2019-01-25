import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-dialogo-signo',
  templateUrl: './dialogo-signo.component.html',
  styleUrls: ['./dialogo-signo.component.css']
})
export class DialogoSignoComponent implements OnInit {

  paciente: Paciente;

  constructor(private dialogRef: MatDialogRef<DialogoSignoComponent>, @Inject(MAT_DIALOG_DATA) public data: Paciente, private pacienteService: PacienteService) { }

  ngOnInit() {
    //this.paciente = this.data;
    this.paciente = new Paciente();
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
    this.paciente.email = this.data.email;
  }

  cancelar() {
    //this.pacienteService.confirmacion.next(false);
    this.dialogRef.close();
  }

  operar() {
    if (this.paciente != null && this.paciente.idPaciente > 0) {
      this.pacienteService.modificar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next("Se modifico");
        });
      });
    } else {
      this.pacienteService.registrar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next("Se registro");
        });
      });
    }
    this.dialogRef.close();
    //this.pacienteService.confirmacion.next(true);
  }

}
