import { create } from "zustand";

export const useGridStore = create((set) => ({
    tileWidth: 80,
    tileHeight: 80,
    gridSize: 12,

    updateScreen: () => {
        
    }
}));