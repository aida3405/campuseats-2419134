# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
    Building a UI imperatively (plain DOM code) requires to write the instructions step by step to tell the browser how to find and manually manipulate DOM elements. For example like using document.getElementById. Whereas, building a UI declaratively (React) can let us to describe what UI should like for a given state. Not only that, React automatically updates the DOM to match whenever the state changes.

2. Why must a component name start with a capital letter?
    It is to distinguish custome React components from standard built-in HTML tags. It compiles them as standard HTML when JSX sees lowercased, such as <div/> or <p/>. Meanwhile, when JSX sees like <Header/> or <VendorCard/>, it will tells React to look for and render a custom JavaScript component.

3. What does a fragment <>...</> do, and why not just use a <div>?
    A fragment <>...</> lets group multiple elements together without adding an unnessary extra wrapper node to actual HTML DOM tree. If using a <div>, it will adds an extra structural container to DOM, mess uo CSS layouts and clutter the HTML structure.

4. Name one benefit of splitting the UI into small components.
    One benefit of splitting the UI into small components is making the code reusable and significantly easier to maintain across the application. 