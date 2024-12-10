import BoardPresenter from '../src/presenter/board-presenter';
import Model from './model/model';

const mainContainer = document.querySelector('.trip-events');
const model = new Model();
model.init();

new BoardPresenter(mainContainer, model).init();
