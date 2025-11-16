<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CodigosContable
 * 
 * @property int $idcodigos_contables
 * @property Carbon $fecha_registro_contable
 * @property string $codigo_contable
 * @property string $nombre_contable
 * @property string $descripcion
 * 
 * @property Collection|ObrasCodigo[] $obras_codigos
 * @property Collection|OrdenesCompra[] $ordenes_compras
 *
 * @package App\Models
 */
class CodigosContable extends Model
{
	protected $connection = 'mysql';
	protected $table = 'codigos_contables';
	protected $primaryKey = 'idcodigos_contables';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro_contable' => 'datetime'
	];

	protected $fillable = [
		'fecha_registro_contable',
		'codigo_contable',
		'nombre_contable',
		'descripcion'
	];

	public function obras_codigos()
	{
		return $this->hasMany(ObrasCodigo::class, 'fk_idcodigos_contables');
	}

	public function ordenes_compras()
	{
		return $this->hasMany(OrdenesCompra::class, 'fk_idcodigos_contables');
	}
}
