"As you can see, these double quotes will be converted to smart quotes"
"Common contractions are handled as well. For example can't is updated to smart quotes."
"Nesting a quote in a quote like so: 'here I am' is handled correctly"
'Single quotes by themselves are handled correctly'
Possessives are handled correctly: Pam's dog is really cool!
Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>

Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
once possessives and common contractions have been dealt with. If not, it will throw an error.
