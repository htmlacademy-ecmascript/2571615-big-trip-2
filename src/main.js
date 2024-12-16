import BoardPresenter from '../src/presenter/board-presenter';
import Model from './model/model';

const mainContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const model = new Model();
model.init();

new BoardPresenter(mainContainer, model, filtersContainer).init();
