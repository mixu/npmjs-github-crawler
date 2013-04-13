# npmjs-github-crawler

For fetching metadata about npm packages from github.

## find-git-packages.js

This thing:

- reads the npm database from a local copy,
- finds the packages that have set a repository (type = git)
- writes them to stdout as newline-separated JSON

## crawl.js

This thing:

- reads an input file of newline-separated JSON
- goes to github and fetches the repository metadata for the specific repository
- writes that metadata to ./cache
- obeys the github rate limit
