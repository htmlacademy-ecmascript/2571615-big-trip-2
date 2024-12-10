import {destinationsMockArray} from '../mocks/destinations-mock';
import {offersMockArray} from '../mocks/offers-mock';
import {pointsMockArray} from '../mocks/points-mock';

export default class Model {
  rawPointsArray = pointsMockArray;
  rawDestinationsArray = destinationsMockArray;
  rawOffersArray = offersMockArray;

  resolvedPointsArray = [];

  setResolvedPointsArray() {
    return this.rawPointsArray.map((point)=> ({
      ...point,
      destination: this.rawDestinationsArray.find((destination)=>destination.id === point.destination),
      offers: point.offers.map((offer)=>this.rawOffersArray
        .find((item)=>item.type === point.type).offers
        .find((item)=>item.id === offer)),
      allOffersArray: this.rawOffersArray.find((offer)=>offer.type === point.type).offers,
    }));
  }

  getResolvedPointsArray() {
    return this.resolvedPointsArray;
  }

  init() {
    this.resolvedPointsArray = this.setResolvedPointsArray();
  }

}
