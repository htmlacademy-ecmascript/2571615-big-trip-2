import {destinationsMock} from '../mocks/destinations-mock';
import {offersMock} from '../mocks/offers-mock';
import {pointsMock} from '../mocks/points-mock';

export default class Model {
  rawPoints = pointsMock;
  rawDestinations = destinationsMock;
  rawOffers = offersMock;

  resolvedPoints = [];

  constructor() {
    this.createDestinationsMap();
    this.createOffersMap();
    this.createResolvedPoints();
  }

  createDestinationsMap() {
    this.destinationsMap = this.rawDestinations.reduce((acc, destination) => {
      acc[destination.id] = destination;
      return acc;
    }, {});
  }

  createOffersMap() {
    this.offersMap = this.rawOffers.reduce((acc, offer) => {
      acc[offer.type] = offer.offers.reduce((offerAcc, item) => {
        offerAcc[item.id] = item;
        return offerAcc;
      }, {});
      return acc;
    }, {});
  }

  createResolvedPoints() {
    this.resolvedPoints = this.rawPoints.map((point) => {
      const destination = {...this.destinationsMap[point.destination]};
      const checkedOffers = point.offers.map((offerId) => {
        if (this.offersMap[point.type]) {
          return this.offersMap[point.type][offerId];
        }
        return null;
      }).filter(Boolean);

      const utilOffersMap = new Map();

      const pointOffers = [];

      Object.values(this.offersMap[point.type]).forEach((offer)=>{
        utilOffersMap.set(offer, structuredClone(offer));
      });

      utilOffersMap.forEach((clonedOffer, offer) => {
        clonedOffer['isChecked'] = checkedOffers.includes(offer);
        pointOffers.push(clonedOffer);
      });

      return {
        ...point,
        destination,
        pointOffers,
      };
    });
  }

  getResolvedPoints() {
    return this.resolvedPoints;
  }

  init() {
    if (this.resolvedPoints.length > 0) {
      //ToDo;
    }
  }
}

