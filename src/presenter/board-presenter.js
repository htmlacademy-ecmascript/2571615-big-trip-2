import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import FiltersView from '../view/filters-view';
import {render} from '../render';

export default class BoardPresenter {

  sortComponent = new SortView();
  pointsListComponent = new PointsListView();
  filterComponent = new FiltersView();

  container = null;
  filterContainer = document.querySelector('.trip-controls__filters');

  model = {};

  constructor(container, model) {
    this.container = container;
    this.model = model;
  }

  init () {
    render(this.filterComponent, this.filterContainer);
    render(this.sortComponent, this.container);
    render(this.pointsListComponent, this.container);
    render(new FormEditView(this.model.getResolvedPointsArray()[0]), this.pointsListComponent.getElement());

    this.model.getResolvedPointsArray().forEach((point) => {
      render(new PointView(point), this.pointsListComponent.getElement());
    });

  }

}
