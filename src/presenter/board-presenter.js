import PointsListPresenter from './points-list-presenter.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';

export default class BoardPresenter {

  #filterPresenter;
  #sortPresenter;
  #pointsListPresenter;
  #pointPresenters;

  #mainState = {
    initialStateOfPoints: null,
    currentStateOfPoints: [],
    subscribers: [],
    subscribeCallback(cb){
      this.subscribers.push(cb);
    }
  };

  #filteredState = {
    filteredStateOfPoints: [],
    currentFilterMessage: undefined,
    subscribers: [],
    subscribeCallback(cb){
      this.subscribers.push(cb);
    }
  };

  #sortedState = {
    sortedStateOfPoints: [],
    subscribers: [],
    subscribeCallback(cb){
      this.subscribers.push(cb);
    }
  };

  patchCurrentStateOfPoints = (point) => {
    const newCurrentStateOfPoints = this.#mainState.currentStateOfPoints.map((item)=> item.id === point.id ? point : item);
    this.#mainState.currentStateOfPoints.push(newCurrentStateOfPoints);
    this.#mainState.subscribers.forEach((subscriber) => subscriber(point));
  };

  currentStateOfPointsSubscriber = (point) => this.#pointPresenters.at(-1)[point.id].renderPoint(point);

  patchFilteredState = (cb, filter) => {
    const newFilteredState = cb([...this.#mainState.currentStateOfPoints]);
    this.#filteredState.filteredStateOfPoints.push(newFilteredState);
    this.#filteredState.currentFilterMessage = filter;
    this.#filteredState.subscribers.forEach((subscriber) => subscriber(newFilteredState));
  };

  patchSortedState = (cb) => {
    const lastState = this.#filteredState.filteredStateOfPoints.at(-1);
    const newSortedState = cb([...lastState]);
    if(newSortedState.length > 0) {
      this.#sortedState.sortedStateOfPoints.push(newSortedState);
      this.#sortedState.subscribers.forEach((subscriber) => subscriber(newSortedState));
    }
  };

  constructor(container, model, filterContainer) {

    this.container = container;
    this.model = model;
    this.#mainState.initialStateOfPoints = this.model.getResolvedPoints();
    this.#mainState.currentStateOfPoints = this.#mainState.initialStateOfPoints;
    this.#filteredState.filteredStateOfPoints.push(this.#mainState.initialStateOfPoints);

    this.#pointsListPresenter = new PointsListPresenter(this.container, this.patchCurrentStateOfPoints, this.#filteredState);
    this.#pointPresenters = this.#pointsListPresenter.pointPresenters;

    this.filtersContainer = filterContainer;
    this.#filterPresenter = new FilterPresenter(this.filtersContainer, this.patchFilteredState);

    this.sortContainer = document.querySelector('.trip-events');
    this.#sortPresenter = new SortPresenter(this.sortContainer, this.patchSortedState);

    this.#mainState.subscribeCallback(this.currentStateOfPointsSubscriber);
    this.#filteredState.subscribeCallback(this.#pointsListPresenter.renderPointsList);
    this.#filteredState.subscribeCallback(this.#sortPresenter.sortActions['sort-day']);
    this.#sortedState.subscribeCallback(this.#pointsListPresenter.renderPointsList);

  }

  init() {
    this.#filterPresenter.init();
    this.#sortPresenter.init();
    this.#pointsListPresenter.init(this.#mainState.initialStateOfPoints);
  }

}

