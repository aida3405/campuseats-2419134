# AI usage log

Using AI never costs marks; a vague or missing log does.
Add a new section every week, before you tag. Did not use AI? Write "None" under Tool(s).

## Week 1
- Tool(s): Gemini
- What I asked for: Guidance on Vite setup, resolving Git push errors, step-by-step breakdown of commands, and component workflow.
- What I kept, changed or rejected, and why: Kept the step-by-step Git instructions and terminal commands for project initialization.
- One thing the AI got wrong and how I fixed it: AI initially suggested running a `git pull` when the remote repository had no branches yet; fixed it by skipping pull and running `git push -u origin main` directly.

## Week 2
- Tool(s): Gemini
- What I asked for: Where to put the additional code for App.jsx. How to add 'cart' state, write the 'handleAddtoCart' function.
- What I kept, changed or rejected, and why: -
- One thing the AI got wrong and how I fixed it: -

## Week 3
- Tool(s): Gemini
- What I asked for: Where to put the additional code for App.jsx. How to add 'cart' state, write the 'handleAddtoCart' function.
- What I kept, changed or rejected, and why: I kept the state lifting logic for cart management, view switching (menu, cart, done) and checkout validation structure. I changed the filteredMenu logic to safely default missing spiceLevel properties to 0 using operator (item.spiceLevel !== undefined ? item.spiceLevel : 0) to ensure items from vendors without spice data, like drinks or pastries would not crash or disappear.
- One thing the AI got wrong and how I fixed it: - The error AI got wrong is placed filteredMenu above selectedVendor declaration, caused an [Uncaught ReferenceError: Cannot access 'selectedVendor' before initialization] runtime error on localhost. I fixed with reordered the variable declaration so that selectedVendor was defined using [vendors.find(...)] before filteredMenu tried to reference it.