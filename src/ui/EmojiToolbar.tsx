import Picker from '@emoji-mart/react'
// @ts-expect-error
import twitterData from '@emoji-mart/data'
import * as React from 'react'

export default class EmojiToolbar extends React.Component {
	constructor(props) {
		super(props)
		this.onClose = props.onClose
		this.theme = props.theme
	}

	handleClickOutside = (evt: MouseEvent) => {
		this.onClose()
	}

	render() {
		return (
			<div>
				<Picker
					onEmojiSelect={this.props.onEmojiSelect}
					onClickOutside={this.props.handleClickOutside}
					onClose={this.props.onClose}
					autoFocus={true}
					native={this.props.isNative}
					data={twitterData}
					theme={this.props.theme}
				/>
			</div>
		)
	}
}
