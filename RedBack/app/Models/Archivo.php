<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Archivo
 * 
 * @property int $idarchivos
 * @property Carbon $fecha_archivo
 * @property string $tipo_archivo
 * @property string $ruta_archivo
 * @property int $fk_id_orden
 * 
 * @property OrdenesCompra $ordenes_compra
 *
 * @package App\Models
 */
class Archivo extends Model
{
    protected $connection = 'mysql';
    protected $table = 'archivos';
    protected $primaryKey = 'idarchivos';
    public $timestamps = false;

    protected $casts = [
        'fecha_archivo' => 'datetime',
        'fk_id_orden' => 'int'
    ];

    protected $fillable = [
        'fecha_archivo',
        'tipo_archivo',
        'ruta_archivo',
        'fk_id_orden'
    ];

    public function ordenes_compra()
    {
        return $this->belongsTo(OrdenesCompra::class, 'fk_id_orden', 'id_orden');
    }
}
