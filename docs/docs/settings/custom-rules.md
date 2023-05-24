# Custom Rules

## Custom Lint Commands

These are special lint rules that the user may specify. They are Obsidian commands. If you would like to create a custom command that you can run, you can use the [QuickAdd](https://github.com/chhoumann/quickadd) plugin in order to add a JavaScript script to make modifications to a file. **This will require some level of knowledge about the Obsidian API and JavaScript.** To use a custom user script, you will want to follow these steps:

1. Install the QuickAdd plugin
2. Go ahead and go to the settings for QuickAdd and select "Manage Macros"
3. You should see a modal popup. In that modal, make sure to type in a macro name and add the macro.
4. Once the macro is added, go ahead and configure the macro making sure to add your user user script (this should be a JavaScript file in your Obsidian vault). [Here](https://github.com/chhoumann/quickadd/blob/master/docs/docs/Examples/Macro_LogBookToDailyJournal.md) is an example from the QuickAdd repo with an explanation of what the code does.
5. Once you have finished all changes to your macro that you would like, go ahead and exit out of configure macro modal and the macro manager modal.
6. Then go ahead and select macro for the choice type and type in the name of the macro you just created (you may get suggestions or you may have to remember the name and type it in completely). Then add select "Add Choice".
7. Once the choice has been added, go ahead and click the lightning bolt icon which is the option to add a command for a choice.
8. Now you just need to search up this newly created command in the custom command settings for Obsidian Linter.

Now the next time you run the Linter, the custom lint commands should run.

## Custom Regex Replacements

These are rules that run before the YAML timestamp rule, but after most of the other rules. These rules allow you to specify
the regex to find, the flags to use with that regex, and the value to replace it with. **You may specify whitespace as
the find and replace values, but please be careful as this can make a lot of unwanted changes if you are not careful.**
These rules can be useful in swapping out certain tags, words, and formatting for others if you know what you are doing in regex.

[Here](https://regexr.com/) is an online playground that you can test out regex at. It can let you know when regex is slow and you can use it to test if the text you want to replace is actually being selected by the find and flags portion of the regex.

[Here](https://javascript.info/regexp-introduction#flags) is an explanation on what each flag means. Feel free to use them as needed. The default ones added are `g` (global) and `m` (multiline).

!!! danger "Regex lookbehinds can break Linter functionality"
    Regex lookbehinds do not work on iOS mobile and using them will cause linting to fail. So please **DO NOT** use them for iOS mobile.
