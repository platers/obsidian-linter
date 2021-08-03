export class Rule {
	name: string;

	applyRule(source: string): string {
		throw new Error("Not implemented");
	}

	constructor(name: string, applyRule: (source: string) => string) {
		this.name = name;
		this.applyRule = applyRule;
	}
}

export const rules: { [name: string] : (text: string) => string } = 
{
	"trailing_spaces" : (text: string) => {
		return text.replace(/[ \t]+$/gm, "");
	},
};