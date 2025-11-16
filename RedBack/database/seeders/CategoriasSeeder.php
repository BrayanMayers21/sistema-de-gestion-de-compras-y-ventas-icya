<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $rows = [
            ['nombre' => 'Cemento', 'descripcion' => 'Cementos Portland, puzolánicos, alta resistencia y especiales.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Arena', 'descripcion' => 'Arena fina, gruesa, lavada, zarandeada; para concreto, tarrajeo y morteros.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Agregados (Arena y Piedra)', 'descripcion' => 'Arena fina/gruesa, grava, piedra chancada, confitillo.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Acero de Refuerzo y Mallas', 'descripcion' => 'Barras corrugadas, alambres, mallas electrosoldadas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Acero Estructural y Perfiles', 'descripcion' => 'Perfiles H/I/U/L/T, tubos estructurales, planchas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Ladrillos y Bloques', 'descripcion' => 'Ladrillos de arcilla, bloques de concreto, sílico-calcáreos.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Concretos y Morteros Premezclados', 'descripcion' => 'Concreto premezclado, morteros, lechadas y grout.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Cal y Yeso', 'descripcion' => 'Cal hidratada/viva, yeso de construcción y enlucidos.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Aditivos para Concreto', 'descripcion' => 'Plastificantes, superplastificantes, acelerantes, retardantes, aireantes.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Impermeabilizantes', 'descripcion' => 'Membranas, mantos, cementicios, asfálticos, poliureas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Sellantes y Adhesivos', 'descripcion' => 'Siliconas, poliuretanos, epóxicos, pegamentos cerámicos.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Rejuntes y Boquillas', 'descripcion' => 'Boquillas cementicias y epóxicas para cerámicos y porcelanatos.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Pinturas y Recubrimientos', 'descripcion' => 'Pinturas base agua/solvente, esmaltes, selladores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Protección y Anticorrosivos', 'descripcion' => 'Recubrimientos anticorrosivos, intumescentes y primers.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Pisos y Revestimientos Cerámicos', 'descripcion' => 'Cerámica, porcelanato, zócalos y accesorios.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Piedra Natural y Enchapados', 'descripcion' => 'Granito, mármol, laja, enchapes de piedra.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Madera y Tableros', 'descripcion' => 'Vigas, listones, MDF, OSB, triplay/contrachapado.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Placas de Yeso y Drywall', 'descripcion' => 'Placas RH/FR, perfiles metálicos, masillas y cintas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Cielos Rasos Modulares', 'descripcion' => 'Techos acústicos y sistemas de suspensión.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Encofrados y Accesorios', 'descripcion' => 'Paneles, puntales, tensores, desmoldantes.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Techos y Coberturas', 'descripcion' => 'Calaminas, tejas, policarbonato, cumbreras, canaletas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Aislamiento Térmico y Acústico', 'descripcion' => 'Lana mineral/vidrio, EPS, XPS, membranas acústicas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Geotextiles y Geosintéticos', 'descripcion' => 'Geotextiles, geomallas, geodrenes, geoceldas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Tuberías y Accesorios (PVC/CPVC/HDPE)', 'descripcion' => 'Agua, desagüe y presión; fittings y accesorios.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Tubería Metálica (Galvanizada/Negra)', 'descripcion' => 'Conducción, estructuras, accesorios roscados/soldables.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Drenaje Pluvial', 'descripcion' => 'Canaletas, rejillas, sumideros y drenes lineales.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Sanitarios y Grifería', 'descripcion' => 'Inodoros, lavatorios, duchas, válvulas y accesorios.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Válvulas y Bombas', 'descripcion' => 'Válvulas compuerta/esfera y bombas de agua.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Tratamiento y Almacenamiento de Agua', 'descripcion' => 'Cisternas, biodigestores, filtros, suavizadores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Gas (Tuberías y Accesorios)', 'descripcion' => 'Conducción de GLP/GN, válvulas y reguladores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Materiales Eléctricos', 'descripcion' => 'Cables, tuberías eléctricas, tomacorrientes, breakers.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Iluminación', 'descripcion' => 'Luminarias LED, reflectores, paneles y accesorios.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Vidrio y Aluminio', 'descripcion' => 'Vidrios templados/laminados, perfiles y mamparas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Cerramientos y Carpintería Metálica', 'descripcion' => 'Puertas, barandas, rejas, marcos y accesorios.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Puertas y Marcos (Madera/Metal/PVC)', 'descripcion' => 'Puertas interiores/exteriores y herrajes.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Cerrajería y Ferretería General', 'descripcion' => 'Bisagras, cerraduras, candados, herrajes y afines.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Fijaciones y Anclajes', 'descripcion' => 'Clavos, tornillos, pernos, tarugos, arandelas, anclajes mecánicos/químicos.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Alambres y Mallas Ferreteras', 'descripcion' => 'Alambre galvanizado/recocido, de púas, mallas, cadenas, cables de acero.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Prefabricados de Concreto', 'descripcion' => 'Viguetas, placas, muros y elementos prefabricados.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Adoquines y Pavimentos Exteriores', 'descripcion' => 'Adoquines, losetas, bordillos, drenes para exteriores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Cercos y Alambrados', 'descripcion' => 'Malla olímpica, alambre de púas, concertina, postes.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Señalización y Control de Obra', 'descripcion' => 'Conos, mallas, cintas, letreros y barreras.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Andamios y Escaleras', 'descripcion' => 'Andamios multidireccionales, marcos, escaleras y piezas.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Herramientas Manuales', 'descripcion' => 'Llaves, martillos, palas, cinceles, niveles y más.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Herramientas Eléctricas', 'descripcion' => 'Taladros, esmeriles, rotomartillos, demoledoras.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Equipos y Maquinaria Ligera', 'descripcion' => 'Mezcladoras, compactadoras, vibradores, cortadoras.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Limpieza y Mantenimiento de Obra', 'descripcion' => 'Detergentes, desinfectantes, escobas, recogedores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Químicos para Construcción', 'descripcion' => 'Epóxicos, curadores, desmoldantes, limpiadores.', 'estado' => 'Activo', 'fecha_registro' => $now],
            ['nombre' => 'Seguridad Industrial (EPP)', 'descripcion' => 'Cascos, guantes, botas, arneses, respiradores, chalecos.', 'estado' => 'Activo', 'fecha_registro' => $now],
        ];

        // Evita duplicados por 'nombre' y actualiza descripción/estado/fecha si ya existen
        DB::table('categorias')->upsert(
            $rows,
            ['nombre'],                        // clave única lógica
            ['descripcion', 'estado', 'fecha_registro'] // columnas a actualizar
        );
    }
}
