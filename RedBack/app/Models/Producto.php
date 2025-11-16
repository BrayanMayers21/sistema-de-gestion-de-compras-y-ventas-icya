<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Producto
 * 
 * @property int $id_producto
 * @property Carbon $fecha_registro
 * @property string $unidad_medida
 * @property string $codigo
 * @property string $nombre
 * @property string|null $descripcion
 * @property int $fk_id_categoria
 * 
 * @property Categoria $categoria
 * @property Collection|DetallesRequerimiento[] $detalles_requerimientos
 * @property Collection|OrdenDetalle[] $orden_detalles
 * @property Collection|RecepcionDetalle[] $recepcion_detalles
 *
 * @package App\Models
 */
class Producto extends Model
{
	protected $connection = 'mysql';
	protected $table = 'productos';
	protected $primaryKey = 'id_producto';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime',
		'fk_id_categoria' => 'int'
	];

	protected $fillable = [
		'fecha_registro',
		'unidad_medida',
		'codigo',
		'nombre',
		'descripcion',
		'fk_id_categoria'
	];

	public function categoria()
	{
		return $this->belongsTo(Categoria::class, 'fk_id_categoria');
	}

	public function detalles_requerimientos()
	{
		return $this->hasMany(DetallesRequerimiento::class, 'fk_id_producto');
	}

	public function orden_detalles()
	{
		return $this->hasMany(OrdenDetalle::class, 'fk_id_producto');
	}

	public function recepcion_detalles()
	{
		return $this->hasMany(RecepcionDetalle::class, 'fk_id_producto');
	}
}
