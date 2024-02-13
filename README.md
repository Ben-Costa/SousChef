# SousChef
Full Suite Recipe application

# Steps to do
2. Set up project remainder -> https://www.youtube.com/watch?v=wM3TEvQn2hw&ab_channel=TheCodingTrain

3. set up react https://www.youtube.com/watch?v=5Vxx5UkjV4s&ab_channel=ArpanNeupane

4. set up mongo connection ->https://www.mongodb.com/docs/drivers/node/current/

5. create api -> https://www.youtube.com/watch?v=Oe421EPjeBE&ab_channel=freeCodeCamp.org (work through this)

https://www.youtube.com/watch?v=HBH6qnj0trU&t=224s&pp=ygURYXBpIGJlc3QgcHJhY3RjZXM%3D

# Git Hooks
Create a Hooks Directory:
In your Git repository, create a directory to store your hooks. You can name it .githooks or any other suitable name.
For example, run the following command in your repository:
mkdir .githooks

Add Your Hooks:
Inside the .githooks directory, create your hook scripts. These scripts can be shell scripts, Python scripts, or any other executable files.
Common hooks include pre-commit, post-commit, pre-push, etc.
For example, create a pre-commit hook script that checks for code style compliance.
Configure Git to Use the Hooks:
Git looks for hooks in the .git/hooks directory by default.
To use the hooks from your repository, configure Git to look in your custom hooks directory:
git config --local core.hooksPath .githooks/

Commit and Share:
Commit your hooks directory and scripts to your repository.
When other developers clone the repository, they’ll automatically use the hooks from the shared directory.

# Git Actions
1. run jest
2. run eslint
3. run code scan


# Dev Notes:
Node.js Best Practices
Use async/await: Async/await makes your code look synchronous, and it’s easier to understand and read.

Handle errors properly: Always check for errors and handle them appropriately. Unhandled errors can crash your Node.js app.

Use environment variables: Environment variables are a great way to configure your application based on the environment where it’s running.

Use a linter: A linter like ESLint can help you catch errors before they happen, and enforce a consistent coding style.

Write tests: Use a testing framework like Mocha or Jest to write tests for your code. This helps ensure that your code is working as expected and makes it easier to refactor.

React Best Practices
Use functional components: Functional components are easier to read and test. They also allow you to use React hooks.

Use a state management library: If your app has complex state logic, consider using a state management library like Redux or MobX.

Write tests: Use a testing library like Jest along with a utility like React Testing Library to write unit and integration tests for your components.

Use PropTypes: PropTypes help catch bugs by checking the types of props passed to components.

Keep components small and focused: Each component should do one thing well. If a component gets too large or complex, consider breaking it up into smaller, more manageable components.

Local Development and Testing
Use a good code editor: VS Code is a great choice. It has a built-in terminal, a rich ecosystem of extensions, and excellent support for JavaScript and React.

Use version control: Git is the most popular system. Commit often and use branches to manage feature development.

Automate tasks: Use a task runner like npm scripts or Gulp to automate tasks like testing and building your project.

Hot reloading: Tools like webpack-dev-server and Create React App support hot reloading, which automatically updates your app when you make changes to the code.

Debugging: Use the debugging tools available in your browser. For Node.js, you can use the built-in debugger.

Package Management
Use npm or Yarn: Both are great package managers for Node.js. They help manage your project’s dependencies.

Understand semantic versioning: Packages use semantic versioning, meaning version numbers are in the format of MAJOR.MINOR.PATCH. Understanding this can help you manage your dependencies.

Use a lock file: Both npm and Yarn have a lock file (package-lock.json or yarn.lock) that locks the versions of your dependencies. This helps ensure that you’re using the exact same dependencies in every environment.

Keep your dependencies up to date: Regularly update your dependencies to get the benefit of recent improvements and security fixes.