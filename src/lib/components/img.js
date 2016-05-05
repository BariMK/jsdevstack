import React from 'react'
import {PureRenderComponent} from './base'

/**
 * Use this component for displaying of all images (html <img /> tag).
 * Loading of such images will be deferred and is optimized for
 * critical-path loading.
 */
export default class AsyncImg extends PureRenderComponent {

	render() {
		return (
			<img
				src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
				data-src={this.props.src}
				alt={this.props.alt}
			/>
		)
	}
}

AsyncImg.propTypes = {
	src: React.PropTypes.string.isRequired,
	alt: React.PropTypes.string,
}
