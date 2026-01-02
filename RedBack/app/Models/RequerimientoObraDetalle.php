<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RequerimientoObraDetalle
 * 
 * @property int $id_detalle
 * @property int $fk_id_requerimiento_obra
 * @property int $fk_id_producto
 * @property float $cantidad
 * @property string|null $marca
 * @property string|null $color
 * @property string|null $tipo
 * @property string|null $calidad
 * @property string|null $medida
 * @property string|null $observaciones
 * @property string $estado
 * @property float|null $cantidad_entregada
 * @property Carbon|null $fecha_entrega
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property RequerimientoObra $requerimiento_obra
 * @property Producto $producto
 *
 * @package App\Models
 */
class RequerimientoObraDetalle extends Model
{
    protected $connection = 'mysql';
    protected $table = 'requerimientos_obra_detalle';
    protected $primaryKey = 'id_detalle';
    public $timestamps = true;

    protected $casts = [
        'fk_id_requerimiento_obra' => 'int',
        'fk_id_producto' => 'int',
        'cantidad' => 'decimal:2',
        'cantidad_entregada' => 'decimal:2',
        'fecha_entrega' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $fillable = [
        'fk_id_requerimiento_obra',
        'fk_id_producto',
        'cantidad',
        'marca',
        'color',
        'tipo',
        'calidad',
        'medida',
        'observaciones',
        'estado',
        'cantidad_entregada',
        'fecha_entrega'
    ];

    /**
     * Relación con el requerimiento principal
     */
    public function requerimiento()
    {
        return $this->belongsTo(RequerimientoObra::class, 'fk_id_requerimiento_obra', 'id_requerimiento_obra');
    }

    /**
     * Relación con el producto
     */
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'fk_id_producto', 'id_producto');
    }

    /**
     * Scope para filtrar por requerimiento
     */
    public function scopePorRequerimiento($query, $requerimientoId)
    {
        return $query->where('fk_id_requerimiento_obra', $requerimientoId);
    }

    /**
     * Scope para obtener detalles con producto
     */
    public function scopeConProducto($query)
    {
        return $query->with('producto');
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para productos pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para productos entregados
     */
    public function scopeEntregados($query)
    {
        return $query->where('estado', 'entregado');
    }

    /**
     * Scope para productos cancelados
     */
    public function scopeCancelados($query)
    {
        return $query->where('estado', 'cancelado');
    }

    /**
     * Marcar como entregado
     */
    public function marcarEntregado($cantidadEntregada, $fechaEntrega = null)
    {
        $this->update([
            'estado' => 'entregado',
            'cantidad_entregada' => $cantidadEntregada,
            'fecha_entrega' => $fechaEntrega ?? now()
        ]);
    }

    /**
     * Marcar como cancelado
     */
    public function marcarCancelado()
    {
        $this->update([
            'estado' => 'cancelado'
        ]);
    }
}
