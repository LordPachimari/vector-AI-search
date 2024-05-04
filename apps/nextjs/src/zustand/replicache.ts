import type { Replicache } from "replicache";
import { create } from "zustand";
import type { ChatMutatorsType, GlobalMutatorsType } from "@soulmate/api";

interface ReplicacheState {
	globalRep: Replicache<GlobalMutatorsType> | null;
	setGlobalRep: (rep: Replicache<GlobalMutatorsType> | null) => void;
	chatRep: Replicache<ChatMutatorsType> | null;
	setChatRep: (rep: Replicache<ChatMutatorsType> | null) => void;
}

export const useReplicache = create<ReplicacheState>((set) => ({
	globalRep: null,
	setGlobalRep: (rep) => set({ globalRep: rep }),
	chatRep: null,
	setChatRep: (rep) => set({ chatRep: rep }),
}));
