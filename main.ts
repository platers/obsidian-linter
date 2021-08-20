import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { rules, Rule, rulesDict } from "./rules";

interface LinterSettings {
	enabledRules: string[];
}

const DEFAULT_SETTINGS: LinterSettings = {
	enabledRules: [
		"trailing-spaces",
		"heading-blank-lines",
		"space-after-list-markers",
	]
}

export default class LinterPlugin extends Plugin {
	settings: LinterSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "lint-file",
			name: "Lint the current file",
			editorCallback: (editor) => this.runLinter(editor),
			hotkeys: [
				{
				  modifiers: ["Mod", "Alt"],
				  key: "l",
				},
			  ],
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	runLinter(editor: Editor) {
		console.log("running linter");

		const view = this.app.workspace.activeLeaf.view;
		const cursor = editor.getCursor();
		let text = editor.getValue();

		for (const rule of this.settings.enabledRules) {
			if (rule.match(/^\s*$/) || rule.startsWith("// ")) {
				continue;
			}
			if (rule in rulesDict) {
				text = rulesDict[rule].apply(text);
			} else {
				new Notice(`Rule ${rule} not recognized`);
			}
		}

		editor.setValue(text);
		editor.setCursor(cursor);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: LinterPlugin;

	constructor(app: App, plugin: LinterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h2", {text: "Settings for Linter"});

		new Setting(containerEl)
			.setName("Rules to apply")
			.setDesc("List the rules to apply to the markdown file")
			.addTextArea(text => {
				text
					.setValue(this.plugin.settings.enabledRules.join("\n"))
					.onChange(async (value) => {
						this.plugin.settings.enabledRules = value.split("\n");
						await this.plugin.saveSettings()});
				text.inputEl.rows = 20;
				text.inputEl.cols = 40;
			});
	}
}
