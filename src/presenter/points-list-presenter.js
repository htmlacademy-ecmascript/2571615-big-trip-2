import PointsListView from '../view/points-list-view';
import PointPresenter from './point-presenter.js';
import EmptyPointsListView from '../view/empty-view.js';
import {render, replace, remove} from '../framework/render.js';

export default class PointsListPresenter {

  #container = null;
  #pointsListComponent = null;
  #prevListComponent = null;
  #emptyListComponent = null;
  #emptyPointsListContainer = document.querySelector('.trip-events');
  #points;
  #patchCurrentStateOfPoints;
  #currentEditId = {editID: undefined};
  #filteredState = null;

  pointPresenters = [];

  #currentEditIdController = (id) => {
    const currentID = this.#currentEditId.editID;
    if(currentID) {
      this.pointPresenters.at(-1)[currentID].replaceEditFormToPoint(); //закрываем текущую форму ред.
    }
    this.#currentEditId.editID = id;
  };

  init(points) {
    this.#points = points;
    this.renderPointsList(this.#points);
  }

  destroy(component){
    if(component) {
      remove(component);
      component = null;
    }
  }

  renderPointsList = (points) => {

    if (!points || points.length === 0) {
      this.destroy(this.#pointsListComponent);
      this.destroy(this.#prevListComponent);
      this.destroy(this.#emptyListComponent);
      this.#emptyListComponent = new EmptyPointsListView(this.#filteredState.currentFilterMessage);
      render(this.#emptyListComponent, this.#emptyPointsListContainer);
      return;
    }

    this.destroy(this.#emptyListComponent);

    this.#pointsListComponent = new PointsListView();

    const modifiedPointPresenters = {};
    points.forEach((point) => {
      modifiedPointPresenters[point.id] = new PointPresenter(this.#pointsListComponent, this.#currentEditId, this.#currentEditIdController, this.#patchCurrentStateOfPoints);
      modifiedPointPresenters[point.id].renderPoint(point);
    });
    this.pointPresenters.push(modifiedPointPresenters);


    if(this.#prevListComponent === null) {
      render(this.#pointsListComponent, this.#container);
    } else {
      replace(this.#pointsListComponent, this.#prevListComponent);
    }
    this.#prevListComponent = this.#pointsListComponent;
  };


  constructor (container, patchCurrentStateOfPoints, filteredState) {
    this.#container = container;
    this.#patchCurrentStateOfPoints = patchCurrentStateOfPoints;
    this.#filteredState = filteredState;
  }

}
