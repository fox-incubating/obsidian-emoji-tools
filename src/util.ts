import EmojiToolbar from './ui/EmojiToolbar'
import { Modal } from 'obsidian'

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

function insertText(editor: Editor, text: string) {
	if (text.length === 0 || text == null) return
	const cursor = editor.getCursor('from')
	editor.replaceRange(text, cursor, cursor)
	app.commands.executeCommandById('editor:focus')
	app.workspace.activeLeaf.view.editor.exec('goRight')
}

export class EmojiModal extends Modal {
	private div: HTMLElement
	private reactComponent: React.ReactElement

	constructor(app: App, theme: str, isNative: boolean, editor: Editor) {
		super(app)
		this.reactComponent = React.createElement(EmojiToolbar, {
			onSelect: async (emoji: EMoji) => {
				this.close()
				await sleep(10)
				insertText(editor, emoji.native)
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
		const { contentEl } = this
		ReactDOM.render(this.reactComponent, contentEl)
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}
