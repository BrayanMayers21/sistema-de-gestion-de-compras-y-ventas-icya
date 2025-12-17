<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CargoEmpleado extends Model
{
    protected $table = 'cargos_empleados';
    protected $primaryKey = 'idcargos_empleados';
    public $timestamps = false;

    protected $fillable = [
        'nom_cargo_empleado',
    ];

    /**
     * Relación con empleados
     */
    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'fk_idcargos_empleados', 'idcargos_empleados');
    }
}
