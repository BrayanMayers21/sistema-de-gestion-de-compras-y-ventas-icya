<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Requerimiento
 * 
 * @property int $idrequerimientos
 * @property Carbon $fecha_requerimiento
 * @property string $numero_requerimiento
 * @property string|null $observaciones
 * @property int $fk_id_proveedor
 * 
 * @property Proveedore $proveedore
 * @property Collection|DetallesRequerimiento[] $detalles_requerimientos
 *
 * @package App\Models
 */
class Requerimiento extends Model
{
	protected $connection = 'mysql';
	protected $table = 'requerimientos';
	protected $primaryKey = 'idrequerimientos';
	public $timestamps = false;

	protected $casts = [
		'fecha_requerimiento' => 'datetime',
		'fk_id_proveedor' => 'int'
	];

	protected $fillable = [
		'fecha_requerimiento',
		'numero_requerimiento',
		'observaciones',
		'fk_id_proveedor'
	];

	public function proveedore()
	{
		return $this->belongsTo(Proveedore::class, 'fk_id_proveedor');
	}

	public function detalles_requerimientos()
	{
		return $this->hasMany(DetallesRequerimiento::class, 'fk_idrequerimientos');
	}

	// Alias para la relación detalles (usado en el controlador)
	public function detalles()
	{
		return $this->hasMany(DetallesRequerimiento::class, 'fk_idrequerimientos');
	}
}
