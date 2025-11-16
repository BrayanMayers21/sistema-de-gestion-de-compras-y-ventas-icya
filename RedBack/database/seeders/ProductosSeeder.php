<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductosSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // mapa nombre_categoria => id_categoria (debe existir por tu CategoriasSeeder)
        $catMap = DB::table('categorias')->pluck('id_categoria', 'nombre')->toArray();

        $catId = function (string $categoria) use ($catMap): int {
            if (!isset($catMap[$categoria])) {
                throw new \RuntimeException("Categoría no encontrada: {$categoria}. Seedear categorías primero y usar el mismo nombre.");
            }
            return (int)$catMap[$categoria];
        };

        // Abreviatura "bonita": toma iniciales de palabras; si no, 3 primeras letras A-Z
        $abbr = function (string $s): string {
            $t = Str::upper(Str::ascii($s));
            preg_match_all('/\b([A-Z])/', $t, $m);
            $initials = implode('', $m[1]);
            $base = substr($initials ?: preg_replace('/[^A-Z]/', '', $t) ?: 'PRD', 0, 3);
            return $base;
        };

        // Prefijo único por categoría: ABC-<idcat>
        $makePrefix = function (string $categoria) use ($abbr, $catId): string {
            $base = $abbr($categoria);                        // p.ej. ACE
            $id   = str_pad((string)$catId($categoria), 3, '0', STR_PAD_LEFT); // 004
            return $base . '-' . $id;                         // ACE-004
        };

        // cache de correlativos por prefijo (se inicia leyendo BD la 1.ª vez)
        $seq = [];

        $getNextCodigo = function (string $categoria) use (&$seq, $makePrefix): string {
            $prefix = $makePrefix($categoria);                // p.ej. ACE-004
            if (!array_key_exists($prefix, $seq)) {
                $max = DB::table('productos')
                    ->where('codigo', 'like', $prefix . '-%')
                    ->selectRaw('COALESCE(MAX(CAST(SUBSTRING_INDEX(codigo, "-", -1) AS UNSIGNED)), 0) as max')
                    ->value('max');
                $seq[$prefix] = (int)$max;
            }
            $seq[$prefix]++;                                  // siguiente correlativo
            return $prefix . '-' . str_pad((string)$seq[$prefix], 4, '0', STR_PAD_LEFT); // ACE-004-0001
        };

        $rows = [];
        $add = function (string $categoria, string $nombre, string $unidad, string $descripcion = '') use (&$rows, $getNextCodigo, $catId, $now) {
            $rows[] = [
                'fecha_registro'  => $now,
                'codigo'          => $getNextCodigo($categoria),
                'unidad_medida'   => $unidad,  // UND, KG, M, M2, M3, GL, LT, SACO, ROL, PAR, JGO, CAJA, BAL, KIT, BOL, BARRA, PLANCHA
                'nombre'          => $nombre,
                'descripcion'     => $descripcion,
                'fk_id_categoria' => $catId($categoria),
            ];
        };

        // =======================
        // ARENAS / AGREGADOS
        // =======================
        $add('Arena', 'Arena fina (m3)',  'M3', 'Arena tamizada para tarrajeo fino.');
        $add('Arena', 'Arena gruesa (m3)', 'M3', 'Arena para concreto estructural.');
        $add('Arena', 'Arena lavada (m3)', 'M3', 'Arena lavada para morteros y concreto.');
        $add('Arena', 'Arena zarandeada (m3)', 'M3', 'Arena cribada para acabados.');
        $add('Agregados (Arena y Piedra)', 'Piedra chancada 1/2" (m3)', 'M3', 'Agregado para concreto f\'c 210.');
        $add('Agregados (Arena y Piedra)', 'Piedra chancada 3/4" (m3)', 'M3', 'Agregado grueso para concretos.');
        $add('Agregados (Arena y Piedra)', 'Grava (m3)', 'M3', 'Grava para bases y rellenos.');
        $add('Agregados (Arena y Piedra)', 'Confitillo (m3)', 'M3', 'Agregado fino para mezclas y acabados.');
        $add('Agregados (Arena y Piedra)', 'Base granular (m3)', 'M3', 'Base para pavimentos.');
        $add('Agregados (Arena y Piedra)', 'Sub-base granular (m3)', 'M3', 'Sub-base para pavimentos.');
        $add('Agregados (Arena y Piedra)', 'Afirmado (m3)', 'M3', 'Afirmado vial para accesos.');

        // =======================
        // CEMENTOS
        // =======================
        $add('Cemento', 'Cemento Portland Tipo I (saco 42.5 kg)', 'SACO', 'Uso general en construcción.');
        $add('Cemento', 'Cemento IP Puzolánico (saco 42.5 kg)',    'SACO', 'Obras en ambientes agresivos.');
        $add('Cemento', 'Cemento AR Alta Resistencia (saco 42.5 kg)', 'SACO', 'Desencofrados rápidos.');
        $add('Cemento', 'Cemento Tipo V Sulfato Resistente (saco 42.5 kg)', 'SACO', 'Ambientes con sulfatos.');

        // =======================
        // ACEROS / MALLAS / ANCLAJES
        // =======================
        foreach (['3/8"', '1/2"', '5/8"', '3/4"'] as $d) {
            $add('Acero de Refuerzo y Mallas', "Barra corrugada {$d} (9 m)", 'BARRA', 'Acero de refuerzo ASTM A615.');
        }
        $add('Acero de Refuerzo y Mallas', 'Malla electrosoldada 6x6-6/6 (plancha)', 'PLANCHA', 'Refuerzo para losas.');
        $add('Acero de Refuerzo y Mallas', 'Malla electrosoldada 6x6-8/8 (plancha)', 'PLANCHA', 'Refuerzo para losas.');
        $add('Acero Estructural y Perfiles', 'Perfil ángulo L 2"x2"x1/4" (6 m)', 'UND', 'Carpintería metálica.');
        $add('Acero Estructural y Perfiles', 'Canal U 4" (6 m)', 'UND', 'Estructuras livianas.');
        $add('Acero Estructural y Perfiles', 'Tubo estructural 2"x2"x2.0 mm (6 m)', 'UND', 'Estructuras y portones.');
        $add('Fijaciones y Anclajes', 'Perno de anclaje J 1/2"x30 cm', 'UND', 'Anclaje para cimientos.');

        // =======================
        // LADRILLOS / BLOQUES / PREFAB
        // =======================
        $add('Ladrillos y Bloques', 'Ladrillo King Kong (hueco)', 'UND', 'Mampostería estructural.');
        $add('Ladrillos y Bloques', 'Ladrillo pandereta', 'UND', 'Tabiques y divisiones.');
        $add('Prefabricados de Concreto', 'Bloque de concreto 15x20x40', 'UND', 'Muro de albañilería.');
        $add('Prefabricados de Concreto', 'Bordillo prefabricado', 'UND', 'Sardineles y veredas.');
        $add('Prefabricados de Concreto', 'Vigueta de concreto (m)', 'M', 'Sistemas de losa aligerada.');

        // =======================
        // CONCRETOS / MORTEROS / CAL / YESO / ADITIVOS
        // =======================
        $add('Concretos y Morteros Premezclados', "Concreto f'c=210 (m3)", 'M3', 'Concreto premezclado 210 kg/cm².');
        $add('Concretos y Morteros Premezclados', "Concreto f'c=280 (m3)", 'M3', 'Concreto premezclado 280 kg/cm².');
        $add('Concretos y Morteros Premezclados', 'Mortero premezclado (bolsa 25 kg)', 'BOL', 'Tarrajeo y asentado.');
        $add('Concretos y Morteros Premezclados', 'Grout no retráctil (bolsa 25 kg)', 'BOL', 'Chicoteo y anclajes.');
        $add('Cal y Yeso', 'Cal hidratada (bolsa 25 kg)', 'BOL', 'Mejorador de mezclas y suelos.');
        $add('Cal y Yeso', 'Yeso de construcción (bolsa 40 kg)', 'BOL', 'Enlucidos interiores.');
        $add('Aditivos para Concreto', 'Plastificante (galón)', 'GL', 'Mejora trabajabilidad.');
        $add('Aditivos para Concreto', 'Superplastificante (galón)', 'GL', 'Reducción de agua alta.');
        $add('Aditivos para Concreto', 'Acelerante de fraguado (galón)', 'GL', 'Climas fríos o urgencia.');
        $add('Aditivos para Concreto', 'Retardante de fraguado (galón)', 'GL', 'Transporte prolongado.');
        $add('Aditivos para Concreto', 'Incorporador de aire (galón)', 'GL', 'Mejora durabilidad.');

        // =======================
        // IMPERMEABILIZANTES / SELLANTES / ADHESIVOS / REJUNTES
        // =======================
        $add('Impermeabilizantes', 'Membrana asfáltica 3 mm (rollo)', 'ROL', 'Impermeabilización de techos.');
        $add('Impermeabilizantes', 'Membrana asfáltica 4 mm (rollo)', 'ROL', 'Impermeabilización de techos.');
        $add('Impermeabilizantes', 'Impermeabilizante cementicio (bolsa 25 kg)', 'BOL', 'Tanques y sótanos.');
        $add('Impermeabilizantes', 'Pintura asfáltica (galón)', 'GL', 'Protección e impermeabilizado.');
        $add('Sellantes y Adhesivos', 'Silicona acética tubo 280 ml', 'UND', 'Sellado general.');
        $add('Sellantes y Adhesivos', 'Sellador poliuretano cartucho', 'UND', 'Juntas de dilatación.');
        $add('Sellantes y Adhesivos', 'Adhesivo cerámico C1 (bolsa 25 kg)', 'BOL', 'Pegado de cerámica.');
        $add('Sellantes y Adhesivos', 'Adhesivo porcelanato C2 (bolsa 25 kg)', 'BOL', 'Pisado pesado.');
        $add('Sellantes y Adhesivos', 'Pegamento PVC (1/4 GL)', 'LT', 'Soldadura química PVC.');
        $add('Rejuntes y Boquillas', 'Rejunte cementicio 1 kg', 'KG', 'Juntas cerámicas 1–6 mm.');
        $add('Rejuntes y Boquillas', 'Rejunte epóxico (kit)', 'KIT', 'Áreas químicas y sumergidas.');

        // =======================
        // PINTURAS Y PROTECCIÓN
        // =======================
        $add('Pinturas y Recubrimientos', 'Pintura látex interior (1 GL)', 'GL', 'Acabado mate lavable.');
        $add('Pinturas y Recubrimientos', 'Pintura látex interior (balde 5 GL)', 'BAL', 'Rendimiento extendido.');
        $add('Pinturas y Recubrimientos', 'Esmalte sintético (1 GL)', 'GL', 'Metales y madera.');
        $add('Pinturas y Recubrimientos', 'Sellador/Primer (1 GL)', 'GL', 'Sellado de superficies.');
        $add('Protección y Anticorrosivos', 'Anticorrosivo rojo óxido (1 GL)', 'GL', 'Protección de metales.');
        $add('Protección y Anticorrosivos', 'Epóxico industrial (kit)', 'KIT', 'Ambientes agresivos.');
        $add('Señalización y Control de Obra', 'Pintura de tráfico amarilla (GL)', 'GL', 'Demarcación vial.');

        // =======================
        // REVESTIMIENTOS / PIEDRAS / PISOS
        // =======================
        $add('Pisos y Revestimientos Cerámicos', 'Cerámico piso 60x60 (m2)', 'M2', 'Tránsito medio.');
        $add('Pisos y Revestimientos Cerámicos', 'Porcelanato 60x60 (m2)', 'M2', 'Tránsito alto.');
        $add('Pisos y Revestimientos Cerámicos', 'Zócalo cerámico (ml)', 'M', 'Remate perimetral.');
        $add('Piedra Natural y Enchapados', 'Laja andina (m2)', 'M2', 'Revestimiento rústico.');
        $add('Piedra Natural y Enchapados', 'Granito pulido (m2)', 'M2', 'Top y escalones.');

        // =======================
        // MADERAS / DRYWALL / CIELOS / ENCOFRADOS
        // =======================
        $add('Madera y Tableros', 'Triplay 9 mm 1.22x2.44', 'UND', 'Encofrados y muebles.');
        $add('Madera y Tableros', 'OSB 11 mm 1.22x2.44', 'UND', 'Cubiertas y muros.');
        $add('Madera y Tableros', 'Listón pino 2"x3" (m)', 'M', 'Estructuras livianas.');
        $add('Placas de Yeso y Drywall', 'Placa drywall ST 1/2" 1.22x2.44', 'UND', 'Tabiques y cielos.');
        $add('Placas de Yeso y Drywall', 'Placa drywall RH 1/2" 1.22x2.44', 'UND', 'Resistente a humedad.');
        $add('Placas de Yeso y Drywall', 'Canal 38 (3.0 m)', 'UND', 'Estructura de tabique.');
        $add('Placas de Yeso y Drywall', 'Montante 64 (3.0 m)', 'UND', 'Estructura de tabique.');
        $add('Placas de Yeso y Drywall', 'Masilla drywall (balde)', 'BAL', 'Juntas y acabado.');
        $add('Placas de Yeso y Drywall', 'Cinta papel para juntas (rollo)', 'ROL', 'Refuerzo de juntas.');
        $add('Placas de Yeso y Drywall', 'Tornillo drywall punta fina (caja)', 'CAJA', 'Fijación de placas.');
        $add('Cielos Rasos Modulares', 'Baldosa acústica 60x60', 'UND', 'Absorción acústica.');
        $add('Cielos Rasos Modulares', 'T-Bar primario (3.6 m)', 'UND', 'Suspensión de cielos.');
        $add('Encofrados y Accesorios', 'Puntal metálico telescópico', 'UND', 'Apuntalamiento de losas.');
        $add('Encofrados y Accesorios', 'Aceite desmoldante (5 GL)', 'BAL', 'Desencofrado limpio.');

        // =======================
        // TECHOS / AISLAMIENTOS / GEOS
        // =======================
        $add('Techos y Coberturas', 'Calamina galvanizada T101 (m2)', 'M2', 'Cobertura de techo.');
        $add('Techos y Coberturas', 'Policarbonato alveolar 6 mm (m2)', 'M2', 'Cubiertas traslúcidas.');
        $add('Techos y Coberturas', 'Cumbrera galvanizada', 'UND', 'Remate de techos.');
        $add('Techos y Coberturas', 'Canaleta metálica (ml)', 'M', 'Drenaje de cubierta.');
        $add('Aislamiento Térmico y Acústico', 'Lana de vidrio (rollo)', 'ROL', 'Aislamiento termoacústico.');
        $add('Aislamiento Térmico y Acústico', 'Plancha EPS 25 mm', 'UND', 'Aislamiento térmico.');
        $add('Aislamiento Térmico y Acústico', 'Plancha XPS 25 mm', 'UND', 'Aislamiento térmico.');
        $add('Geotextiles y Geosintéticos', 'Geotextil NT 200 g/m2 (m2)', 'M2', 'Separación/filtración.');
        $add('Geotextiles y Geosintéticos', 'Geomalla biaxial (m2)', 'M2', 'Refuerzo de suelos.');

        // =======================
        // TUBERÍAS PVC/CPVC/HDPE + FITTINGS
        // =======================
        foreach ([2, 3, 4, 6] as $pulg) {
            $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', "Tubo PVC desagüe {$pulg}\" (6 m)", 'UND', 'Serie desagüe, junta elástica.');
        }
        foreach (['1/2"', '3/4"', '1"'] as $pulg) {
            $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', "Tubo CPVC {$pulg} (3 m)", 'UND', 'Agua caliente/fría.');
        }
        foreach (['1/2"', '3/4"', '1"'] as $pulg) {
            $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', "Tubo PVC presión {$pulg} (6 m)", 'UND', 'Líneas de presión.');
        }
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Tubo HDPE 1" (m)', 'M', 'Conducción por metro.');

        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo PVC desagüe 4" 90°', 'UND', 'Accesorio sanitario.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo PVC desagüe 4" 45°', 'UND', 'Accesorio sanitario.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Te PVC desagüe 4"x4"', 'UND', 'Derivación sanitaria.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo CPVC 1/2" 90°', 'UND', 'Accesorio agua caliente.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo CPVC 3/4" 90°', 'UND', 'Accesorio agua.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo PVC presión 1/2" 45°', 'UND', 'Red de presión.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo PVC presión 1" 90°', 'UND', 'Red de presión.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Codo HDPE electrofusión 1" 90°', 'UND', 'Soldadura por electrofusión.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Unión universal 1"', 'UND', 'Desmontable/rotable.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Adaptador hembra 1/2"', 'UND', 'Transición a rosca.');
        $add('Tuberías y Accesorios (PVC/CPVC/HDPE)', 'Cinta teflón (rollo)', 'ROL', 'Sellado de roscas.');

        // =======================
        // TUBERÍA METÁLICA / DRENAJE / AGUA / GAS
        // =======================
        $add('Tubería Metálica (Galvanizada/Negra)', 'Tubo galvanizado 1/2" (6 m)', 'UND', 'Conducción/rociadores.');
        $add('Tubería Metálica (Galvanizada/Negra)', 'Codo galvanizado 1/2" 90°', 'UND', 'Rosca NPT.');
        $add('Tubería Metálica (Galvanizada/Negra)', 'Codo negro 1" 90°', 'UND', 'Líneas de gas/rociadores.');

        $add('Drenaje Pluvial', 'Canaleta de fibra (ml)', 'M', 'Drenaje superficial.');
        $add('Drenaje Pluvial', 'Rejilla pluvial', 'UND', 'Rejilla para canaleta.');
        $add('Drenaje Pluvial', 'Sumidero pluvial', 'UND', 'Puntos de evacuación.');

        $add('Tratamiento y Almacenamiento de Agua', 'Cisterna 1100 L', 'UND', 'Tanque almacenamiento agua.');
        $add('Tratamiento y Almacenamiento de Agua', 'Biodigestor 600 L', 'UND', 'Tratamiento primario.');
        $add('Válvulas y Bombas', 'Válvula esfera 1/2" latón', 'UND', 'Cierre rápido.');
        $add('Válvulas y Bombas', 'Bomba centrífuga 1 HP', 'UND', 'Presurización doméstica.');

        $add('Gas (Tuberías y Accesorios)', 'Tubería PE-AL-PE 1/2" (m)', 'M', 'Conducción de gas.');
        $add('Gas (Tuberías y Accesorios)', 'Regulador GLP baja presión', 'UND', 'Cocinas y calderos.');
        $add('Gas (Tuberías y Accesorios)', 'Válvula de bola para gas 1/2"', 'UND', 'Aprobación para GLP.');

        // =======================
        // SANITARIOS / GRIFERÍA
        // =======================
        $add('Sanitarios y Grifería', 'Inodoro one-piece', 'UND', 'Sanitario de una pieza.');
        $add('Sanitarios y Grifería', 'Lavatorio de pedestal', 'UND', 'Baños domésticos.');
        $add('Sanitarios y Grifería', 'Grifería monomando lavatorio', 'UND', 'Cromada.');
        $add('Sanitarios y Grifería', 'Ducha teléfono con barra', 'UND', 'Set completo.');

        // =======================
        // ELÉCTRICOS / ILUMINACIÓN
        // =======================
        foreach ([['14', 'rojo'], ['12', 'negro'], ['10', 'verde']] as [$awg, $color]) {
            $add('Materiales Eléctricos', "Cable THHN {$awg} AWG {$color} (m)", 'M', 'Cobre aislado, 600V.');
        }
        $add('Materiales Eléctricos', 'Tubo PVC eléctrico 3/4" (m)', 'M', 'Conduit para cableado.');
        $add('Materiales Eléctricos', 'Caja octogonal', 'UND', 'Caja de paso empotrada.');
        $add('Materiales Eléctricos', 'Interruptor simple', 'UND', 'Monopolar.');
        $add('Materiales Eléctricos', 'Tomacorriente bipolar-tierra', 'UND', '10–16A.');
        $add('Materiales Eléctricos', 'Breaker termomagnético 20 A', 'UND', 'Curva C.');
        $add('Materiales Eléctricos', 'Tablero 8 polos empotrable', 'UND', 'Tablero distribución.');

        $add('Iluminación', 'Foco LED 9 W E27', 'UND', 'Luz blanca/3000–6500K.');
        $add('Iluminación', 'Panel LED 60x60', 'UND', 'Cielos modulares.');
        $add('Iluminación', 'Reflector LED 50 W', 'UND', 'IP65 exteriores.');
        $add('Iluminación', 'Luminaria estanca 2x18 W', 'UND', 'Ambientes húmedos.');

        // =======================
        // VIDRIO / CERRAJERÍA / PUERTAS / CERRAMIENTOS
        // =======================
        $add('Vidrio y Aluminio', 'Vidrio templado 10 mm (m2)', 'M2', 'Puertas y mamparas.');
        $add('Vidrio y Aluminio', 'Perfil aluminio 1.5" (m)', 'M', 'Sistemas corredizos.');
        $add('Cerramientos y Carpintería Metálica', 'Baranda metálica (ml)', 'M', 'Escaleras y balcones.');
        $add('Puertas y Marcos (Madera/Metal/PVC)', 'Puerta de madera cedro', 'UND', 'Interior semisólida.');
        $add('Puertas y Marcos (Madera/Metal/PVC)', 'Marco metálico para puerta', 'UND', 'Puertas interiores.');
        $add('Cerrajería y Ferretería General', 'Bisagra 3" par', 'PAR', 'Par de bisagras para puerta.');
        $add('Cerrajería y Ferretería General', 'Cerradura pomo', 'UND', 'Puertas interiores.');
        $add('Cerrajería y Ferretería General', 'Candado 50 mm', 'UND', 'Seguridad general.');
        $add('Cerrajería y Ferretería General', 'Manija tubular', 'UND', 'Puertas de acceso.');

        // =======================
        // FIJACIONES / ANCLAJES / ALAMBRES / MALLAS
        // =======================
        foreach (['1.5"', '2"', '2.5"', '3"'] as $clv) {
            $add('Fijaciones y Anclajes', "Clavo {$clv} (kg)", 'KG', 'Clavo de acero construcción.');
        }
        $add('Fijaciones y Anclajes', 'Tornillo para madera 1 1/2"', 'UND', 'Cabeza philips.');
        $add('Fijaciones y Anclajes', 'Tornillo drywall 1 1/4" (caja)', 'CAJA', 'Punta fina fosfatado.');
        $add('Fijaciones y Anclajes', 'Tarugo plástico 1/4"', 'UND', 'Fijación en muro.');
        $add('Fijaciones y Anclajes', 'Anclaje mecánico 3/8"x3"', 'UND', 'Expansivo para concreto.');
        $add('Fijaciones y Anclajes', 'Anclaje químico (cartucho)', 'UND', 'Resina epóxica/PU.');
        $add('Alambres y Mallas Ferreteras', 'Alambre de amarre Nº 8 (rollo)', 'ROL', 'Amarre pesado de obra.');
        $add('Alambres y Mallas Ferreteras', 'Alambre recocido #16 (rollo)', 'ROL', 'Amarre de fierro.');
        $add('Alambres y Mallas Ferreteras', 'Alambre recocido #18 (rollo)', 'ROL', 'Encofrados y amarres.');
        $add('Alambres y Mallas Ferreteras', 'Alambre galvanizado #14 (rollo)', 'ROL', 'Cercos y fijaciones.');
        $add('Alambres y Mallas Ferreteras', 'Alambre de púas 400 m (rollo)', 'ROL', 'Perímetros rurales.');
        $add('Alambres y Mallas Ferreteras', 'Cable de acero 1/4" (m)', 'M', 'Tensado e izaje ligero.');
        $add('Alambres y Mallas Ferreteras', 'Malla hexagonal 1" (rollo)', 'ROL', 'Gallinero/yesería.');
        $add('Alambres y Mallas Ferreteras', 'Malla olímpica 2" x 50 m (rollo)', 'ROL', 'Cercos perimétricos.');
        $add('Alambres y Mallas Ferreteras', 'Concertina galvanizada (rollo)', 'ROL', 'Seguridad perimetral.');
        $add('Cercos y Alambrados', 'Poste metálico para cerco', 'UND', 'Poste para malla.');
        $add('Cercos y Alambrados', 'Tensor para cerco', 'UND', 'Tensado de mallas.');
        $add('Cercos y Alambrados', 'Grapas para cercos (kg)', 'KG', 'Sujeción alambre.');
        $add('Señalización y Control de Obra', 'Malla de seguridad naranja (rollo)', 'ROL', 'Delimitación de obra.');

        // =======================
        // ADOQUINES / PAVIMENTOS
        // =======================
        $add('Adoquines y Pavimentos Exteriores', 'Adoquín 8 cm (m2)', 'M2', 'Pavimento vehicular.');
        $add('Adoquines y Pavimentos Exteriores', 'Loseta 40x40 (m2)', 'M2', 'Veredas y patios.');

        // =======================
        // ANDAMIOS / ESCALERAS / EQUIPOS
        // =======================
        $add('Andamios y Escaleras', 'Marco de andamio', 'UND', 'Estructura para trabajo en altura.');
        $add('Andamios y Escaleras', 'Cruceta para andamio', 'UND', 'Arriostre de andamio.');
        $add('Andamios y Escaleras', 'Plataforma metálica', 'UND', 'Superficie de trabajo.');
        $add('Andamios y Escaleras', 'Base regulable', 'UND', 'Nivelación de andamio.');
        $add('Andamios y Escaleras', 'Rueda con freno para andamio', 'UND', 'Movilidad en obra.');
        $add('Andamios y Escaleras', 'Escalera de fibra 6 peldaños', 'UND', 'Trabajo eléctrico.');

        $add('Equipos y Maquinaria Ligera', 'Mezcladora de concreto 9 p3', 'UND', 'Mezclado de concretos.');
        $add('Equipos y Maquinaria Ligera', 'Compactador tipo canguro', 'UND', 'Compactación de zanjas.');
        $add('Equipos y Maquinaria Ligera', 'Vibrador de concreto 2 HP', 'UND', 'Consolidación de mezcla.');
        $add('Equipos y Maquinaria Ligera', 'Cortadora de piso', 'UND', 'Corte de losa/concreto.');

        // =======================
        // HERRAMIENTAS / DISCOS / ELECTRODOS / LIMPIEZA / QUÍMICOS
        // =======================
        $add('Herramientas Manuales', 'Martillo uña', 'UND', 'Carpintería general.');
        $add('Herramientas Manuales', 'Llave ajustable 12"', 'UND', 'Ajustes y montaje.');
        $add('Herramientas Manuales', 'Juego de llaves combinadas', 'JGO', 'Mecánica general.');
        $add('Herramientas Manuales', 'Pala cuadrada', 'UND', 'Movimiento de materiales.');
        $add('Herramientas Manuales', 'Pico con mango', 'UND', 'Zanjas y excavación.');
        $add('Herramientas Manuales', 'Carretilla 90 L', 'UND', 'Transporte de materiales.');
        $add('Herramientas Manuales', 'Cincel de albañil', 'UND', 'Demolición ligera.');
        $add('Herramientas Manuales', 'Nivel de burbuja 24"', 'UND', 'Alineación y nivel.');
        $add('Herramientas Manuales', 'Cinta métrica 5 m', 'UND', 'Medición en obra.');
        $add('Herramientas Manuales', 'Plomada 8 oz', 'UND', 'Alineación vertical.');

        $add('Herramientas Eléctricas', 'Taladro percutor 1/2"', 'UND', 'Perforación en muro.');
        $add('Herramientas Eléctricas', 'Rotomartillo SDS-Plus', 'UND', 'Perforación en concreto.');
        $add('Herramientas Eléctricas', 'Amoladora 4.5"', 'UND', 'Corte y desbaste.');
        $add('Herramientas Eléctricas', 'Sierra circular 7-1/4"', 'UND', 'Corte de madera.');
        $add('Herramientas Eléctricas', 'Disco corte metal 4.5"', 'UND', 'Amoladora angular.');
        $add('Herramientas Eléctricas', 'Disco corte concreto 4.5"', 'UND', 'Diamantado.');
        $add('Herramientas Eléctricas', 'Disco flap 4.5" grano 60', 'UND', 'Desbaste/acabado metal.');
        $add('Acero Estructural y Perfiles', 'Electrodo 6011 1/8" (kg)', 'KG', 'Soldadura de acero.');
        $add('Acero Estructural y Perfiles', 'Electrodo 6013 1/8" (kg)', 'KG', 'Soldadura de acero.');

        $add('Limpieza y Mantenimiento de Obra', 'Escoba industrial', 'UND', 'Limpieza de obra.');
        $add('Limpieza y Mantenimiento de Obra', 'Recogedor metálico', 'UND', 'Limpieza de obra.');
        $add('Limpieza y Mantenimiento de Obra', 'Detergente industrial (1 GL)', 'GL', 'Limpieza general.');
        $add('Limpieza y Mantenimiento de Obra', 'Desinfectante (1 GL)', 'GL', 'Desinfección de superficies.');

        $add('Químicos para Construcción', 'Curador de concreto (5 GL)', 'BAL', 'Cura y control de evaporación.');
        $add('Químicos para Construcción', 'Desmoldante químico (5 GL)', 'BAL', 'Desencofrado.');
        $add('Químicos para Construcción', 'Removedor de cemento (1 GL)', 'GL', 'Limpieza post-obra.');
        $add('Químicos para Construcción', 'Limpiador para porcelanato (1 LT)', 'LT', 'Acabados finos.');

        // =======================
        // EPP / SEGURIDAD INDUSTRIAL
        // =======================
        $add('Seguridad Industrial (EPP)', 'Casco de seguridad con barbuquejo', 'UND', 'Tipo construcción.');
        $add('Seguridad Industrial (EPP)', 'Lentes de seguridad incoloros', 'UND', 'Antiempañante.');
        $add('Seguridad Industrial (EPP)', 'Careta facial completa', 'UND', 'Protección facial.');
        $add('Seguridad Industrial (EPP)', 'Mascarilla N95', 'UND', 'Filtración particulada.');
        $add('Seguridad Industrial (EPP)', 'Respirador con filtros (kit)', 'KIT', 'Vapores orgánicos/partículas.');
        $add('Seguridad Industrial (EPP)', 'Protector auditivo tipo copa', 'PAR', 'Reducción de ruido.');
        $add('Seguridad Industrial (EPP)', 'Tapones auditivos (par)', 'PAR', 'Desechables.');
        $add('Seguridad Industrial (EPP)', 'Guantes de cuero descarne', 'PAR', 'Soldadura y manejo rudo.');
        $add('Seguridad Industrial (EPP)', 'Guantes de nitrilo', 'PAR', 'Químicos ligeros.');
        $add('Seguridad Industrial (EPP)', 'Guantes anticorte nivel 5', 'PAR', 'Manipulación de chapa/acero.');
        $add('Seguridad Industrial (EPP)', 'Guantes dieléctricos clase 0', 'PAR', 'Trabajo eléctrico.');
        $add('Seguridad Industrial (EPP)', 'Botas de seguridad punta de acero', 'PAR', 'Cuero, antideslizantes.');
        $add('Seguridad Industrial (EPP)', 'Botas de jebe caña alta', 'PAR', 'Impermeables para obra.');
        $add('Seguridad Industrial (EPP)', 'Botín dieléctrico', 'PAR', 'Trabajo eléctrico.');
        $add('Seguridad Industrial (EPP)', 'Arnés de seguridad 2 puntos', 'UND', 'Trabajo en altura.');
        $add('Seguridad Industrial (EPP)', 'Línea de vida 1.8 m', 'UND', 'Amarre doble con absorbedor.');
        $add('Seguridad Industrial (EPP)', 'Cuerda poliéster 12 mm (m)', 'M', 'Líneas de trabajo/aseguramiento.');
        $add('Seguridad Industrial (EPP)', 'Eslinga de izaje 2" x 2 m', 'UND', 'Maniobras de carga.');
        $add('Seguridad Industrial (EPP)', 'Chaleco reflectivo naranja', 'UND', 'Alta visibilidad.');
        $add('Seguridad Industrial (EPP)', 'Faja lumbar', 'UND', 'Soporte para carga.');
        $add('Seguridad Industrial (EPP)', 'Rodilleras para obra', 'PAR', 'Colocación de pisos.');
        $add('Seguridad Industrial (EPP)', 'Extintor ABC 6 kg', 'UND', 'Seguridad contra incendios.');

        // =======================
        // SEÑALIZACIÓN (extra)
        // =======================
        $add('Señalización y Control de Obra', 'Cono de seguridad 70 cm', 'UND', 'Señalización temporal.');
        $add('Señalización y Control de Obra', 'Cinta de peligro 200 m (rollo)', 'ROL', 'Delimitación de zonas.');
        $add('Señalización y Control de Obra', 'Letrero de seguridad', 'UND', 'Señalización obligatoria.');
        $add('Señalización y Control de Obra', 'Barrera plástica', 'UND', 'Control de tránsito interno.');

        // =======================
        // UPSERT
        // =======================
        DB::table('productos')->upsert(
            $rows,
            ['codigo'], // clave única lógica
            ['fecha_registro', 'unidad_medida', 'nombre', 'descripcion', 'fk_id_categoria']
        );
    }
}
