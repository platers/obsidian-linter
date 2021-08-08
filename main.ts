import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { rules, Rule } from "./rules";

interface LinterSettings {
	enabledRules: string[];
}

const DEFAULT_SETTINGS: LinterSettings = {
	enabledRules: [
		"trailing-spaces",
		"headings-should-be-surrounded-by-blank-lines",
		"space-after-list-markers",
	]
}

export default class LinterPlugin extends Plugin {
	settings: LinterSettings;
	rulesDict: { [key: string]: Rule };

	async onload() {
		await this.loadSettings();

		this.rulesDict = rules.reduce((dict, rule) => (dict[rule.alias()] = rule, dict), {} as Record<string, Rule>);

		this.addCommand({
			id: "lint-file",
			name: "Lint the current file",
			callback: () => this.runLinter(),
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

	runLinter() {
		console.log("running linter");

		const view = this.app.workspace.activeLeaf.view;
		if (view instanceof MarkdownView) {
			const editor = view.editor;
			const cursor = editor.getCursor();
			let text = editor.getValue();

			for (const rule of this.settings.enabledRules) {
				if (rule.match(/\s*/) || rule.startsWith("// ")) {
					continue;
				}
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
				text.inputEl.rows = 8;
				text.inputEl.cols = 40;
			});
	}
}
