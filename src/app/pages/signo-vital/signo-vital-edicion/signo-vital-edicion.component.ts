import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoVital } from 'src/app/_model/signoVital';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignoVitalService } from 'src/app/_service/SignoVital.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DialogoSignoComponent } from './dialogo-signo/dialogo-signo.component';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {

  id: number;
  edicion: boolean = false;

  form: FormGroup;
  pacienteSeleccionado: Paciente;
  myControlPaciente: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  pacientes: Paciente[] = [];
  signoVital: SignoVital;

  constructor(private dialog: MatDialog, public snackBar: MatSnackBar, private builder: FormBuilder, private pacienteService: PacienteService, private route: ActivatedRoute, private router: Router,private signoVitalService: SignoVitalService) { }

  ngOnInit() {
    this.form = this.builder.group({
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoCardiaco': new FormControl('')
    });
    this.signoVital = new SignoVital();
    this.listarPacientes();

    
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      this.initForm();
    });

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));

  }

  initForm() {
    if (this.edicion) {
      //cargar la data del servicio hacia el form 
      this.signoVitalService.listarSignoVitalPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignoVital),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'pulso': new FormControl(data.pulso),
          'temperatura': new FormControl(data.temperatura),
          'ritmoCardiaco': new FormControl(data.ritmoCardiaco)
        });
      });
    }
  }

  openDialog() {
    let pac = new Paciente();
    this.dialog.open(DialogoSignoComponent, {
      width: '250px',
      disableClose: false,
      data: pac
    });
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  seleccionarPaciente(e: any) {
    //console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar() {
    this.signoVital.idSignoVital = this.form.value['id'];
    this.signoVital.paciente = this.form.value['paciente'];
    this.signoVital.fecha = this.form.value['fecha'];
    this.signoVital.pulso = this.form.value['pulso'];
    this.signoVital.temperatura = this.form.value['temperatura'];
    this.signoVital.ritmoCardiaco = this.form.value['ritmoCardiaco'];

    if (this.edicion) {
      //actualizar
      this.signoVitalService.modificar(this.signoVital).subscribe(data => {
        this.signoVitalService.listar().subscribe(pacientes => {
          this.signoVitalService.signoVitalCambio.next(pacientes);
          this.signoVitalService.mensajeCambio.next('Se modificó');
        });
      });
    } else {
      //registrar
      this.signoVitalService.registrar(this.signoVital).subscribe(data => {
        this.signoVitalService.listar().subscribe(pacientes => {
          this.signoVitalService.signoVitalCambio.next(pacientes);
          this.signoVitalService.mensajeCambio.next('Se registró');
        });
      });
    }

    this.router.navigate(['signo-vital']);
  }

  aceptar() {
    this.signoVital = new SignoVital();
    this.signoVital.paciente = this.form.value['paciente'];//this.pacienteSeleccionado;
    var tzoffset = (this.form.value['fecha']).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
    this.signoVital.fecha = localISOTime;
    this.signoVital.pulso = this.form.value['pulso'];
    this.signoVital.temperatura = this.form.value['temperatura'];
    this.signoVital.ritmoCardiaco = this.form.value['ritmoCardiaco'];

    if (this.edicion) {
      //actualizar
      this.signoVitalService.modificar(this.signoVital).subscribe(data => {
        this.signoVitalService.listar().subscribe(pacientes => {
          this.signoVitalService.signoVitalCambio.next(pacientes);
          this.signoVitalService.mensajeCambio.next('Se modificó');
        });
      });
    } else {
      //registrar
      this.signoVitalService.registrar(this.signoVital).subscribe(data => {
        this.signoVitalService.listar().subscribe(pacientes => {
          this.signoVitalService.signoVitalCambio.next(pacientes);
          this.signoVitalService.mensajeCambio.next('Se registró');
        });
      });
    }
    this.router.navigate(['signo-vital']);
  }

}
