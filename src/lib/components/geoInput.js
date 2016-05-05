import React, {PropTypes} from 'react'
import {List, Map} from 'immutable'
import BaseInput from './baseinput'
import {PureRenderComponent} from './base'
//import {localize} from '../../locale/localize'
import geocoder from '../geocode/geoUtils'

const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;

const getNextPrevValue = (location, geocodes) => {

  let result = new Map();
  if(location && (!geocodes || !geocodes.isEmpty())) {

    let prev;
    let cur;
    let next;
    geocodes.forEach(x => {
      if (x.name === location)
        cur = x;
      else if (cur && !next)
        next = x;
      else if (!cur)
        prev = x;
    });
    if (!next)
      next = geocodes.first();
    if (!prev)
      prev = geocodes.last();

    result = result.setIn(['prev'], new Map(prev));
    result = result.setIn(['cur'], new Map(cur));
    result = result.setIn(['next'], new Map(next));
  }
  return result;
}

export default class GeocodeInput extends PureRenderComponent {

  static propTypes = {
    idField: PropTypes.string,
    label: PropTypes.string,
    data: PropTypes.object.isRequired,
    onUpdateGeoInput: PropTypes.func.isRequired,
    onSelectLocation: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  render() {

    const {idField, label, className, data} = this.props
    const formData = idField ? data.get(idField) : data;

    const style = className ? 'control-geocoder ' + className : 'control-geocoder'
    return (
      <div id={idField} className={style}>
        <BaseInput
            label={label}
            idField='location'
            type='text'
            name='location'
            onChange={({target: {name, value}}) => this.props.onUpdateGeoInput({location: value})}
            onEnter={() => this._onEnter(formData)}
            value={formData.location}
            onKeyDown={(event) => this._onKeyDown(event, formData)}
        />
        <GeoResultList
            data={formData.geocodeResults}
            location={formData.location}
            onSelectLocation={(geoPoint) => this.selectLocation(geoPoint)}/>
      </div>
      )
}

  _onKeyDown(event, data) {
    if (event.keyCode === UP_KEY_CODE || event.keyCode === DOWN_KEY_CODE) {
      if(data.location && (!data.geocodeResults || !data.geocodeResults.isEmpty())) {
        const result = getNextPrevValue(data.location, data.geocodeResults);

        if (event.keyCode === UP_KEY_CODE) {
          this.props.onUpdateGeoInput({location: result.getIn(['prev', 'name'])});
        } else if (event.keyCode === DOWN_KEY_CODE) {
          this.props.onUpdateGeoInput({location: result.getIn(['next', 'name'])});
        }
      }
    }
  }

  _onEnter(data){
    if (data.location && (!data.geocodeResults || data.geocodeResults.isEmpty())) {
      this.onGeocode(data)
    } else {
      const result = getNextPrevValue(data.location, data.geocodeResults);
      const cur = result.get('cur');

      if(!cur || cur.isEmpty()) {
        this.onGeocode(data)
      } else {
        this.selectLocation(result.get('cur').toJS());
      }
    }
  }

  onGeocode(point){
    geocoder().location(point.location).geocode()
      .onManyResults((results) => {
        this.props.onUpdateGeoInput({geocodeResults: new List(results)});
      })
      .onSingleResults((results) => {
        this.selectLocation(results[0]);
      })
      .onError(() => {
        console.log(`Error...`)
      })
  }

  selectLocation(point){
    this.props.onUpdateGeoInput({location: point.name,
      geocodeResults: new List(), lat: point.center.lat, lng: point.center.lng});
    this.props.onSelectLocation(point);
  }
}

class GeoResultList extends PureRenderComponent {

  static propTypes = {
    data: PropTypes.instanceOf(List),
    location: PropTypes.string,
    onSelectLocation: PropTypes.func.isRequired
  };

  render() {

    const formData = this.props.data;

    var georesults = [];
    if(formData)
      formData.forEach((element, id) => {
        let focus = '';
        if(this.props.location && this.props.location === element.name) {
          focus = 'selected';
        }
        georesults.push(
        <li className={'themed ' + focus} key={id}>
          <p onClick={() => this.props.onSelectLocation(element)}>{element.name}</p>
        </li>)
      })
    return (
      <ul className='themed control-geocoder-alternatives'>{georesults}</ul>
    )
  }
}