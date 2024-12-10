import BoardPresenter from '../src/presenter/board-presenter';

const mainContainer = document.querySelector('.trip-events');

new BoardPresenter(mainContainer).init();
