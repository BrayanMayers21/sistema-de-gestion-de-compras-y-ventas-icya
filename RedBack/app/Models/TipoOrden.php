<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoOrden
 * 
 * @property int $idtipo_orden
 * @property string $nom_orden
 * 
 * @property Collection|OrdenesCompra[] $ordenes_compras
 *
 * @package App\Models
 */
class TipoOrden extends Model
{
	protected $connection = 'mysql';
	protected $table = 'tipo_orden';
	protected $primaryKey = 'idtipo_orden';
	public $timestamps = false;

	protected $fillable = [
		'nom_orden'
	];

	public function ordenes_compras()
	{
		return $this->hasMany(OrdenesCompra::class, 'fk_idtipo_orden');
	}
}
