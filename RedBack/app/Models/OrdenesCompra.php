<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class OrdenesCompra
 * 
 * @property int $id_orden
 * @property string $numero_orden
 * @property Carbon $fecha_emision
 * @property Carbon|null $fecha_entrega
 * @property string|null $lugar_entrega
 * @property string|null $estado
 * @property float $subtotal
 * @property float $igv
 * @property float $total
 * @property string|null $observaciones
 * @property int $fk_idobras
 * @property int $fk_idtipo_orden
 * @property int $fk_id_proveedor
 * 
 * @property Obra $obra
 * @property Proveedore $proveedore
 * @property TipoOrden $tipo_orden
 * @property Collection|OrdenDetalle[] $orden_detalles
 * @property Collection|Recepcione[] $recepciones
 * @property Collection|Archivo[] $archivos
 *
 * @package App\Models
 */
class OrdenesCompra extends Model
{
	protected $connection = 'mysql';
	protected $table = 'ordenes_compra';
	protected $primaryKey = 'id_orden';
	public $timestamps = false;

	protected $casts = [
		'fecha_emision' => 'datetime',
		'fecha_entrega' => 'datetime',
		'subtotal' => 'float',
		'igv' => 'float',
		'adelanto' => 'float',
		'total' => 'float',
		'fk_idobras' => 'int',
		'fk_idtipo_orden' => 'int',
		'fk_id_proveedor' => 'int'
	];

	protected $fillable = [
		'numero_orden',
		'fecha_emision',
		'fecha_entrega',
		'lugar_entrega',
		'estado',
		'subtotal',
		'igv',
		'adelanto',
		'total',
		'observaciones',
		'fk_idobras',
		'fk_idtipo_orden',
		'fk_id_proveedor'
	];

	public function obra()
	{
		return $this->belongsTo(Obra::class, 'fk_idobras');
	}

	public function proveedore()
	{
		return $this->belongsTo(Proveedore::class, 'fk_id_proveedor');
	}

	public function tipo_orden()
	{
		return $this->belongsTo(TipoOrden::class, 'fk_idtipo_orden');
	}

	public function orden_detalles()
	{
		return $this->hasMany(OrdenDetalle::class, 'fk_id_orden');
	}

	public function recepciones()
	{
		return $this->hasMany(Recepcione::class, 'fk_id_orden');
	}

	public function archivos()
	{
		return $this->hasMany(Archivo::class, 'fk_id_orden', 'id_orden');
	}
}
