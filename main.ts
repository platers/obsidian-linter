import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import dedent from "ts-dedent";
import { rules, Rule, rulesDict } from "./rules";

interface LinterSettings {
	enabledRules: string;
}

const DEFAULT_SETTINGS: LinterSettings = {
	enabledRules: dedent`
		trailing-spaces
		heading-blank-lines
		space-after-list-markers
		`
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

		const cursor = editor.getCursor();
		let text = editor.getValue();
		const lines = this.settings.enabledRules.split("\n");

		for (const line of lines) {
			if (line.match(/^\s*$/) || line.startsWith("// ")) {
				continue;
			}

			const tokens = line.split(" ");
			if (tokens.length == 0) {
				continue;
			}

			const rule = tokens[0];

			if (rule in rulesDict) {
				const args = tokens.slice(1);

				if(args.length == 0) {
					text = rulesDict[rule].apply(text);
				}
				else {
					const options: {[id: string] : string} = {};

					for (const arg of args) {
						if (arg.indexOf("=") == -1) {
							new Notice(`Invalid argument format in ${line}`);
							continue;
						}
						const [key, value] = arg.split("=");
						options[key] = value;
					}
					text = rulesDict[rule].apply(text, options);
				}
			}
			else {
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
					.setValue(this.plugin.settings.enabledRules)
					.onChange(async (value) => {
						this.plugin.settings.enabledRules = value;
						await this.plugin.saveSettings()});
				text.inputEl.rows = 20;
				text.inputEl.cols = 40;
			});
	}
}
