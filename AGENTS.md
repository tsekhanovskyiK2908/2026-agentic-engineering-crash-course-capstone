
## Project overview 

BOMKeeper - web application to manage DIY projects. Usually you need more than one item to accomplish your project and they are scattered accross different webstores and platforms like olx, ebay, etc., some of them may or may not allow chatting and negotiation with the sellers, there are different price options and you may lose a track which offers you made, which seller is not responding or scammer. The idea is to move out this process from the browser bookmarks and tabs for easier management.

## Teck Stack

.NET 10, C# version 14, EF Core 10, PostgreSQL, xUnit, Angular 22, Typescript, SCSS, jest, ESLint, Prettier

## Build and test commands

Extend later when project files will be established

## Code styles conventions

Use dotnet-best-practices, dotnet-design-pattern-review, dotnet-backend-patterns skills for the backend. 
Refer to the C# code conventions(https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions). 
Use angular-developer and angular-new-app skills for the front-end.

## Architecture constraints

DAL, BLL, DB entities on the backend should be separate DLLs. 
APIs should be in the root project. 
Single app on the front-end. 
Code-first approach for the database. 
Repository should be equally adopted for using tools like Claude Code, Codex, Antigravity.

## Boundaries

Commits are allowed only after test runs have succeded, static code analysis tools have found no issues.
Commit should be initiated by human after the review.
Commit message should be proposed by agents, giving extensive description of the work completed.
Rules/skills/docs should be kept up to date and updated when needed.