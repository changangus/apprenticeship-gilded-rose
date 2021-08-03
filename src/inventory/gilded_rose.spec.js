/* eslint-disable no-unused-expressions */
import { Item, updateQuality, resetQualityAndSellIn } from './gilded_rose';
import {
  handleBrie,
  handleBackstagePass,
  handleConjuredItem,
  handleNonUniqueItem,
} from './helpers';

function testSellAndQual(func, item, eQual, eSellIn) {
  func(item);
  Array.isArray(item)
    ? expect(item[0].quality).toBe(eQual)
    : expect(item.quality).toBe(eQual);
  Array.isArray(item)
    ? expect(item[0].sell_in).toBe(eSellIn)
    : expect(item.sell_in).toBe(eSellIn);
}

describe('Helper functions', () => {
  it('should decrease quality and sell_in by one for non uniqe items', () => {
    const item = new Item('+5 Dexterity Vest', 10, 20);
    handleNonUniqueItem(item);
    expect(item.quality).toBe(19);
    expect(item.sell_in).toBe(9);
  });

  it('handles conditions of Aged Brie', () => {
    const agedBrie = new Item('Aged Brie', 2, 0);
    testSellAndQual(handleBrie, agedBrie, 1, 1);
  });

  it('handles conditions of Backstage Passes', () => {
    const aboveTenDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20);
    const tenDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20);
    const fiveDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20);
    const noDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', -1, 20);

    // increases by one with age;
    testSellAndQual(handleBackstagePass, aboveTenDaysBackstagePass, 21, 10, true);
    // increases by 2 within 10 days of show;
    testSellAndQual(handleBackstagePass, tenDaysBackstagePass, 22, 9, true);
    // increase by 3 within 5 days of show;
    testSellAndQual(handleBackstagePass, fiveDaysBackstagePass, 23, 4, true);
    // loses all value after show
    testSellAndQual(handleBackstagePass, noDaysBackstagePass, 0, -2, true);
  });

  it('handles conditions of Conjured items', () => {
    const conjuredItem = new Item('Conjured Mana Cake', 3, 6);
    testSellAndQual(handleConjuredItem, conjuredItem, 4, 2, true);
  });
});

describe('`updateQuality`', () => {
  it('deprecates the sell in and quality by one for a Haunted Shoe', () => {
    const standardItem = new Item('Haunted Shoe', 10, 10);
    testSellAndQual(updateQuality, [standardItem], 9, 9);
  });

  it('makes sure the quality is never negative', () => {
    const standardItem = new Item('Haunted Shoe', -1, 1);
    testSellAndQual(updateQuality, [standardItem], 0, -2);
  });

  it('deprecatees the quality by two once sell_in < 0', () => {
    const standardItem = new Item('Haunted Shoe', -1, 10);
    testSellAndQual(updateQuality, [standardItem], 8, -2);
  });

  it('increases the quality, decreases sell_in by one for Aged Brie', () => {
    const agedBrie = new Item('Aged Brie', 2, 0);
    testSellAndQual(updateQuality, [agedBrie], 1, 1);
  });

  it('no quality can reach above 50', () => {
    const agedBrie = new Item('Aged Brie', 2, 50);
    testSellAndQual(updateQuality, [agedBrie], 50, 1);
  });

  it('should check all conditions of backstage passes (see comments)', () => {
    const aboveTenDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20);
    const tenDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20);
    const fiveDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20);
    const noDaysBackstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', -1, 20);

    // increases by one with age;
    testSellAndQual(updateQuality, [aboveTenDaysBackstagePass], 21, 10);
    // increases by 2 within 10 days of show;
    testSellAndQual(updateQuality, [tenDaysBackstagePass], 22, 9);
    // increase by 3 within 5 days of show;
    testSellAndQual(updateQuality, [fiveDaysBackstagePass], 23, 4);
    // loses all value after show
    testSellAndQual(updateQuality, [noDaysBackstagePass], 0, -2);
  });

  it('should not change Sulfuras at all', () => {
    const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
    testSellAndQual(updateQuality, [sulfuras], 80, 0);
  });
  it('Degrades Conjured items twice as fast', () => {
    const conjuredItem = new Item('Conjured Mana Cake', 4, 10);
    testSellAndQual(updateQuality, [conjuredItem], 8, 3);
  });
});

describe('Reset Inventory', () => {
  it('Should reset all items to original sell in and quality', () => {
    const dexter = new Item('+5 Dexterity Vest', 14, 25);
    const agedBrie = new Item('Aged Brie', -4, 6);
    const elixir = new Item('Elixir of the Mongoose', -2, 0);
    const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 90);
    const backstagePass = new Item('Backstage passes to a TAFKAL80ETC concert', 10, 30);
    const conjured = new Item('Conjured Mana Cake', 2, 4);
    testSellAndQual(resetQualityAndSellIn, [dexter], 20, 10);
    testSellAndQual(resetQualityAndSellIn, [agedBrie], 0, 2);
    testSellAndQual(resetQualityAndSellIn, [elixir], 7, 5);
    testSellAndQual(resetQualityAndSellIn, [sulfuras], 80, 0);
    testSellAndQual(resetQualityAndSellIn, [backstagePass], 20, 15);
    testSellAndQual(resetQualityAndSellIn, [conjured], 6, 3);
  });
});
