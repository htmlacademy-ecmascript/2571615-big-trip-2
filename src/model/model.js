import {destinationsMockArray} from '../mocks/destinations-mock';
import {offersMockArray} from '../mocks/offers-mock';
import {pointsMockArray} from '../mocks/points-mock';

export default class Model {
  rawPointsArray = pointsMockArray;
  rawDestinationsArray = destinationsMockArray;
  rawOffersArray = offersMockArray;

  resolvedPointsArray = [];

  constructor() {
    if (!Array.isArray(this.rawDestinationsArray) || !Array.isArray(this.rawOffersArray)) {
      throw new Error('Invalid input data: destinationsArray or offersArray is not an array');
    }

    this.destinationsMap = this.createDestinationsMap(this.rawDestinationsArray);
    this.offersMap = this.createOffersMap(this.rawOffersArray);
  }

  createDestinationsMap(destinations) {
    return destinations.reduce((acc, destination) => {
      if (destination && destination.id) {
        acc[destination.id] = destination;
      } else {
        throw new Error('Invalid destination data');
      }
      return acc;
    }, {});
  }

  createOffersMap(offersArray) {
    return offersArray.reduce((acc, offer) => {
      if (offer && offer.type && Array.isArray(offer.offers)) {
        acc[offer.type] = offer.offers.reduce((offerAcc, item) => {
          if (item && item.id) {
            offerAcc[item.id] = item;
          } else {
            throw new Error('Invalid offer item');
          }
          return offerAcc;
        }, {});
      } else {
        throw new Error('Invalid offer data');
      }
      return acc;
    }, {});
  }

  setResolvedPointsArray() {
    if (!Array.isArray(this.rawPointsArray)) {
      throw new Error('Invalid rawPointsArray data');
    }

    return this.rawPointsArray.map((point) => {
      const destination = this.destinationsMap[point.destination];
      const offers = point.offers.map((offerId) => {
        if (this.offersMap[point.type]) {
          return this.offersMap[point.type][offerId];
        }
        return null;
      }).filter(Boolean);

      const allOffersArray = Object.values(this.offersMap[point.type]) || [];

      return {
        ...point,
        destination,
        offers,
        allOffersArray,
      };
    });
  }

  getResolvedPointsArray() {
    return this.resolvedPointsArray;
  }

  init() {
    if (!this.resolvedPointsArray.length) {
      this.resolvedPointsArray = this.setResolvedPointsArray();
    }
  }
}

