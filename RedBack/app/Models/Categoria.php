<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categoria
 * 
 * @property int $id_categoria
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $estado
 * @property Carbon|null $fecha_registro
 * 
 * @property Collection|Producto[] $productos
 *
 * @package App\Models
 */
class Categoria extends Model
{
	protected $connection = 'mysql';
	protected $table = 'categorias';
	protected $primaryKey = 'id_categoria';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime'
	];

	protected $fillable = [
		'nombre',
		'descripcion',
		'estado',
		'fecha_registro'
	];

	public function productos()
	{
		return $this->hasMany(Producto::class, 'fk_id_categoria');
	}
}
