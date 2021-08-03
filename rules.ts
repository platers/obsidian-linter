export const rules: { [name: string] : (text: string) => string } = 
{
	"trailing_spaces" : (text: string) => {
		return text.replace(/[ \t]+$/gm, "");
	},
};