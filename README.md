# Forget The Bookie

## The Repository

This repository contains 2 main folders, namely:

- **"api"** - an ASP.NET Core Web API (.NET 8.0) project for the back-end.
- **"ui"** - a Next.js (v14.0.4) project for the front-end.

## IDE and source code editor

- [Visual Studio 2022 Community Edition](https://visualstudio.microsoft.com/vs/community/) - to make code changes for the .NET project
- [Visual Studio Code](https://code.visualstudio.com/Download) - to make code changes for the Next.js project

## To run the project

### API

1. Head to the `api` folder and open the `.sln` file using VS 2022 Community
2. Start the project and make sure you're using `http` to be able to consume the endpoints in the front-end.

### UI

1. Open the root folder with VS Code (this way git can track your changes here instead of directly opening the `ui` folder).
2. Open a new terminal in the VS Code and change the directory to `ui` folder (command is `cd ui`)
3. Type `npm run dev` to run the development server
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
