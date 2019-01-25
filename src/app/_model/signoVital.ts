import { Paciente } from './paciente';

export class SignoVital{
    public idSignoVital: number;
    public paciente: Paciente ;
    public fecha: string;
    public temperatura: string;
    public pulso: string;
    public ritmoCardiaco: string;
}