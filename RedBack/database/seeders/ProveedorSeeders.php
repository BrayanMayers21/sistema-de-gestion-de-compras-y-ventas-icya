<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeders extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('proveedores')->insert([

            [
                'ruc' => '-----------',
                'razon_social' => '----------------',
                'nombre_comercial' => '-------',
                'direccion' => '---------',
                'telefono' => '---------',
                'email' => '---------',
                'estado' => 'Activo'
            ],

            [
                'ruc' => '10316517833',
                'razon_social' => 'LA ECONOMICA - VILLARREAL CAJURUJU FORTUNATO',
                'nombre_comercial' => 'LA ECONOMICA',
                'direccion' => 'AV CONFRATERNIDAD INTERNACIONAL 126B URB HUARUPAMPA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '10469107669',
                'razon_social' => 'INVERSIONES LUCERO',
                'nombre_comercial' => 'INVERSIONES LUCERO',
                'direccion' => 'JR VICTOR VELEZ CUADRA 2 S/N INDEPENDENCIA HUARAZ',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20217265917',
                'razon_social' => 'BIOS INTERNACIONAL SAC',
                'nombre_comercial' => 'BIOS INTERNACIONAL',
                'direccion' => 'CALLE OCTAVIO PAZ 255 - URB LA CALERA DE LA MERCED SURQUILLO - LIMA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20491355302',
                'razon_social' => 'RAYP PINTURAS EL VELOZ S.A.C.',
                'nombre_comercial' => 'RAYP PINTURAS EL VELOZ',
                'direccion' => 'JR CANDELARIA VILLAR Mº 256 ANCASH - HUARAZ',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20517439623',
                'razon_social' => 'LAYHER PERU SAC',
                'nombre_comercial' => 'LAYHER PERU',
                'direccion' => 'AV. PORTILLO GRANDE MZA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20530648509',
                'razon_social' => 'METROPOLI EIRL',
                'nombre_comercial' => 'METROPOLI',
                'direccion' => 'AV. CONFRATERNIDAD INTERNAC OESTE 340 BARRIO CENTENARIO',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20530936121',
                'razon_social' => 'FERRETERIA MIKY EIRL',
                'nombre_comercial' => 'FERRETERIA MIKY',
                'direccion' => 'CAL. CORONGO Nº 335 URB. CENTENARIO HUARAZ',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20533805061',
                'razon_social' => 'DISTRIBUIDORA Y SERVICIOS MULTIPLES FAGRE A S.R.L.',
                'nombre_comercial' => 'DISTRIBUIDORA Y SERVICIOS MULTIPLES FAGRE',
                'direccion' => 'JR SAN CRISTOBAL Nº 341 BR CONO ALUVIONICO OESTE',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20533839712',
                'razon_social' => 'COMERCIALIZADORA Y SERVICIOS MANOLO EIRL',
                'nombre_comercial' => 'COMERCIALIZADORA Y SERVICIOS MANOLO',
                'direccion' => 'JR ACOVICHAY S/N BAR. ACOVICHAY ALTO',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20547839901',
                'razon_social' => 'CORPORACION CAF SAC',
                'nombre_comercial' => 'CORPORACION CAF',
                'direccion' => 'APV LOS SUYOS MZA. LOTE 24',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20600431758',
                'razon_social' => 'S&P CORPORACION INDUSTRIAL SAC',
                'nombre_comercial' => 'S&P CORPORACION INDUSTRIAL',
                'direccion' => 'JR BAMABAS Nº 411 INT 204 LIMA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20601507693',
                'razon_social' => 'HUASCARAN FERRETEROS',
                'nombre_comercial' => 'HUASCARAN FERRETEROS',
                'direccion' => 'AV RAYMONDI NRO 308 BAR',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20608777297',
                'razon_social' => 'SOLAR POWER PIURA SAC',
                'nombre_comercial' => 'SOLAR POWER PIURA',
                'direccion' => 'PS INTERNO URB. HOGAR POLICIAL MZA H2 LOTE 3A',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20609457113',
                'razon_social' => 'AURI HOLDING EIRL',
                'nombre_comercial' => 'AURI HOLDING',
                'direccion' => 'AV. PETIT THOUARS 1775 INT 1402',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20610575171',
                'razon_social' => 'PUNTALES Y ENCOFRADOS PERU-REC E.I.R.L.',
                'nombre_comercial' => 'PUNTALES Y ENCOFRADOS PERU-REC',
                'direccion' => 'AV MORRO SOLAR Nº 922 LIMA - SANTIAGO DE SURCO',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20612915009',
                'razon_social' => 'MULRISERVICIOS LUBFERR EIRL',
                'nombre_comercial' => 'MULRISERVICIOS LUBFERR',
                'direccion' => 'JR LLUIYAC TACAYCHIN BAR. PEDREGAL BAJO MZA. 24 LOTE. 04',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20613119478',
                'razon_social' => 'IMPORT  EXPORT JOLUMAR SAC',
                'nombre_comercial' => 'IMPORT EXPORT JOLUMAR',
                'direccion' => 'JR. PROGRESO MZA LIMA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20613356089',
                'razon_social' => 'SOCIEDAD COMERCIAL GLOBAL SAC',
                'nombre_comercial' => 'SOCIEDAD COMERCIAL GLOBAL',
                'direccion' => 'JR. HUAROCHIRI Nº 544 LIMA',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20613564137',
                'razon_social' => 'MULTISERVICIOS EGISAN EIRL',
                'nombre_comercial' => 'MULTISERVICIOS EGISAN',
                'direccion' => 'ASC. DE MORADORES UNION RIO SA MZA. D',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],
            [
                'ruc' => '20614539799',
                'razon_social' => 'GRUPO FERRETERO LARCRUZ SAC',
                'nombre_comercial' => 'GRUPO FERRETERO LARCRUZ',
                'direccion' => 'A.H. SANTA ROSA DE COLLIQUE MZA. B LOTE. 13',
                'telefono' => null,
                'email' => null,
                'estado' => 'Activo',
            ],


        ]);
    }
}
