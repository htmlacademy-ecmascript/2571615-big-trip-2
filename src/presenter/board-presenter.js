import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import FiltersView from '../view/filters-view';
import {render, replace} from '../framework/render.js';


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
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new PointView({
      point,
      onEditClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const formEditComponent = new FormEditView({
      point,
      onFormSubmit: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });
    function replacePointToEditForm() {
      replace(formEditComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, formEditComponent);
    }

    render(pointComponent, this.pointsListComponent.element);
  }

}

