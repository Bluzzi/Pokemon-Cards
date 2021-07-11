import type { ISet } from "$lib/pokemontcg/interfaces/Set";
import { writable } from "svelte/store";

export const currentSet = writable<ISet>();