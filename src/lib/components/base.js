import React from 'react'
import PureComponent from 'react-pure-render/component';


/**
 * Allows using this.context.router in component (see react-router) docs for more info
 */
export class RouterExposedComponent extends React.Component {}
RouterExposedComponent.contextTypes = {
	router: React.PropTypes.func.isRequired,
}



/**
 * PureRenderMixin replacement for React component ES6 classes.
 * https://github.com/facebook/react/blob/ed3e6ecb9b86b97c09428f40deb8c3ed695e73e8/src/addons/ReactComponentWithPureRenderMixin.js
 */
export class PureRenderComponent extends PureComponent {

}
