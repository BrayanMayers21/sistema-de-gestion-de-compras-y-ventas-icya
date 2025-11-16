<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ObrasCodigo
 * 
 * @property int $idobras_codigos
 * @property Carbon $fecha_registro
 * @property int $fk_idcodigos_contables
 * @property int $fk_idobras
 * 
 * @property CodigosContable $codigos_contable
 * @property Obra $obra
 *
 * @package App\Models
 */
class ObrasCodigo extends Model
{
	protected $connection = 'mysql';
	protected $table = 'obras_codigos';
	protected $primaryKey = 'idobras_codigos';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime',
		'fk_idcodigos_contables' => 'int',
		'fk_idobras' => 'int'
	];

	protected $fillable = [
		'fecha_registro',
		'fk_idcodigos_contables',
		'fk_idobras'
	];

	public function codigos_contable()
	{
		return $this->belongsTo(CodigosContable::class, 'fk_idcodigos_contables');
	}

	public function obra()
	{
		return $this->belongsTo(Obra::class, 'fk_idobras');
	}
}
