"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns a value that is computed only on the client side.
 * On the server and during hydration, returns the serverValue.
 * After hydration, returns the result of getClientValue().
 *
 * This prevents hydration mismatches when the value depends on
 * browser APIs (like navigator, window, etc.).
 */
export function useClientValue<T>(getClientValue: () => T, serverValue: T): T {
  return useSyncExternalStore(
    emptySubscribe,
    getClientValue,
    () => serverValue
  );
}

/**
 * Returns true only after the component has mounted on the client.
 * Useful for conditional rendering of client-only content.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
