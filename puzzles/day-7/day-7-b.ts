import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Game {
  hand: string;
  bid: number;
}

interface ParsedGame {
  rawHand: string;
  hand: number[];
  handType: number;
  bid: number;
}

const cards = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  J: 1,
}

export async function day7b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const games: Game[] = data.map((line) => {
    const [hand, bidString] = line.split(' ');
    return {
      hand,
      bid: parseInt(bidString),
    }
  });

  const parsedGames: ParsedGame[] = games.map((game, index) => {
    const individualRawCards = game.hand.split('');
    const nrJokers = individualRawCards.filter((c) => c === 'J').length;
    const hand: number[] = individualRawCards.map((card) => cards[card]);
    const handWithoutJokers: number[] = hand.filter((c) => c !== cards['J']);

    const cardsCount = new Map<number, number>();
    handWithoutJokers.forEach((card) => {
      if (cardsCount.has(card)) {
        cardsCount.set(card, cardsCount.get(card) + 1);
      } else {
        cardsCount.set(card, 1);
      }
    });

    const counts = Array.from(cardsCount.values())
      .sort((a, b) => b - a);
    // Joker is always used to increase the strength of the hand. Meaning that you always want the Joker to count
    // as the card you already have the highest number of cards from
    // Four of a kind > full house
    // Three of a kind > two pair
    counts[0] = counts[0] ? counts[0] + nrJokers : nrJokers;

    if (counts.reduce((total ,i ) => total + i, 0) !== 5){
      throw new Error('Card disappeared');
    }

    let handType: number = 0; // High card
    if (counts.length === 1) { // Five of a kind
      handType = 6;
    } else if (counts.length === 2 && counts[0] === 4) { // Four of a kind
      handType = 5;
    } else if (counts.length === 2 && counts[0] === 3) { // Full house
      handType = 4;
    } else if (counts.length === 3 && counts[0] === 3) { // Three of a kind
      handType = 3;
    } else if (counts.length === 3 && counts[0] === 2 && counts[1] === 2) { // Two pair
      handType = 2;
    } else if (counts.length === 4 && counts[0] === 2) { // One pair
      handType = 1;
    }

    return {
      rawHand: game.hand,
      hand,
      handType,
      bid: game.bid,
    }
  });

  const sortedGames = parsedGames.sort((a, b) => {
    if (a.handType < b.handType) return 1;
    if (a.handType > b.handType) return -1;

    for (let i = 0; i < a.hand.length; i += 1) {
      if (a.hand[i] === 1 || a.hand[i] === 1) {
        console.log('break');
      }
      if (a.hand[i] < b.hand[i]) return 1;
      if (a.hand[i] > b.hand[i]) return -1;
    }

    return 0;
  });

  const winnings = sortedGames.map((game, index) => {
    const rank = sortedGames.length - index;
    return (game.bid * rank);
  })

  return winnings.reduce((total, win) => total + win, 0);
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
