<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RequerimientoObra
 * 
 * @property int $id_requerimiento_obra
 * @property int $fk_idobras
 * @property string $numero_requerimiento
 * @property Carbon $fecha_requerimiento
 * @property Carbon|null $fecha_atencion
 * @property string|null $lugar_entrega
 * @property string $residente_obra
 * @property string|null $justificacion
 * @property string $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Obra $obra
 * @property Collection|RequerimientoObraDetalle[] $detalles
 *
 * @package App\Models
 */
class RequerimientoObra extends Model
{
    protected $connection = 'mysql';
    protected $table = 'requerimientos_obra';
    protected $primaryKey = 'id_requerimiento_obra';
    public $timestamps = true;

    protected $casts = [
        'fk_idobras' => 'int',
        'fecha_requerimiento' => 'date',
        'fecha_atencion' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $fillable = [
        'fk_idobras',
        'numero_requerimiento',
        'fecha_requerimiento',
        'fecha_atencion',
        'lugar_entrega',
        'residente_obra',
        'justificacion',
        'estado'
    ];

    /**
     * Relación con la tabla obras
     */
    public function obra()
    {
        return $this->belongsTo(Obra::class, 'fk_idobras', 'idobras');
    }

    /**
     * Relación con los detalles del requerimiento (productos)
     */
    public function detalles()
    {
        return $this->hasMany(RequerimientoObraDetalle::class, 'fk_id_requerimiento_obra', 'id_requerimiento_obra');
    }

    /**
     * Scope para filtrar por obra
     */
    public function scopePorObra($query, $obraId)
    {
        return $query->where('fk_idobras', $obraId);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para requerimientos pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para requerimientos aprobados
     */
    public function scopeAprobados($query)
    {
        return $query->where('estado', 'aprobado');
    }

    /**
     * Scope para requerimientos atendidos
     */
    public function scopeAtendidos($query)
    {
        return $query->where('estado', 'atendido');
    }

    /**
     * Scope para requerimientos con sus detalles
     */
    public function scopeConDetalles($query)
    {
        return $query->with(['detalles', 'detalles.producto', 'obra']);
    }
}
