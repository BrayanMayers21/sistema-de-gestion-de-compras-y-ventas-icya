<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AsistenciaEmpleado extends Model
{
    protected $table = 'asistencias_empleados';
    protected $primaryKey = 'idasistencias_empleados';
    public $timestamps = false;

    protected $fillable = [
        'fecha_asistio',
        'estado',
        'observacion',
        'fk_idempleados'
    ];

    protected $casts = [
        'fecha_asistio' => 'date',
    ];

    /**
     * Relación con el modelo Empleado
     */
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'fk_idempleados', 'idempleados');
    }
}
