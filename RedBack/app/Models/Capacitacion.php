<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Capacitacion
 * 
 * @property int $id_capacitacion
 * @property string $codigo
 * @property string|null $razon_social
 * @property string|null $ruc
 * @property string|null $domicilio
 * @property string|null $actividad_economica
 * @property int|null $num_trabajadores
 * @property string $tipo_actividad
 * @property Carbon $fecha_capacitacion
 * @property string $tema_capacitacion
 * @property string $capacitador
 * @property float|null $num_horas
 * @property string|null $lugar_capacitacion
 * @property int $fk_idempleados
 * @property string|null $observaciones
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Empleado $empleado
 *
 * @package App\Models
 */
class Capacitacion extends Model
{
    protected $connection = 'mysql';
    protected $table = 'capacitaciones';
    protected $primaryKey = 'id_capacitacion';
    public $timestamps = true;

    protected $casts = [
        'fecha_capacitacion' => 'date',
        'fk_idempleados' => 'int',
        'num_trabajadores' => 'int',
        'num_horas' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $fillable = [
        'codigo',
        'razon_social',
        'ruc',
        'domicilio',
        'actividad_economica',
        'num_trabajadores',
        'tipo_actividad',
        'fecha_capacitacion',
        'tema_capacitacion',
        'capacitador',
        'num_horas',
        'lugar_capacitacion',
        'fk_idempleados',
        'observaciones'
    ];

    /**
     * Relación con el empleado que recibe la capacitación
     */
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'fk_idempleados', 'idempleados');
    }

    /**
     * Relación con los asistentes de la capacitación
     */
    public function asistentes(): HasMany
    {
        return $this->hasMany(CapacitacionAsistente::class, 'fk_id_capacitacion', 'id_capacitacion');
    }

    /**
     * Scope para filtrar por empleado
     */
    public function scopePorEmpleado($query, $empleadoId)
    {
        return $query->where('fk_idempleados', $empleadoId);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopePorRangoFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_capacitacion', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para filtrar por capacitador
     */
    public function scopePorCapacitador($query, $capacitador)
    {
        return $query->where('capacitador', 'like', "%{$capacitador}%");
    }

    /**
     * Scope para filtrar por tema
     */
    public function scopePorTema($query, $tema)
    {
        return $query->where('tema_capacitacion', 'like', "%{$tema}%");
    }

    /**
     * Scope para ordenar por fecha más reciente
     */
    public function scopeRecientes($query)
    {
        return $query->orderBy('fecha_capacitacion', 'desc');
    }

    /**
     * Scope con relaciones cargadas
     */
    public function scopeConEmpleado($query)
    {
        return $query->with(['empleado.persona', 'empleado.cargoEmpleado']);
    }

    /**
     * Accessor para obtener el nombre completo del empleado
     */
    public function getNombreEmpleadoAttribute(): string
    {
        if ($this->empleado && $this->empleado->persona) {
            return $this->empleado->persona->nom_personas . ' ' .
                $this->empleado->persona->apellidos_personas;
        }
        return 'N/A';
    }

    /**
     * Accessor para obtener el cargo del empleado
     */
    public function getCargoEmpleadoAttribute(): string
    {
        if ($this->empleado && $this->empleado->cargoEmpleado) {
            return $this->empleado->cargoEmpleado->nom_cargos_empleados ?? 'N/A';
        }
        return 'N/A';
    }
}
