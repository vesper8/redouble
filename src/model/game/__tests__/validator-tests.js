import {BoardBuilder} from '../board-builder';
import {Bid} from '../../core/bid';
import {Seat} from '../../core/seat';
import {validateBid, validateCard} from '../validators';

describe('Validators', () => {
	describe('validateBid', () => {
		it('checks the range', () => {
			let board = BoardBuilder
				.create()
				.toQuery();

			expect(validateBid(Bid.create("0S"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("8H"), board)).to.not.be.undefined;
		});

		it('allows only valid bids over no bids', () => {
			let board = BoardBuilder
				.create()
				.toQuery();

			expect(validateBid(Bid.create("1H"), board)).to.be.undefined;
			expect(validateBid(Bid.create("2H"), board)).to.be.undefined;
			expect(validateBid(Bid.create("no bid"), board)).to.be.undefined;
			expect(validateBid(Bid.create("double"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("redouble"), board)).to.not.be.undefined;
		});

		it('allows only valid bids over calls', () => {
			let board = BoardBuilder
				.create()
				.makeBid("1H")
				.toQuery();

			expect(validateBid(Bid.create("1D"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("1H"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("2H"), board)).to.be.undefined;
			expect(validateBid(Bid.create("double"), board)).to.be.undefined;
			expect(validateBid(Bid.create("redouble"), board)).to.not.be.undefined;
		});

		it('allows only valid bids over doubles', () => {
			let board = BoardBuilder
				.create()
				.makeBid("1H")
				.makeBid("no bid")
				.makeBid("no bid")
				.makeBid("double")
				.toQuery();

			expect(validateBid(Bid.create("1D"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("1H"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("2H"), board)).to.be.undefined;
			expect(validateBid(Bid.create("double"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("redouble"), board)).to.be.undefined;
		});

		it('allows only valid bids over redoubles', () => {
			let board = BoardBuilder
				.create()
				.makeBid("1H")
				.makeBid("double")
				.makeBid("redouble")
				.toQuery();


			expect(validateBid(Bid.create("1D"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("1H"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("2H"), board)).to.be.undefined;
			expect(validateBid(Bid.create("double"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("redouble"), board)).to.not.be.undefined;
		});

		it('disallows bids after the bidding has ended', () => {
			let board = BoardBuilder
				.create()
				.makeBid("1H")
				.makeBid("no bid")
				.makeBid("no bid")
				.makeBid("no bid")
				.toQuery();

			expect(validateBid(Bid.create("1D"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("1H"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("2H"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("no bid"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("double"), board)).to.not.be.undefined;
			expect(validateBid(Bid.create("redouble"), board)).to.not.be.undefined;
		});
	});

	describe('validateCard', () => {
		let boardBuilder;

		beforeEach(() => {
			boardBuilder = BoardBuilder
				.create(Seat.South)
				.makeBid(Bid.create("1H"))
				.makeBid(Bid.create("no bid"))
				.makeBid(Bid.create("no bid"))
				.makeBid(Bid.create("no bid"));

		});

		it('checks the card is from the right hand', () => {
			let board = boardBuilder.toQuery();

			expect(validateCard(board.hands[Seat.West][0], board)).to.be.undefined;
			expect(validateCard(board.hands[Seat.East][0], board)).to.not.be.undefined;

			board = boardBuilder.playCard(board.hands[Seat.West][0]).toQuery();

			/* play from wrong hand but correct suit */
			let nextCard = board.hands[Seat.East].filter((card) => card.suit === board.hands[Seat.West][0].suit)[0];

			if (!nextCard)
				nextCard = board.hands[Seat.South].filter((card) => card.suit === board.hands[Seat.West][0].suit)[0];

			expect(validateCard(nextCard, board)).to.not.be.undefined;

			/* play from right hand and correct suit */
			nextCard = board.hands[Seat.North].filter((card) => card.suit === board.hands[Seat.West][0].suit)[0];

			if (nextCard) {
				expect(validateCard(nextCard, board)).to.be.undefined;
			}
		});

		function followSuit(aboard, orAny) {
			let hand = aboard.hands[aboard.nextPlayer];
			let available = hand.filter((card) => !aboard.hasBeenPlayed(card));

			let trick = aboard.currentTrick;

			if ((trick.length > 0) && (trick.length < 4)) {
				let lead = trick[0].card;
				let followers = available.filter((card) => (card.suit === lead.suit));

				if (followers.length > 0)
					return followers[0];
			}

			if (orAny)
				return available[0];
			else
				return undefined;
		}

		it('checks the card has not already been played', () => {
			let board = boardBuilder.toQuery();

			/* play a trick */
			let trick = {};

			trick[Seat.West] = followSuit(board, true);
			board = boardBuilder.playCard(trick[Seat.West]).toQuery();

			trick[Seat.North] = followSuit(board, true);
			board = boardBuilder.playCard(trick[Seat.North]).toQuery();

			trick[Seat.East] = followSuit(board, true);
			board = boardBuilder.playCard(trick[Seat.East]).toQuery();

			trick[Seat.South] = followSuit(board, true);
			board = boardBuilder.playCard(trick[Seat.South]).toQuery();

			/* have the winner play the same card */
			expect(validateCard(trick[board.nextPlayer], board)).to.not.be.undefined;

			/* have the winner play a different card */
			expect(validateCard(followSuit(board, true), board)).to.be.undefined;
			expect(validateCard(trick[board.nextPlayer], board)).to.not.be.undefined;
		});

		it('checks the card is following the suit lead', () => {
			let board = boardBuilder.toQuery();

			/* lead a card */
			let lead = board.hands[Seat.West][0];

			/* try and play wrong suit */
			let nextCard = board.hands[Seat.North].filter((card) => card.suit !== lead.suit)[0];
			expect(validateCard(nextCard, board)).to.not.be.undefined;
		});

		it('allows another suit when player is void', () => {
			let board = boardBuilder.toQuery();

			/* just play a board */
			while(!board.playHasEnded) {
				let nextCard = followSuit(board);

				if (!nextCard)
					nextCard = board.hands[board.nextPlayer]
						.filter((card) => !board.hasBeenPlayed(card))[0]; //eslint-disable-line no-loop-func

				expect(validateCard(nextCard, board)).to.be.undefined;
				board = boardBuilder.playCard(nextCard).toQuery();
			}
		});
	});
});
