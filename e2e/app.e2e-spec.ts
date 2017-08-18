import { RogoAirPage } from './app.po';

describe('rogo-air App', () => {
  let page: RogoAirPage;

  beforeEach(() => {
    page = new RogoAirPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
