/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/**
 * Constant: quality deprecation amount per update cycle
 */
const QUALITY_DEPRECATION = 1;
/**
 * Constant: maximum allowed quality value for each item
 */
const MAX_QUALITY = 50;
/**
 * isItOverMax
 * This function checks to make adding to our quality
 * will not increase our quality to be more than our
 * maximum value allowed for that attribute
 * @param {number} increase
 * @param {Item} item
 * @param {MAX_QUALITY} max
 * @returns {Item}
 */

function isItOverMax(increase, item, max) {
  if (item.quality + increase >= max) {
    item.quality = max;
  } else {
    item.quality += increase;
  }
  item.sell_in -= 1;

  return item;
}
/**
 * handleBrie
 * This function handles the condition for 'Aged Brie'
 * Aged Brie increases in quality by 1, the isItOverMax
 * function will handle the data change
 * @param {Item} item
 * @returns {void}
 */

export function handleBrie(item) {
  isItOverMax(1, item, MAX_QUALITY);
}

/**
 * handleBackstagePass
 * updates conditions for 'Backstage passes to a TAFKAL80ETC concert'
 * @param {item} item
 * @returns {item}
 */

export function handleBackstagePass(item) {
  if (item.sell_in <= 0) {
    item.quality = 0;
    item.sell_in -= 1;
  } else if (item.sell_in <= 5) {
    isItOverMax(3, item, MAX_QUALITY);
  } else if (item.sell_in <= 10) {
    isItOverMax(2, item, MAX_QUALITY);
  } else {
    isItOverMax(1, item, MAX_QUALITY);
  }

  return item;
}

/**
 * handleConjuredItem
 * updates any item with the string 'conjured'
 * in the name
 * @param {item} item
 * @returns {item}
 */

export function handleConjuredItem(item) {
  item.quality -= (QUALITY_DEPRECATION * 2);
  item.sell_in -= 1;
  return item;
}

/**
 * handleNonUniqueItem:
 * handles any item that does not have
 * unique conditions when it comes to updating
 * quality and/or sell_in
 * @param {Item} item
 * @returns {Item}
 */

export function handleNonUniqueItem(item) {
  item.sell_in -= 1;
  if (item.qualtiy === 0) return item;
  if (item.sell_in < 0) {
    item.quality - (QUALITY_DEPRECATION * 2) < 0
      ? item.quality = 0
      : item.quality -= (QUALITY_DEPRECATION + QUALITY_DEPRECATION);
  } else {
    item.quality -= QUALITY_DEPRECATION;
  }

  return item;
}
