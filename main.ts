import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { rules, Rule } from './rules';

interface MyPluginSettings {
	enabledRules: string[];
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	enabledRules: [
		'trailing-spaces',
		'headings-should-be-surrounded-by-blank-lines',
		'space-after-list-markers',
	]
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	rulesDict: { [key: string]: Rule };

	async onload() {
		console.log('loading linter plugin');

		await this.loadSettings();

		this.rulesDict = rules.reduce((dict, rule) => (dict[rule.alias()] = rule, dict), {} as Record<string, Rule>);

		this.addCommand({
			id: 'lint-file',
			name: 'Lint the current file',
			callback: () => this.runLinter(),
			hotkeys: [
				{
				  modifiers: ["Mod", "Alt"],
				  key: "l",
				},
			  ],
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading linter plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	runLinter() {
		console.log('running linter');

		const view = this.app.workspace.activeLeaf.view;
		if (view instanceof MarkdownView) {
			const editor = view.editor;
			const cursor = editor.getCursor();
			let text = editor.getValue();
			for (const rule of this.settings.enabledRules) {
				if (rule in this.rulesDict) {
					text = this.rulesDict[rule].apply(text);
				} else {
					new Notice(`Rule ${rule} not recognized`);
				}
			}
			editor.setValue(text);
			editor.setCursor(cursor);
		}
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Linter.'});

		new Setting(containerEl)
			.setName('Rules to apply')
			.setDesc('List the rules to apply to the markdown file')
			.addTextArea(text => {
				text
					.setValue(this.plugin.settings.enabledRules.join('\n'))
					.onChange(async (value) => {
						this.plugin.settings.enabledRules = value.split('\n');
						await this.plugin.saveSettings()});
				text.inputEl.rows = 8;
				text.inputEl.cols = 40;
			});
	}
}
