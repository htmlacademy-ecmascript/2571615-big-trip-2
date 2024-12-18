import { pointsMock } from '../mocks/points-mock.js';
import AbstractView from '../framework/view/abstract-view.js';

const pointsTypes = pointsMock.map((point)=>point.type);

function createFormEditTemplate(point) {

  const offersMarkup = point.pointOffers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.title.toLowerCase().replace(/\s+/g, '-')}" ${offer.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type event__type-btn" for="event-type-toggle-${point.id}">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${pointsTypes.map((type) => `
                        <div class="event__type-item">
                          <input id="event-type-${type}-${point.id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
                          <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${point.id}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                        </div>
                      `).join('')}
                    </fieldset>
                  </div>
                </div>
                <div class="event__field-group event__field-group--destination">
                  <label class="event__label event__type-output" for="event-destination-${point.id}">Flight</label>
                  <input class="event__input event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${point.destination.name}" list="destination-list-${point.id}">
                  <datalist id="destination-list-${point.id}">
                    <option value="Amsterdam"></option>
                    <option value="Geneva"></option>
                    <option value="${point.destination.name}"></option>
                  </datalist>
                </div>
                <div class="event__field-group event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
                  <input class="event__input event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${new Date(point.dateFrom).toLocaleString()}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
                  <input class="event__input event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${new Date(point.dateTo).toLocaleString()}">
                </div>
                <div class="event__field-group event__field-group--price">
                  <label class="event__label" for="event-price-${point.id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${(point.basePrice / 100).toFixed(2)}">
                </div>
                <button class="event__save-btn btn btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section event__section--offers">
                  <h3 class="event__section-title event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                    ${offersMarkup}
                  </div>
                </section>
                <section class="event__section event__section--destination">
                  <h3 class="event__section-title event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${point.destination.description}</p>
                </section>
              </section>
            </form>
          </li>`;
}

export default class FormEditView extends AbstractView {

  #point = {};
  #handleFormSubmit = null;


  constructor({point, onFormSubmit}) {
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmitHandler);

  }

  get template() {
    return createFormEditTemplate(this.#point);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}


