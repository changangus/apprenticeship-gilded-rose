import { handleBackstagePass, handleBrie, handleConjuredItem, handleNonUniqueItem } from "./helpers.js";

// Item constructor. DO NOT MODIFY OR THE GOBLIN WILL EAT YOU!
export function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

/*
* Update inventory
* @param {Item[]} items - an array of Items representing the inventory to be updated
* Example usage:

const items = [
  new Item('+5 Dexterity Vest', 10, 20),
  new Item('Aged Brie', 2, 0),
  new Item('Elixir of the Mongoose', 5, 7),
  new Item('Sulfuras, Hand of Ragnaros', 0, 80),
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
  new Item('Conjured Mana Cake', 3, 6),
];

updateQuality(items);
*/

export const getNewItems = () => [
  new Item('+5 Dexterity Vest', 10, 20),
  new Item('Aged Brie', 2, 0),
  new Item('Elixir of the Mongoose', 5, 7),
  new Item('Sulfuras, Hand of Ragnaros', 0, 80),
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
  new Item('Conjured Mana Cake', 3, 6),
];

/**
 * updateQuality:
 * updates the quality and the sell_in
 * of an item, will update any unique 
 * scenarios
 * @param {Item[]} items 
 * @returns {Item[]}
 */

export function updateQuality(items) {
  const updatedItems = items.map((item) => {
    switch (item.name) {
      case 'Aged Brie':
        handleBrie(item);
        break;
      case 'Backstage passes to a TAFKAL80ETC concert':
        handleBackstagePass(item);
        break;
      case 'Sulfuras, Hand of Ragnaros':
        break;
      default:
        item.name.toLowerCase().includes('conjured') ? handleConjuredItem(item) : handleNonUniqueItem(item);
    } 
  })
  return updatedItems;
}

/**
 * resetQualityAndSellIn
 * resets quality and sell_in for all
 * items to their original values
 * @param {Item[]} items 
 * @returns {Item[]}
 */

export function resetQualityAndSellIn(items) {
  const originals = getNewItems();

  const origMap = {};

  originals.forEach((item) => {
    origMap[item.name] = {quality: item.quality, sell_in: item.sell_in}
  });

  const resetItems = items.map((item) => {
    const origItem = origMap[item.name];
    item.quality = origItem.quality;
    item.sell_in = origItem.sell_in;
  });

  return resetItems;
}