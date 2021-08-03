export const rules: { [name: string] : (text: string, params?: any) => string } = 
{
	"trailing_spaces" : (text: string) => {
		return text.replace(/[ \t]+$/gm, "");
	},
	"newlines_around_headings" : (text: string) => {
		return text.replace(/\n*^(#+ .*)\n*/gm, "\n\n$1\n\n");
	},
	"spaces_after_list_markers" : (text: string) => {
		text = text.replace(/^(\s*\d+\.|[-+*])\s+/gm, "$1 ");
		return text.replace(/^(\s*\d+\.|[-+*]\s+\[[ xX]\])\s+/gm, "$1 ");
	},
	"yaml_timestamp" : (text: string) => {
		initYAML(text);
		text = text.replace(/\ndate updated:.*\n/, "\n");
		const yaml_end = text.indexOf("\n---");
		return insert(text, yaml_end, `\ndate updated: ${new Date().toDateString()}`);
	},
	"compact_yaml" : (text: string) => {
		initYAML(text);
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
};

// Helper functions

function initYAML(text: string) {
	if (!text.match(/^---\s*\n.*---\s*\n.*/)) {
		text = "---\n---\n" + text;
	}
	return text;
}

function insert(str: string, index: number, value: string) {
    return str.substr(0, index) + value + str.substr(index);
}