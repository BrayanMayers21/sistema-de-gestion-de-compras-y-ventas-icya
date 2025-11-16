<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Recepcione
 * 
 * @property int $id_recepcion
 * @property string $numero_recepcion
 * @property Carbon $fecha_recepcion
 * @property string|null $responsable_recepcion
 * @property string|null $guia_remision
 * @property string|null $observaciones
 * @property string|null $estado
 * @property string|null $usuario_registro
 * @property Carbon|null $fecha_registro
 * @property int $fk_id_orden
 * 
 * @property OrdenesCompra $ordenes_compra
 * @property Collection|RecepcionDetalle[] $recepcion_detalles
 *
 * @package App\Models
 */
class Recepcione extends Model
{
	protected $connection = 'mysql';
	protected $table = 'recepciones';
	protected $primaryKey = 'id_recepcion';
	public $timestamps = false;

	protected $casts = [
		'fecha_recepcion' => 'datetime',
		'fecha_registro' => 'datetime',
		'fk_id_orden' => 'int'
	];

	protected $fillable = [
		'numero_recepcion',
		'fecha_recepcion',
		'responsable_recepcion',
		'guia_remision',
		'observaciones',
		'estado',
		'usuario_registro',
		'fecha_registro',
		'fk_id_orden'
	];

	public function ordenes_compra()
	{
		return $this->belongsTo(OrdenesCompra::class, 'fk_id_orden');
	}

	public function recepcion_detalles()
	{
		return $this->hasMany(RecepcionDetalle::class, 'id_recepcion');
	}
}
