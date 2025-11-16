<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotizacionesAntamina extends Model
{
    protected $table = 'cotizaciones_antamina';
    protected $primaryKey = 'idcotizaciones_antamina';
    public $timestamps = false;

    protected $fillable = [
        'fecha_cot',
        'numero_cot',
        'cliente',
        'descripcion',
        'costo_total'
    ];

    protected $casts = [
        'fecha_cot' => 'date',
        'costo_total' => 'double'
    ];

    // Relación con detalles de cotización
    public function detalles()
    {
        return $this->hasMany(DetalleCotizacionAntamina::class, 'fk_idcotizaciones_antamina', 'idcotizaciones_antamina');
    }
}
