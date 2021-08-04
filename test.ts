import { rules } from './rules';

test("trailing_spaces", () => {
	const text = 
	`
# H1   
line with trailing spaces and tabs    	`;
	const expected = `
# H1
line with trailing spaces and tabs`;
	expect(rules['trailing_spaces'](text)).toBe(expected);
});

test("newlines_around_headings", () => {
	const text = `
# H1
## H2


# H1
line`;
	const expected = `

# H1

## H2

# H1

line`;
	expect(rules['newlines_around_headings'](text)).toBe(expected);
});

test("newlines_around_headings ignore codeblocks", () => {
	const text = `
# H1
\`\`\`
# comment not header
a = b
\`\`\``;
	const expected = `

# H1

\`\`\`
# comment not header
a = b
\`\`\``;
	expect(rules['newlines_around_headings'](text)).toBe(expected);
});