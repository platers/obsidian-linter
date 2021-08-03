export const rules: { [name: string] : (text: string) => string } = 
{
	"trailing_spaces" : (text: string) => {
		return text.replace(/[ \t]+$/gm, "");
	},
	"newlines_around_headings" : (text: string) => {
		return text.replace(/\n*^(#+ .*)\n*/gm, "\n\n$1\n\n");
	},
	"spaces_after_list_markers" : (text: string) => {
		return text.replace(/^(\s*\d+\.|[-+*])\s+/gm, "$1 ");
	}
};