import generateMarkupAndState from "../server.jsx";

describe('generateMarkup', () => {

	it('generates markup for /ui/about', () => {
		return generateMarkupAndState("/ui/about", "")
			.then(({markup, state}) => {
				expect(markup).to.have.string("Welcome to Redouble!");
				expect(state).to.be.defined;
			});
	});

	it('generates markup for /ui/settings', () => {
		return generateMarkupAndState("/ui/settings", "")
			.then(({markup, state}) => {
				expect(markup).to.have.string(`<h3 class="settings-player-header"`);
				expect(state).to.be.defined;
			});
	});

	it('generates markup for /', () => {
		return generateMarkupAndState("/", "")
			.then(({markup, state}) => {
				expect(markup).to.have.string(`<div class="bridge-table"`);
				expect(state).to.be.defined;
			});
	});

});
