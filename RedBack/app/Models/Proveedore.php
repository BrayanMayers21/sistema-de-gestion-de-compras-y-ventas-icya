<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Proveedore
 * 
 * @property int $id_proveedor
 * @property string|null $ruc
 * @property string $razon_social
 * @property string|null $nombre_comercial
 * @property string|null $direccion
 * @property string|null $telefono
 * @property string|null $email
 * @property string|null $contacto_telefono
 * @property string|null $estado
 * @property Carbon|null $fecha_registro
 * 
 * @property Collection|OrdenesCompra[] $ordenes_compras
 * @property Collection|Requerimiento[] $requerimientos
 *
 * @package App\Models
 */
class Proveedore extends Model
{
	protected $connection = 'mysql';
	protected $table = 'proveedores';
	protected $primaryKey = 'id_proveedor';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime'
	];

	protected $fillable = [
		'ruc',
		'razon_social',
		'nombre_comercial',
		'direccion',
		'telefono',
		'email',
		'contacto_telefono',
		'estado',
		'fecha_registro'
	];

	public function ordenes_compras()
	{
		return $this->hasMany(OrdenesCompra::class, 'fk_id_proveedor');
	}

	public function requerimientos()
	{
		return $this->hasMany(Requerimiento::class, 'fk_id_proveedor');
	}
}
