# Current Status of CI Pipeline
Updated: May 25, 2021

## Checkpoint 1
![CI CD Pipeline](phase1.png)

Above: diagram of planned CI Pipeline
### Before Pushing to the Remote Repository

Before even pushing to any of the remote development branches, the following scripts should be run by each member who wishes to push to the remote repository:

```unit-tests: npx jest --coverage```

```lint: npx eslint . --ext .js```

```lint-fix: "npx eslint --fix . --ext .js```

- `unit-tests`: runs all unit tests that have been written up and produces a coverage report after completion of those tests.
- `lint`: runs airbnb linter via eslint and gives warning and errors where styling and code conventions are not to standard.
- `lint-fix`: very similar to `lint`, except that running this script will have the linter automatically fix any styling problems that can be fixed automatically for the developer.

Each team member is responsible for checking that these scripts pass locally for their current code before they push to the remote. These tests will be run again during the build process.

### Build Job

Upon pushing to the remote repository, the build job under Github actions will be run. This job will run checks on the installation of the npm packages and dependencies used on Ubuntu and Windows machines and also run style checks using the airbnb linter as well as running unit tests. 

Code is only to be pushed to the current remote branch if the entire build job passes.

### Merging to main (Production)

When ready to merge to the main branch and deploy to production, there needs to be at least one other person to approve of the pull request before it can officially be merged. Integration tests should also be run at this point to ensure that the new code will not break the application when deployed. If the integration tests pass, then the code is merged and deployed to firebase automatically.

Things that are done:
- local scripts to check code quality (linting, unit testing)
- build job via Github actions
- approval of merge requests to main

Things that still need to be done:
- jobs to run end to end tests
- job to deploy to firebase after merge to production

## Checkpoint 2
- Added staging branch added to run integration tests and final build checks on production-ready code
- Action added to automatically deploy to firebase on merge to main

### Pushing to Remote Dev Branches
Each feature/component in our application has been given its own dev branch to prevent excessive merge conflicts and confusion on what was pushed.

Before pushing to the remote dev branches on the repository, each team member is required to run the test and lint scripts mentioned in Checkpoint 1 locally to reduce the number of failed builds.

### Merging to Staging
When development code is considered production ready, a pull request to merge the development and staging branches should be opened. When a pull request is made to staging, the actions for building, testing, and style checking are run via Github actions to check that the code being added is up to standard. If all the checks pass, then the code can be pushed to staging.

### Deploying to Firebase
When ready to deploy to Firebase, the staging branch should be merged with the main (production) branch. When a pull request is opened, the `Firebase Deploy` workflow is run. This runs one final build check, and then uses a third-party action with our Firebase secret token to automatically deploy the updated code to the web.

### Things That Still Need to be Done
- Look into generating JS docs on finished code