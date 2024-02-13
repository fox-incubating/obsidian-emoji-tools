import { App, Editor, Modal } from 'obsidian'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import EmojiToolbar from './ui/EmojiToolbar.tsx'

export function checkForInputBlock(
	cmEditor: CodeMirror.Editor,
	cursorPos: CodeMirror.Position,
): boolean {
	const tokenType = cmEditor.getTokenAt(cursorPos, true).type
	return (
		typeof tokenType !== 'string' ||
		(tokenType.indexOf('code') === -1 && tokenType.indexOf('math') === -1)
	) // "code" matches "inline-code" or "codeblock"
}
const DEF_DELAY = 1000
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY))
}

function insertText(app: App, editor: Editor, text: string) {
	if (text.length === 0 || text == null) return
	const cursor = editor.getCursor('from')
	editor.replaceRange(text, cursor, cursor)
	app.commands.executeCommandById('editor:focus')
	app.workspace.activeLeaf.view.editor.exec('goRight')
}

export class EmojiModal extends Modal {
	private reactComponent: React.ReactElement

	constructor(app: App, theme: string, isNative: boolean, editor: Editor) {
		super(app)
		this.reactComponent = React.createElement(EmojiToolbar, {
			onEmojiSelect: async (emoji: any) => {
				this.close()
				await sleep(10)
				insertText(app, editor, emoji.native)
			},
			onClickOutside() {
				this.close()
			},
			onClose: () => {
				this.close()
			},
			theme: theme,
			isNative: isNative,
		})
	}

	async onOpen() {
		this.titleEl.empty()
		this.modalEl.id = 'emoji-modal'

		const root = createRoot(this.contentEl)
		root.render(this.reactComponent)
	}

	onClose() {
		this.contentEl.empty()
	}
}
