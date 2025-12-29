<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Producto;

class UpdateProductImages extends Command
{
    protected $signature = 'productos:update-images';
    protected $description = 'Actualiza las imágenes de los productos con URLs de ejemplo';

    public function handle()
    {
        $this->info('Actualizando imágenes de productos...');

        // Mapeo de palabras clave para imágenes
        $imageMap = [
            'cemento' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
            'arena' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            'ladrillo' => 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=400',
            'fierro' => 'https://images.unsplash.com/photo-1615115210285-6b8c6d5a7e5c?w=400',
            'tubo' => 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
            'cable' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            'pintura' => 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
            'madera' => 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
            'vidrio' => 'https://images.unsplash.com/photo-1574698796308-6f7c9fdf210d?w=400',
            'default' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400'
        ];

        $productos = Producto::whereNull('ruta_imagen')
            ->orWhere('ruta_imagen', '')
            ->get();

        $updated = 0;
        foreach ($productos as $producto) {
            $imagenUrl = $imageMap['default'];

            // Buscar coincidencia con palabras clave
            $nombreLower = strtolower($producto->nombre);
            foreach ($imageMap as $keyword => $url) {
                if (strpos($nombreLower, $keyword) !== false) {
                    $imagenUrl = $url;
                    break;
                }
            }

            $producto->ruta_imagen = $imagenUrl;
            $producto->save();
            $updated++;

            $this->line("✓ {$producto->codigo} - {$producto->nombre}");
        }

        $this->info("\n✅ Se actualizaron {$updated} productos con imágenes.");
        return 0;
    }
}
