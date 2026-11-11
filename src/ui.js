import { createContext, useContext } from 'react'

/** Shared UI actions: open/close project sheet, open lightbox, preloader state. */
export const UIContext = createContext(null)
export const useUI = () => useContext(UIContext)

export const EASE = [0.22, 1, 0.36, 1]
export const EASE_IO = [0.76, 0, 0.24, 1]
