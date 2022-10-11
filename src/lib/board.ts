import { supabase, createThing } from './supabase.js';
import type { IList } from './types.js';

const orderSort = (a, b) => {
  return a.order - b.order;
};

async function loadCards(listId: string) {
  let cards;

  let { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('list', listId);

  if (!error) {
    cards = data;
    cards = cards.sort(orderSort);
  } else {
    console.error(error);
  }

  return cards;
}

export async function loadLists(boardId: string) {
  let lists = [];

  let { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('board', boardId);

  if (!error) {
    lists = [...data];
    lists = lists.sort(orderSort);
  }

  for (let i = 0; i < lists.length; i++) {
    lists[i]['cards'] = await loadCards(lists[i].id);
  }

  return lists;
}

export async function createList(boardId: string, lists: IList[]) {
  let { data, error } = await createThing('lists', 'board', boardId, 'list', {
    order: lists[0] ? lists[lists.length - 1].order + 1 : 0,
  });

  if (!error) lists = [...lists, ...data];

  return lists;
}

export async function createCard(listId: string, cards) {
  let { data, error } = await createThing('cards', 'list', listId, 'card', {
    order: cards[0] ? cards[cards.length - 1].order + 1 : 0,
  });

  if (!error) cards = [...cards, ...data];

  return cards;
}
