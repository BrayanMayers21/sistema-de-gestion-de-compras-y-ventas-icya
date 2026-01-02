<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    protected $table = 'empleados';
    protected $primaryKey = 'idempleados';
    public $timestamps = false;

    protected $fillable = [
        'fecha_registro_empleado',
        'sueldo',
        'cuenta_bcp',
        'fk_idpersonas',
        'fk_idcargos_empleados',
    ];

    protected $casts = [
        'fecha_registro_empleado' => 'datetime',
        'sueldo' => 'double',
    ];

    /**
     * Relación con persona
     */
    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'fk_idpersonas', 'idpersonas');
    }

    /**
     * Relación con cargo de empleado
     */
    public function cargoEmpleado(): BelongsTo
    {
        return $this->belongsTo(CargoEmpleado::class, 'fk_idcargos_empleados', 'idcargos_empleados');
    }

    /**
     * Relación con las capacitaciones del empleado
     */
    public function capacitaciones(): HasMany
    {
        return $this->hasMany(Capacitacion::class, 'fk_idempleados', 'idempleados');
    }
}
