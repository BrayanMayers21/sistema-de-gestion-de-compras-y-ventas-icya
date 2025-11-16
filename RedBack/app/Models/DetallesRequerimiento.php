<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class DetallesRequerimiento
 * 
 * @property int $iddetalles_requerimientos
 * @property Carbon $fecha_detalle
 * @property int $cantidad
 * @property string|null $observaciones
 * @property int $fk_idrequerimientos
 * @property int $fk_id_producto
 * 
 * @property Producto $producto
 * @property Requerimiento $requerimiento
 *
 * @package App\Models
 */
class DetallesRequerimiento extends Model
{
	protected $connection = 'mysql';
	protected $table = 'detalles_requerimientos';
	protected $primaryKey = 'iddetalles_requerimientos';
	public $timestamps = false;

	protected $casts = [
		'fecha_detalle' => 'datetime',
		'cantidad' => 'int',
		'fk_idrequerimientos' => 'int',
		'fk_id_producto' => 'int'
	];

	protected $fillable = [
		'fecha_detalle',
		'cantidad',
		'observaciones',
		'fk_idrequerimientos',
		'fk_id_producto'
	];

	public function producto()
	{
		return $this->belongsTo(Producto::class, 'fk_id_producto');
	}

	public function requerimiento()
	{
		return $this->belongsTo(Requerimiento::class, 'fk_idrequerimientos');
	}
}
