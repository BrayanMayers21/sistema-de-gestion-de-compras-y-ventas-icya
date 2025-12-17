<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DescuentoAsistencia extends Model
{
    protected $table = 'descuentos_asistencias';
    protected $primaryKey = 'iddescuentos_asistencias';
    public $timestamps = false;

    protected $fillable = [
        'mes',
        'anio',
        'dias_trabajados',
        'dias_faltados',
        'dias_justificados',
        'dias_laborables',
        'sueldo_base',
        'monto_descuento',
        'sueldo_final',
        'fecha_calculo',
        'observaciones',
        'fk_idempleados'
    ];

    protected $casts = [
        'mes' => 'integer',
        'anio' => 'integer',
        'dias_trabajados' => 'integer',
        'dias_faltados' => 'integer',
        'dias_justificados' => 'integer',
        'dias_laborables' => 'integer',
        'sueldo_base' => 'decimal:2',
        'monto_descuento' => 'decimal:2',
        'sueldo_final' => 'decimal:2',
        'fecha_calculo' => 'date',
    ];

    /**
     * Relación con el modelo Empleado
     */
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'fk_idempleados', 'idempleados');
    }
}
