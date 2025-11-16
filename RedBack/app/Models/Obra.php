<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Obra
 * 
 * @property int $idobras
 * @property string $nom_obra
 * @property string $codigo
 * 
 * @property Collection|ObrasCodigo[] $obras_codigos
 *
 * @package App\Models
 */
class Obra extends Model
{
	protected $connection = 'mysql';
	protected $table = 'obras';
	protected $primaryKey = 'idobras';
	public $timestamps = false;

	protected $fillable = [
		'nom_obra',
		'codigo'
	];

	public function obras_codigos()
	{
		return $this->hasMany(ObrasCodigo::class, 'fk_idobras');
	}
}
