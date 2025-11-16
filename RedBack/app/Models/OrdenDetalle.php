<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class OrdenDetalle
 * 
 * @property int $id_detalle
 * @property Carbon $fecha_registro
 * @property float $cantidad
 * @property float $precio_unitario
 * @property float $subtotal
 * @property int $fk_id_orden
 * @property int $fk_id_producto
 * 
 * @property OrdenesCompra $ordenes_compra
 * @property Producto $producto
 *
 * @package App\Models
 */
class OrdenDetalle extends Model
{
	protected $connection = 'mysql';
	protected $table = 'orden_detalle';
	protected $primaryKey = 'id_detalle';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime',
		'cantidad' => 'float',
		'precio_unitario' => 'float',
		'subtotal' => 'float',
		'fk_id_orden' => 'int',
		'fk_id_producto' => 'int'
	];

	protected $fillable = [
		'fecha_registro',
		'cantidad',
		'precio_unitario',
		'subtotal',
		'fk_id_orden',
		'fk_id_producto'
	];

	public function ordenes_compra()
	{
		return $this->belongsTo(OrdenesCompra::class, 'fk_id_orden');
	}

	public function producto()
	{
		return $this->belongsTo(Producto::class, 'fk_id_producto');
	}
}
