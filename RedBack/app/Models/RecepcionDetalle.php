<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RecepcionDetalle
 * 
 * @property int $id_detalle
 * @property int $id_recepcion
 * @property float $cantidad_ordenada
 * @property float $cantidad_recibida
 * @property string|null $observaciones
 * @property Carbon|null $fecha_registro
 * @property int $fk_id_producto
 * 
 * @property Producto $producto
 * @property Recepcione $recepcione
 *
 * @package App\Models
 */
class RecepcionDetalle extends Model
{
	protected $connection = 'mysql';
	protected $table = 'recepcion_detalle';
	protected $primaryKey = 'id_detalle';
	public $timestamps = false;

	protected $casts = [
		'id_recepcion' => 'int',
		'cantidad_ordenada' => 'float',
		'cantidad_recibida' => 'float',
		'fecha_registro' => 'datetime',
		'fk_id_producto' => 'int'
	];

	protected $fillable = [
		'id_recepcion',
		'cantidad_ordenada',
		'cantidad_recibida',
		'observaciones',
		'fecha_registro',
		'fk_id_producto'
	];

	public function producto()
	{
		return $this->belongsTo(Producto::class, 'fk_id_producto');
	}

	public function recepcione()
	{
		return $this->belongsTo(Recepcione::class, 'id_recepcion');
	}
}
