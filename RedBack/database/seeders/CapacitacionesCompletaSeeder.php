<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Capacitacion;
use App\Models\CapacitacionAsistente;
use App\Models\Empleado;
use Carbon\Carbon;

class CapacitacionesCompletaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener empleados existentes
        $empleados = Empleado::limit(10)->get();

        if ($empleados->count() < 3) {
            $this->command->warn('No hay suficientes empleados en la base de datos. Crea al menos 3 empleados primero.');
            return;
        }

        $temas = [
            'Políticas de la Empresa e ISO45 y Alcohol y drogas',
            'Seguridad e Higiene en el Trabajo',
            'Manejo de Materiales Peligrosos',
            'Primeros Auxilios Básicos',
            'Excel Avanzado para Gestión',
            'Liderazgo y Trabajo en Equipo',
            'Control de Calidad en Construcción',
            'Uso de Herramientas y Equipos',
            'Prevención de Riesgos Laborales',
            'Gestión de Proyectos'
        ];

        $capacitadores = [
            'Graciela León Figueroa',
            'Ing. Carlos Mendoza',
            'Dr. Ana García',
            'Lic. Roberto Silva',
            'Ing. María Torres'
        ];

        $tiposActividad = ['induccion', 'capacitacion', 'entrenamiento', 'charla', 'simulacro'];

        // Crear 3 capacitaciones de ejemplo
        for ($i = 1; $i <= 3; $i++) {
            $fecha = Carbon::now()->subMonths(rand(0, 6));

            $capacitacion = Capacitacion::create([
                'codigo' => 'CAP-' . date('Y') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'razon_social' => 'Ingeniería del Concreto y Albañilería E.I.R.L',
                'ruc' => '20533984992',
                'domicilio' => 'Jr. Corongo N 335',
                'actividad_economica' => 'Ejecución de Obras Civiles',
                'num_trabajadores' => $empleados->count(),
                'tipo_actividad' => $tiposActividad[array_rand($tiposActividad)],
                'fecha_capacitacion' => $fecha,
                'tema_capacitacion' => $temas[array_rand($temas)],
                'capacitador' => $capacitadores[array_rand($capacitadores)],
                'num_horas' => rand(2, 8),
                'lugar_capacitacion' => rand(0, 1) ? 'Oficina Principal' : 'Obra',
                'fk_idempleados' => $empleados->first()->idempleados,
                'observaciones' => rand(0, 1) ? 'Capacitación completada satisfactoriamente.' : null
            ]);

            // Agregar entre 5 y 8 asistentes a cada capacitación
            $numAsistentes = rand(5, min(8, $empleados->count()));
            $empleadosSeleccionados = $empleados->random($numAsistentes);

            foreach ($empleadosSeleccionados as $empleado) {
                // Obtener el cargo del empleado para usarlo como área
                $area = 'N/A';
                if ($empleado->cargoEmpleado) {
                    $area = $empleado->cargoEmpleado->nom_cargos_empleados;
                }

                CapacitacionAsistente::create([
                    'fk_id_capacitacion' => $capacitacion->id_capacitacion,
                    'fk_idempleados' => $empleado->idempleados,
                    'area' => $area,
                    'asistio' => rand(0, 10) > 1, // 90% de probabilidad de asistir
                    'observaciones_asistente' => rand(0, 3) == 0 ? 'Observación de ejemplo' : null
                ]);
            }

            $this->command->info("Capacitación {$i} creada con {$numAsistentes} asistentes");
        }

        $this->command->info('✅ Seeders de capacitaciones completas ejecutado exitosamente');
    }
}
