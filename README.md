<p align="center">
  <a href="https://sigeosrl.com/" rel="noopener" target="_blank"><img width="280" src="https://sigeosrl.eu/wp-content/uploads/2018/07/SigeoDarkRetina-350x92.png" alt="SIGEO logo"></a></p>
</p>

# OL Map management
OL Map wrapper for make your life easier 

We working on ***live demo***, give us little more time!

## Installation
OL Map wrapper is available as an [npm package](https://www.npmjs.com/package/@sigeo/ol-map-management).

```sh
// With npm
npm install @sigeo/ol-map-management

// With yarn
yarn add @sigeo/ol-map-management
```

## Usage
Here is a quick example to get you started, **it's all you need**:

```jsx
import React, { PureComponent }  from 'react';
import ReactDOM from 'react-dom';
import Map from '@sigeo/ol-map-management';

class App extends PureComponent {
  componentDidMount () {
    Map.create({
      target: 'map',
      view: new View({
        zoom: config.map.zoom
      })
    });
  }

  render () {
    return (
      ...
      <div id="map" /> 
      ...     
    ) 
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

## License
Copyright © 2019 [Sigeo S.R.L](https://sigeosrl.com/)

Licensed under a GPL3+ license: http://www.gnu.org/licenses/gpl-3.0.txt
