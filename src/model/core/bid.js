/* @flow */

export const BidSuit = {
	Clubs: 1,
	Diamonds: 2,
	Hearts: 3,
	Spades: 4,
	NoTrumps: 5,

	all: () => [1, 2, 3, 4, 5],
	fromPBN: (idx) => PBNBidSuitMap[idx],
	toPBN: (suit) => PBNBidSuitMap.indexOf(suit),
	fromPBNString: (pbn) => PBNBidSuitStringMap.indexOf(pbn),
	toPBNString: (suit) => PBNBidSuitStringMap[suit]
};

const PBNBidSuitMap = [BidSuit.Spades, BidSuit.Hearts, BidSuit.Diamonds, BidSuit.Clubs, BidSuit.NoTrumps];
const PBNBidSuitStringMap = ["", "C", "D", "H", "S", "NT"];

export const BidType = {
	NoBid: 1,
	Call: 2,
	Double: 3,
	Redouble: 4
};

/*
	interface Bid {
		type: BidType;
		suit?: BidSuit;
		level?: number;
	}
*/

export const Bid = {
	stringify(bid) {
		switch(bid.type) {
			case BidType.NoBid:
				return "No Bid";
			case BidType.Call:
				return `${bid.level} ${Bid.suitName(bid.suit, (bid.level === 1))}`;
			case BidType.Double:
				return "Double";
			case BidType.Redouble:
				return "Redouble";
			default:
				throw new Error("unrecognised bid");
		}
	},

	key(bid) {
		let result = [ bid.type ];

		if (bid.type === BidType.Call)
			result = result.concat([ bid.level, bid.suit ]);

		return result.join('-');
	},

	create(bid: string) {
		let shortNames = [ "", "c", "d", "h", "s", "nt"];
		bid = bid.toLowerCase();

		if (bid === "double")
			return { type: BidType.Double };
		else if (bid === "redouble")
			return { type: BidType.Redouble };
		else if (bid === "no bid")
			return { type: BidType.NoBid };
		else {
			let result = { type: BidType.Call };
			result.level = parseInt(bid[0]);
			result.suit = shortNames.indexOf(bid.slice(1));
			return result;
		}
	},

	/*
	 * creates an array of bids
	 * takes a variable length argument list of strings e.g. "1H", "double", "no bid"
	 */
	createAll() {
		var result = [];

		for (let i = 0; i < arguments.length; i ++) {
			result.push(Bid.create(arguments[i]));
		}

		return result;
	},

	suitName(suit: BidSuit, singular: boolean) {
		let names = [ "", "club", "diamond", "heart", "spade", "no-trump"];
		return names[suit] + (singular ? '' : 's');
	},

	compare(bid1, bid2) {
		if (bid1.type !== bid2.type) {
			return bid1.type - bid2.type;
		}
		else {
			if (bid1.type === BidType.Call) {
				if (bid1.level === bid2.level)
					return bid1.suit - bid2.suit;
				else
					return bid1.level - bid2.level;
			}
			else {
				return 0;
			}
		}
	}
};
