import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import FiltersView from '../view/filters-view';
import { render } from '../render';

export default class BoardPresenter {

  constructor(container, model, filterContainer) {
    this.container = container;
    this.model = model;
    this.filtersContainer = filterContainer;

    this.sortComponent = new SortView();
    this.pointsListComponent = new PointsListView();
    this.filtersComponent = new FiltersView();
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderFormEditView();
    this.renderPointsList();

  }

  renderFilters() {
    render(this.filtersComponent, this.filtersContainer);
  }

  renderSort() {
    render(this.sortComponent, this.container);
  }

  renderPointsList() {
    const points = this.model.getResolvedPoints();

    if (!points || points.length === 0) {
      // TODO
      return;
    }

    render(this.pointsListComponent, this.container);
    points.forEach((point) => this.renderPoint(point));
  }

  renderPoint(point) {
    render(new PointView(point), this.pointsListComponent.getElement());
  }

  renderFormEditView() {
    const points = this.model.getResolvedPoints();
    if (points.length > 0) {
      render(new FormEditView(points[0]), this.pointsListComponent.getElement());
    }
  }

}

