import type { ICard } from "$lib/pokemontcg/interfaces/Card";
import type { ISet } from "$lib/pokemontcg/interfaces/Set";
import { writable } from "svelte/store";

export const currentSet = writable<ISet>();
export const cards = writable<ICard[]>([]);