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

## Week 4
- Tool(s): Gemini and DeepSeek
- What I asked for: How to migrate single page campuseats react to multipage using react router, context API and custom hooks. Also about debugging routing mismatches, component import paths and implement of personal feature which is max spice level filter
- What I kept, changed or rejected, and why: I kept the structural implementation of CartProvider using useLocalStorage to ensure cart and order states survive browser refreshes, with the nested item structure. I changed the component import paths between pages and components folder and updated order rendering to display a full breakdown of past purchases (quantity, each item totals and overall items). Last, I rejected the initial assumptions regarding flat cart array properties and keep the code strictly aligned with nested object structure required by existing data model.
- One thing the AI got wrong and how I fixed it: The thing AI got wrong is that it suggest to compare spice === setMaxSpice inside VendorPage menu filter. It makes the system compared the item's spice level against the state setter function, setMaxSpice, instead of the actual maxSpice state value. So I fixed it with the condition of spice <= maxSpice, so the range slider correctly filters items up to the selected spice level.

## Week 5
- Tool(s): Gemini
- What I asked for: I asked Gemini to help me for my personal feature, spice-level badge and filter following the requirement. only login user preference being constant while guest user preference will be reload back to the original state which is maxSpice=3. for this, need to use useLocalStorage logic to ensure correct fallback behaviors for guest users. Also, help to fix routing issues about the navigation of the page.
- What I kept, changed or rejected, and why: I kept the clauses of if (!key) return in useLocalStorage.js to prevent guests from writing preferences to localStorage. I changed the set of guest key to null so that non-authenticated sessions revert cleanly to default spice level which is 3 and operate strictly within temporary component memory. I rejected to write the code with 2 useEffect, forcing setMaxSpice(3) inside VendorPage.jsx because it caused logged in user settings to overwritten back to default level upon navigation. Also when i do write code with 2 useEffect, the navigation of the page being stuck to oldpage, need to reload before the page come to appear.
- One thing the AI got wrong and how I fixed it: Gemini initially suggested inline useEffect in VendorPage.jsx to reset state on route changed. It caused login user preference to be wiped out back to 3 whenever login user navigated between vendor menus. I fix the extra useEffect by removing it and attached key={id} to the outer wrapper container in VendorPage.jsx. this forced react to safely re-initialize the page instance upon parameter changes without destroying persistent localStorage entries for login users.