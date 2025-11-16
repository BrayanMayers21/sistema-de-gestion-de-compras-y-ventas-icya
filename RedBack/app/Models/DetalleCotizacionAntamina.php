<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleCotizacionAntamina extends Model
{
    protected $table = 'detalle_cotizacion_antamina';
    protected $primaryKey = 'iddetalle_cotizacion_antamina';
    public $timestamps = false;

    protected $fillable = [
        'cantidad',
        'precio_unitario',
        'sub_total',
        'marca',
        'fk_idcotizaciones_antamina',
        'fk_id_producto'
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'double',
        'sub_total' => 'double',
        'fk_idcotizaciones_antamina' => 'integer',
        'fk_id_producto' => 'integer'
    ];

    // Relación con cotizaciones_antamina
    public function cotizacion()
    {
        return $this->belongsTo(CotizacionesAntamina::class, 'fk_idcotizaciones_antamina', 'idcotizaciones_antamina');
    }

    // Relación con productos
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'fk_id_producto', 'id_producto');
    }
}
