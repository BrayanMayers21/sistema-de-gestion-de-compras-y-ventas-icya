<?php

namespace App\Http\Controllers\Cargo;

use App\Http\Controllers\Controller;
use App\Models\CargoEmpleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class CargoController extends Controller
{
    /**
     * Lista todos los cargos
     */
    public function listaCargos()
    {
        try {
            $cargos = CargoEmpleado::orderBy('nom_cargo_empleado', 'asc')->get();
            return view('cargo.index', compact('cargos'));
        } catch (Exception $e) {
            return back()->with('error', 'Error al cargar la lista de cargos: ' . $e->getMessage());
        }
    }
    /**
     * Almacena un nuevo cargo en la base de datos
     */
    public function CrearCargos(Request $request)
    {
        try {
            $request->validate([
                'nom_cargo_empleado' => 'required|string|max:255|unique:cargos_empleados,nom_cargo_empleado',
            ], [
                'nom_cargo_empleado.required' => 'El nombre del cargo es obligatorio',
                'nom_cargo_empleado.max' => 'El nombre del cargo no puede exceder 255 caracteres',
                'nom_cargo_empleado.unique' => 'Este cargo ya existe',
            ]);

            DB::beginTransaction();

            $cargo = CargoEmpleado::create([
                'nom_cargo_empleado' => $request->nom_cargo_empleado,
            ]);

            DB::commit();

            return redirect()->route('cargo.index')->with('success', 'Cargo creado exitosamente');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Error al crear el cargo: ' . $e->getMessage());
        }
    }
    /**
     * Actualiza un cargo en la base de datos
     */
    public function ActualizarCargos(Request $request, $id)
    {
        try {
            $cargo = CargoEmpleado::findOrFail($id);

            $request->validate([
                'nom_cargo_empleado' => 'required|string|max:255|unique:cargos_empleados,nom_cargo_empleado,' . $id . ',idcargos_empleados',
            ], [
                'nom_cargo_empleado.required' => 'El nombre del cargo es obligatorio',
                'nom_cargo_empleado.max' => 'El nombre del cargo no puede exceder 255 caracteres',
                'nom_cargo_empleado.unique' => 'Este cargo ya existe',
            ]);

            DB::beginTransaction();

            $cargo->update([
                'nom_cargo_empleado' => $request->nom_cargo_empleado,
            ]);

            DB::commit();

            return redirect()->route('cargo.index')->with('success', 'Cargo actualizado exitosamente');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Error al actualizar el cargo: ' . $e->getMessage());
        }
    }

    /**
     * Elimina un cargo de la base de datos
     */
    public function EliminarCargos($id)
    {
        try {
            $cargo = CargoEmpleado::findOrFail($id);

            // Verificar si el cargo tiene empleados asociados
            if ($cargo->empleados()->count() > 0) {
                return redirect()->route('cargo.index')->with('warning', 'No se puede eliminar el cargo porque tiene empleados asociados');
            }

            DB::beginTransaction();

            $cargo->delete();

            DB::commit();

            return redirect()->route('cargo.index')->with('success', 'Cargo eliminado exitosamente');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->route('cargo.index')->with('error', 'Error al eliminar el cargo: ' . $e->getMessage());
        }
    }

    /**
     * Muestra los detalles de un cargo específico
     */
    public function show($id)
    {
        try {
            $cargo = CargoEmpleado::with('empleados')->findOrFail($id);
            return view('cargo.show', compact('cargo'));
        } catch (Exception $e) {
            return redirect()->route('cargo.index')->with('error', 'Cargo no encontrado');
        }
    }
}
