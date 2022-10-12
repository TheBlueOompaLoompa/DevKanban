import { supabase, createThing } from './supabase.js';
import type { IList, ICard } from './types.js';

const orderSort = (a: ICard | IList, b: ICard | IList) => {
  return a.order - b.order;
};

export async function loadCards(listId: string) {
  let cards: ICard[];

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
  let lists: IList[];

  let { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('board', boardId);

  if (!error) {
    lists = [...data];
    lists = lists.sort(orderSort);
  }

  for (let i = 0; i < lists.length; i++) lists[i]['cards'] = [];

  return lists;
}

export async function createList(boardId: string, lists: IList[]) {
  let { data, error } = await createThing('lists', 'board', boardId, 'list', {
    order: lists[0] ? lists[lists.length - 1].order + 1 : 0,
  });
}

export async function createCard(listId: string, cards: ICard[]) {
  let { data, error } = await createThing('cards', 'list', listId, 'card', {
    order: cards[0] ? cards[cards.length - 1].order + 1 : 0,
  });
}

export async function updateListOrder(inv: IList[]) {
  let lists = inv;

  for (let i = 0; i < lists.length; i++) {
    lists[i].order = i;
    const { data, error } = await supabase
      .from('lists')
      .update({ order: lists[i].order })
      .eq('id', lists[i].id);
  }

  return lists;
}

export async function updateCardOrder(listId: string, inv: ICard[]) {
  let cards = inv;

  for (let i = 0; i < cards.length; i++) {
    cards[i].order = i;
    const { data, error } = await supabase
      .from('cards')
      .update({ list: listId, order: cards[i].order })
      .eq('id', cards[i].id);
  }

  return cards;
}
