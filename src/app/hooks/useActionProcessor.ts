// hooks/useActionProcessor.ts
"use client";

import { useActionState, useEffect, startTransition, useCallback } from "react";




// types/server-action-response.ts

// Define el tipo para la propiedad 'data' de la respuesta de la acción.
// Puede ser el tipo esperado (T), un array del tipo esperado (T[]),
// un array vacío ([] si no hay resultados pero la operación fue exitosa),
// o null (si la operación falló).
export type ActionDataPayload<T> = T | T[] | [] | any | null;

// Interfaz para representar un error estructurado.
export interface ActionError {
  message: string;             // Mensaje legible para el usuario.
  statusCode?: string;         // Código HTTP del error (ej. 400, 404, 500).
  details?: Record<string, any>; // Campos adicionales para errores más específicos (ej. validación).
  fieldErrors?: { [key: string]: string[] }; // Para errores de validación por campo.
}

// Interfaz estándar para el valor de retorno de TODAS las Server Actions.
// T es el tipo de datos específicos que la acción devuelve en caso de éxito.
export interface ServerActionResponse<T> {
  success: boolean;            // true si la operación fue exitosa (2xx), false si falló (4xx/5xx/red).
  data: ActionDataPayload<T>;  // Los datos si 'success' es true (puede ser []). Null si 'success' es false.
  error: ActionError | null;   // El objeto de error si 'success' es false. Null si 'success' es true.
  status?: string;             // Código HTTP de la respuesta.
  message?: string;            // Mensaje general de la operación (éxito, info, error).
}

// ====================================================================================
// Interfaz para el estado consolidado que tu componente principal gestiona (displayData).
// T_Consolidated es el tipo de datos que `items` puede contener en el estado global.
export interface ConsolidatedDisplayData<T_Consolidated> {
  success: boolean;
  items: ActionDataPayload<T_Consolidated>; // Los datos consolidados.
  error: ActionError | null;
  status?: string;
  message?: string;
  source: string | null;                   // Para saber qué acción actualizó la data (ej. "pqrsAction").
}

// Props para el custom hook useActionProcessor.
// T_ActionData: El tipo de datos que la Server Action devuelve en su propiedad 'data' (ej. PQRSItem[], CPData).
// U: El tipo de payload que la Server Action espera (ej. FormData, { id: string }).
interface UseActionProcessorProps<T_ActionData, U extends FormData | object | null> {
  action: (prevState: ServerActionResponse<T_ActionData> | null, payload: U) => Promise<ServerActionResponse<T_ActionData>>;
  initialActionState?: ServerActionResponse<T_ActionData> | null;
  
  // globalSetter: La función `setState` de tu `useState` consolidado en el componente padre.
  // El tipo genérico aquí (T_ActionData) debe ser compatible con el tipo que espera tu `displayData.items`.
  globalSetter: React.Dispatch<React.SetStateAction<ConsolidatedDisplayData<T_ActionData> | null>>;
  
  // onActionComplete: Un callback opcional para ejecutar lógica adicional
  // después de que la acción finaliza y el estado global se actualiza.
  // Es CRUCIAL que este callback esté envuelto en useCallback en el componente padre.
  onActionComplete?: (result: ServerActionResponse<T_ActionData>) => void;
  
  name: string; // Un nombre para esta acción, útil para la depuración y como 'source' en ConsolidatedDisplayData.
}

export function useActionProcessor<T_ActionData, U extends FormData | object | null>({
  action,
  initialActionState = null,
  globalSetter,
  onActionComplete,
  name,
}: UseActionProcessorProps<T_ActionData, U>) {
  // useActionState de React para gestionar el estado de la Server Action.
  const [actionState, dispatchAction, isPending] = useActionState(action, initialActionState);

  // useEffect para sincronizar el 'actionState' con el 'globalSetter'
  // y para ejecutar el callback 'onActionComplete'.
  useEffect(() => {
    // Solo se ejecuta si actionState NO es null (es decir, una acción ya ha terminado).
    if (actionState) {
      console.log(`[${name}] Acción completada. Actualizando estado global.`, actionState);
      
      // Actualiza el estado consolidado en el componente padre.
      // El 'items' de ConsolidatedDisplayData se asigna desde el 'data' de la acción.
      globalSetter(prev => ({
        success: actionState.success,
        items: actionState.data, // Asigna directamente, puede ser [] o null.
        error: actionState.error || null,
        status: actionState.status,
        message: actionState.message,
        source: name,
      }));

      // Ejecuta el callback adicional si se proporcionó.
      if (onActionComplete) {
        onActionComplete(actionState);
      }
    }
  }, [actionState, globalSetter, onActionComplete, name]); // Dependencias: onActionComplete DEBE ser estable (useCallback).

  // handlerAction: Función para disparar la Server Action, envuelta en startTransition.
  // Es un useCallback para asegurar una referencia estable.
  const handlerAction = useCallback((payload: U) => {
    startTransition(() => {
      console.log(`[${name}] Disparando acción con payload:`, payload);
      dispatchAction(payload);
    });
  }, [dispatchAction, name]);

  // Retorna el estado actual de la acción, el handler para dispararla, y el estado de pending.
  return { actionState, handlerAction, isPending };
}