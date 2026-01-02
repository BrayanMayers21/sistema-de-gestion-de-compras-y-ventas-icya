<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class CapacitacionAsistente
 * 
 * @property int $id_asistente
 * @property int $fk_id_capacitacion
 * @property int $fk_idempleados
 * @property string|null $area
 * @property bool $asistio
 * @property string|null $observaciones_asistente
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Capacitacion $capacitacion
 * @property Empleado $empleado
 *
 * @package App\Models
 */
class CapacitacionAsistente extends Model
{
    protected $connection = 'mysql';
    protected $table = 'capacitaciones_asistentes';
    protected $primaryKey = 'id_asistente';
    public $timestamps = true;

    protected $casts = [
        'fk_id_capacitacion' => 'int',
        'fk_idempleados' => 'int',
        'asistio' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $fillable = [
        'fk_id_capacitacion',
        'fk_idempleados',
        'area',
        'asistio',
        'observaciones_asistente'
    ];

    /**
     * Relación con la capacitación
     */
    public function capacitacion(): BelongsTo
    {
        return $this->belongsTo(Capacitacion::class, 'fk_id_capacitacion', 'id_capacitacion');
    }

    /**
     * Relación con el empleado asistente
     */
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'fk_idempleados', 'idempleados');
    }

    /**
     * Accessor para obtener nombre completo del empleado
     */
    public function getNombreCompletoAttribute(): string
    {
        if ($this->empleado && $this->empleado->persona) {
            return trim($this->empleado->persona->primer_apell . ' ' .
                $this->empleado->persona->segundo_apell . ' ' .
                $this->empleado->persona->nombres);
        }
        return 'N/A';
    }

    /**
     * Accessor para obtener DNI del empleado desde la persona
     */
    public function getDniEmpleadoAttribute(): string
    {
        if ($this->empleado && $this->empleado->persona) {
            return $this->empleado->persona->dni ?? 'N/A';
        }
        return 'N/A';
    }
}
