import FiltersView from '../view/filters-view.js';
import {render, replace} from '../framework/render.js';
import {filters} from '../constants/filters.js';

export default class FilterPresenter {

  #container;
  #patchStateCallback;
  #filtersComponent = null;
  #prevFiltersComponent = null;
  #filters = filters;
  #currentFilter;
  #currentFilterMessage = undefined;

  renderFilters() {

    this.#filtersComponent = new FiltersView(this.#filters, this.#onFilterClickHandler);

    if(this.#prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#container);
    } else {
      replace(this.#filtersComponent, this.#prevFiltersComponent);
    }
    this.#prevFiltersComponent = this.#filtersComponent;
  }

  #updateFilters = (selectedValue) => {
    this.#filters.forEach((filter) => {
      filter['checked'] = (filter.value === selectedValue);
    });
  };

  #updateState = (callback) => {
    this.#patchStateCallback(callback, this.#currentFilterMessage);
    this.renderFilters();
  };

  #filterActions = {
    everything: () => {
      this.#currentFilter = 'everything';
      this.#currentFilterMessage = 'Click New Event to create your first point';
      this.#updateFilters('everything');
      this.#updateState((state) => state);
    },
    future: () => {
      this.#currentFilter = 'future';
      this.#currentFilterMessage = 'There are no future events now';
      this.#updateFilters('future');
      this.#updateState((state) => state.filter((point) => new Date(point.dateFrom) > new Date()));
    },
    present: () => {
      this.#currentFilter = 'present';
      this.#currentFilterMessage = 'There are no present events now';
      this.#updateFilters('present');
      this.#updateState((state) => state.filter((point) => (new Date(point.dateFrom) < new Date()) && (new Date(point.dateTo) > new Date())
      ));
    },
    past: () => {
      this.#currentFilter = 'past';
      this.#currentFilterMessage = 'There are no past events now';
      this.#updateFilters('past');
      this.#updateState((state) => state.filter((point) => new Date(point.dateTo) < new Date()));
    }
  };

  #onFilterClickHandler = (evt) => {

    const sortItem = evt.target.closest('.trip-filters__filter');
    if (sortItem) {
      const currentFilter = sortItem.querySelector('.trip-filters__filter-input');
      if(currentFilter !== this.#currentFilter) {
        const action = this.#filterActions[currentFilter.value];
        action();
      }

    }

  };

  constructor (container, patchFilterStateCallback) {
    this.#container = container;
    this.#patchStateCallback = patchFilterStateCallback;
  }

  init() {
    this.renderFilters();
  }

}
