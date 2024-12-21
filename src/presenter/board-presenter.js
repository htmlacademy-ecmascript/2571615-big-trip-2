import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import FiltersView from '../view/filters-view.js';
import {render, replace} from '../framework/render.js';


export default class BoardPresenter {

  constructor(container, model, filterContainer) {
    this.container = container;
    this.model = model;
    this.filtersContainer = filterContainer;

    this.currentStateOfPoints = this.model.getResolvedPoints();
    this.filters = this.model.filters;
    this.sortOptions = model.sortOptions;

    //this.sortComponent = new SortView(this.sortOptions, this.#onSortClickHandler);
    this.pointsListComponent = new PointsListView();
    this.filtersComponent = new FiltersView(this.filters, this.#onFilterClickHandler);
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderPointsList(this.currentStateOfPoints);

  }

  renderFilters() {
    render(this.filtersComponent, this.filtersContainer);
  }

  renderSort() {
    if(this.sortComponent) {
      this.sortComponent.element.remove();
    }
    this.sortComponent = new SortView(this.sortOptions, this.#onSortClickHandler);
    render(this.sortComponent, this.container);
  }

  renderPointsList(points) {
    if (!points || points.length === 0) {
      // TODO
      return;
    }
    render(this.pointsListComponent, this.container);
    this.pointsListComponent.element.innerHTML = '';
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

  #onFilterClickHandler = (evt) => {
    const sortItem = evt.target.closest('.trip-filters__filter');

    if (sortItem) {
      const currentFilter = sortItem.querySelector('.trip-filters__filter-input');
      const allPoints = this.model.getResolvedPoints();
      let filteredPoints = [];

      switch (currentFilter.value) {
        case 'everything':
          filteredPoints = allPoints;
          break;
        case 'future':
          filteredPoints = allPoints.filter((point) => new Date(point.dateFrom) > new Date());
          break;
        case 'present':
          filteredPoints = allPoints.filter((point) => (new Date(point.dateFrom) < new Date()) && (new Date(point.dateTo) > new Date()));
          break;
        case 'past':
          filteredPoints = allPoints.filter((point) => new Date(point.dateTo) < new Date());
          break;
        default:
          filteredPoints = allPoints;
          break;
      }

      this.currentStateOfPoints = filteredPoints;
      this.renderPointsList(this.currentStateOfPoints);
    }
  };

  #onSortClickHandler = (evt) => {
    const sortItem = evt.target.closest('.trip-sort__item');

    if (sortItem) {
      const currentFilter = sortItem.querySelector('.trip-sort__input');
      const allPoints = this.model.getResolvedPoints();
      let sortedPoints = [];

      switch (currentFilter.value) {
        case 'sort-time':
          this.sortOptions.isChecked.time = true;
          this.sortOptions.isChecked.price = false;
          sortedPoints = allPoints.sort((a, b) => (new Date(a.dateTo) - new Date(a.dateFrom)) - (new Date(b.dateTo) - new Date(b.dateFrom)));
          this.currentStateOfPoints = sortedPoints;
          this.renderSort();
          this.renderPointsList(this.currentStateOfPoints);
          break;
        case 'sort-price':
          this.sortOptions.isChecked.price = true;
          this.sortOptions.isChecked.time = false;
          sortedPoints = allPoints.sort((a, b) => a.basePrice - b.basePrice);
          this.currentStateOfPoints = sortedPoints;
          this.renderSort();
          this.renderPointsList(this.currentStateOfPoints);
          break;
      }
    }
  };

}

