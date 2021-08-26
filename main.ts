import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import dedent from "ts-dedent";
import { rules, parseOptions, rulesDict } from "./rules";

interface LinterSettings {
	enabledRules: string;
	lintOnSave: boolean;
}

const DEFAULT_SETTINGS: LinterSettings = {
	enabledRules: dedent`
		trailing-spaces
		heading-blank-lines
		space-after-list-markers
		`,
	lintOnSave: false,
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

		// Source for save setting
		// https://github.com/hipstersmoothie/obsidian-plugin-prettier/blob/main/src/main.ts
		const saveCommandDefinition = (this.app as any).commands?.commands?.[
			"editor:save-file"
		];
		const save = saveCommandDefinition?.callback;

		if (typeof save === "function") {
			saveCommandDefinition.callback = () => {
				if (this.settings.lintOnSave) {
					const editor = this.app.workspace.getActiveViewOfType(MarkdownView).editor;
					this.runLinter(editor);
				}

				save();
			};
		}

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
		const scroll = editor.getScrollInfo();
		let text = editor.getValue();
		const enabledRules = this.settings.enabledRules.split("\n");

		for (const line of enabledRules) {
			if (line.match(/^\s*$/) || line.startsWith("// ")) {
				continue;
			}

			// Split the line into the rule name and the rule options
			const ruleName = line.split(/\s+/)[0];

			if (ruleName in rulesDict) {
				const options: { [id: string]: string; } = parseOptions(line);

				if(options) {
					text = rulesDict[ruleName].apply(text, options);
				}
				else {
					text = rulesDict[ruleName].apply(text);
				}
			}
			else {
				new Notice(`Rule ${ruleName} not recognized`);
			}
		}

		editor.setValue(text);
		editor.setCursor(cursor);
		editor.scrollTo(scroll.left, scroll.top);
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
		
		new Setting(containerEl)
			.setName("Lint on save")
			.setDesc("Lint the file on save")
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.lintOnSave)
					.onChange(async (value) => {
						this.plugin.settings.lintOnSave = value;
						await this.plugin.saveSettings()});
			});
	}
}