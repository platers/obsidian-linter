export const rules: { [name: string] : (text: string, params?: any) => string } = 
{
	"trailing_spaces" : (text: string) => {
		return text.replace(/[ \t]+$/gm, "");
	},
	"newlines_around_headings" : (text: string) => {
		return ignoreCodeBlocks(text, (text) => {
			text = text.replace(/\n*(#+ .*)\n+/g, "\n\n$1\n\n");
			return text.replace(/\n*(#+ .*)/g, "\n\n$1");
		});
	},
	"spaces_after_list_markers" : (text: string) => {
		// Space after marker
		text = text.replace(/^(\s*\d+\.|[-+*])\s+/gm, "$1 ");
		// Space after checkbox
		return text.replace(/^(\s*\d+\.|[-+*]\s+\[[ xX]\])\s+/gm, "$1 ");
	},
	"yaml_timestamp" : (text: string) => {
		text = initYAML(text);
		text = text.replace(/\ndate updated:.*\n/, "\n");
		const yaml_end = text.indexOf("\n---");
		return insert(text, yaml_end, `\ndate updated: ${new Date().toDateString()}`);
	},
	"compact_yaml" : (text: string) => {
		text = initYAML(text);
		text = text.replace(/^---\n+/, "---\n");
		return text.replace(/\n+---/, "\n---");
	},
	"header_increment" : (text: string) => {
		const lines = text.split("\n");
		let lastLevel = 0;
		for (let i = 0; i < lines.length; i++) {
			const headerRegex = /^(\s*)(#+)(\s*)(.*)$/;
			const match = lines[i].match(headerRegex);
			if (!match) {
				continue;
			}
			const level = match[2].length;
			if (level == 0) {
				continue;
			}
			if (level > lastLevel + 1) {
				lines[i] = lines[i].replace(headerRegex, `$1${"#".repeat(lastLevel + 1)}$3$4`);
			}
			lastLevel = level;
		}
		return lines.join("\n");
	},
	"multiple_consecutive_blank_lines" : (text: string) => {
		return text.replace(/\n{2,}/g, "\n\n");
	}
};

// Helper functions
function ignoreCodeBlocks(text: string, func: (text: string) => string) {
	const fencedBlockRegex = "```\n((.|\n)*)```";
	const indentedBlockRegex = "((\t|( {4})).*\n)+";
	const codeBlockRegex = new RegExp(`${fencedBlockRegex}|${indentedBlockRegex}`, "g");
	const placeholder = "PLACEHOLDER FOR CODE BLOCK 1038295"
	const matches = text.match(codeBlockRegex);

	text = text.replace(codeBlockRegex, placeholder);
	text = func(text);

	if (matches) {
		for (const match of matches) {
			text = text.replace(placeholder, match);
		}
	}

	return text;
}

function initYAML(text: string) {
	if (text.match(/^---\s*\n.*\n---\s*\n/s) === null) {
		text = "---\n---\n" + text;
		console.log("inserted yaml");
	}
	return text;
}

function insert(str: string, index: number, value: string) {
    return str.substr(0, index) + value + str.substr(index);
}