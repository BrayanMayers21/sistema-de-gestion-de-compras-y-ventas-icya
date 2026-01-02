<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Capacitacion;
use App\Models\Empleado;
use Carbon\Carbon;

class CapacitacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener algunos empleados existentes
        $empleados = Empleado::limit(5)->get();

        if ($empleados->isEmpty()) {
            $this->command->warn('No hay empleados en la base de datos. Crea empleados primero.');
            return;
        }

        $temas = [
            'Seguridad e Higiene en el Trabajo',
            'Manejo de Materiales Peligrosos',
            'Primeros Auxilios Básicos',
            'Excel Avanzado para Gestión',
            'Liderazgo y Trabajo en Equipo',
            'Control de Calidad en Construcción',
            'Uso de Herramientas y Equipos',
            'Prevención de Riesgos Laborales',
            'Gestión de Proyectos',
            'Atención al Cliente'
        ];

        $capacitadores = [
            'Ing. Carlos Mendoza',
            'Dr. Ana García',
            'Lic. Roberto Silva',
            'Ing. María Torres',
            'Tec. Juan Pérez'
        ];

        $contador = 1;

        foreach ($empleados as $empleado) {
            // Crear 2-3 capacitaciones por empleado
            $numCapacitaciones = rand(2, 3);

            for ($i = 0; $i < $numCapacitaciones; $i++) {
                $fecha = Carbon::now()->subMonths(rand(0, 12));

                Capacitacion::create([
                    'codigo' => 'CAP-' . str_pad($contador, 5, '0', STR_PAD_LEFT),
                    'fecha_capacitacion' => $fecha,
                    'tema_capacitacion' => $temas[array_rand($temas)],
                    'capacitador' => $capacitadores[array_rand($capacitadores)],
                    'fk_idempleados' => $empleado->idempleados,
                    'observaciones' => rand(0, 1) ? 'Capacitación completada satisfactoriamente. El empleado demostró interés y participación activa.' : null
                ]);

                $contador++;
            }
        }

        $this->command->info('Capacitaciones creadas exitosamente: ' . ($contador - 1));
    }
}
