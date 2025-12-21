# Git Commit and Rebase Rules for Cursor Agent

## Git Commit Rules

### Commit Message Format

All commit messages MUST follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

Use one of the following types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Commit Subject Rules

1. **Capitalization**: Use lowercase for the subject line (except for proper nouns)
2. **No period**: Do not end the subject line with a period
3. **Length**: Keep the subject line under 72 characters
4. **Imperative mood**: Write in imperative mood ("add feature" not "added feature" or "adds feature")
5. **Be specific**: Clearly describe what the commit does
6. **Scope (optional)**: Include scope in parentheses if it helps clarify the change (e.g., `feat(api):`, `fix(ui):`)

### Commit Body Rules

1. **Separate from subject**: Leave a blank line between the subject and body
2. **Wrap at 72 characters**: Wrap the body at 72 characters
3. **Explain what and why**: Explain what the change does and why it was made, not how
4. **Use bullet points**: Always use bullet points with `-` or `*`. Use minimum 1 and maximum 5 bullet points. Keep each bullet point concise and focused
5. **Reference issues**: Reference related issues or pull requests using `Closes #123` or `Fixes #456`
6. **Breaking changes**: If the commit introduces breaking changes, start the body with `BREAKING CHANGE:` followed by a description

### Commit Footer Rules

1. **Reference issues**: Use `Closes #123`, `Fixes #456`, `Related to #789`
2. **Breaking changes**: Use `BREAKING CHANGE: <description>` for breaking changes
3. **Co-authors**: Use `Co-authored-by: Name <email@example.com>` if applicable

### Examples of Good Commit Messages

```
feat(auth): add OAuth2 login support

- Implement OAuth2 authentication flow for Google and GitHub providers
- Allow users to sign in using their existing social media accounts

Closes #123
```

```
fix(api): resolve null pointer exception in user endpoint

- Add null check when accessing user preferences
- Prevent crash for users without saved preferences

Fixes #456
```

```
docs: update README with installation instructions

- Add detailed installation steps
- Include prerequisites and environment setup requirements
```

```
refactor(utils): extract validation logic into separate module

- Move user input validation functions to dedicated validation module
- Improve code organization and reusability
```

```
chore(deps): update axios to version 1.6.0

- Update axios dependency to latest version
- Resolve security vulnerabilities
```

### Commit Best Practices

1. **Atomic commits**: Make small, focused commits that do one thing
2. **Commit often**: Commit logical units of work, not entire features
3. **Test before commit**: Ensure code compiles and tests pass before committing
4. **Don't commit broken code**: Never commit code that breaks the build
5. **Review changes**: Review `git diff` before committing to ensure only intended changes are included
6. **Use `git add -p`**: When appropriate, use interactive staging to review changes line by line

## Git Branch Rules

### Branch Strategy (MVP)

For MVP development, use a simple two-branch workflow:

1. **`main`**: Production-ready, deployable code
   - Only contains tested, stable code
   - Protected branch (no direct commits)
   - Updated via rebase + fast-forward merge from develop

2. **`develop`**: Active development branch
   - Primary working branch for all development
   - All commits go here during MVP phase
   - Regularly synced with main via rebase

3. **`feature/feature-name`** (Optional): For larger features
   - Use only for features requiring multiple commits
   - Create from develop: `git checkout -b feature/feature-name develop`
   - Merge back to develop when complete
   - Delete after merging

### Branch Naming Conventions

- **Feature branches**: `feature/descriptive-name` (e.g., `feature/user-authentication`)
- **Use lowercase**: Use lowercase letters and hyphens for branch names
- **Be descriptive**: Branch names should clearly indicate their purpose
- **Keep it short**: Maximum 50 characters

### Branch Workflow

1. **Starting new work**: Work directly on `develop` for MVP simplicity
2. **Creating feature branch** (if needed):
   - `git checkout develop`
   - `git pull origin develop`
   - `git checkout -b feature/feature-name`
3. **Completing feature branch**:
   - `git checkout develop`
   - `git rebase origin/develop` (update develop first)
   - `git merge feature/feature-name` (fast-forward merge)
   - `git branch -d feature/feature-name` (delete local branch)

### Branch Best Practices

1. **Keep branches short-lived**: Delete feature branches after merging
2. **Sync regularly**: Rebase develop onto main frequently to avoid large conflicts
3. **One feature per branch**: Each feature branch should focus on a single feature
4. **Update before branching**: Always update develop before creating a new branch

## Git Rebase Rules

### When to Rebase

1. **Before pushing**: Rebase local commits before pushing to remote to maintain a clean history
2. **Feature branches**: Rebase feature branches onto main/master before creating pull requests
3. **Interactive cleanup**: Use interactive rebase to clean up commit history (squash, reword, edit)
4. **Never rebase shared branches**: Do NOT rebase branches that others are working on

### Rebase Workflow

1. **Fetch latest changes**: Always `git fetch origin` before rebasing
2. **Rebase onto target branch**: Use `git rebase origin/main` or `git rebase origin/master`
3. **Resolve conflicts**: If conflicts occur, resolve them, then `git add` and `git rebase --continue`
4. **Abort if needed**: Use `git rebase --abort` if you need to cancel the rebase

### Merging develop into main (No Merge Commits)

**CRITICAL**: When merging develop branch into main, ALWAYS rebase first to avoid merge commits:

1. **Checkout develop branch**: `git checkout develop`
2. **Fetch latest changes**: `git fetch origin`
3. **Rebase develop onto main**: `git rebase origin/main` (or `origin/master`)
   - This replays develop commits on top of main, creating a linear history
4. **Resolve any conflicts**: If conflicts occur, resolve them, then `git add` and `git rebase --continue`
5. **Fast-forward merge to main**: After rebasing, checkout main and merge:
   - `git checkout main`
   - `git merge develop` (this will be a fast-forward merge, no merge commit)
   - `git push origin main`

**Why this approach**: This maintains a clean, linear commit history without merge commits. The rebase ensures develop's commits are replayed on top of main, and the subsequent merge is a simple fast-forward.

**Alternative workflow** (if you want to keep develop's history):
- `git checkout main`
- `git rebase develop` (rebase main onto develop)
- `git push origin main --force-with-lease` (only if main is not shared)

**NEVER**: Do not use `git merge develop` directly into main without rebasing first, as this creates unwanted merge commits.

### Interactive Rebase Rules

When using `git rebase -i`, follow these guidelines:

1. **Squash related commits**: Combine small, related commits into logical units
2. **Reorder commits**: Arrange commits in logical order (dependencies first)
3. **Reword messages**: Fix typos or improve commit message clarity
4. **Edit commits**: Make small fixes to commits (like fixing typos in code)
5. **Drop unnecessary commits**: Remove commits that are no longer needed

### Rebase Commands

- `git rebase origin/main`: Rebase current branch onto origin/main
- `git rebase -i HEAD~n`: Interactive rebase for last n commits
- `git rebase --continue`: Continue rebase after resolving conflicts
- `git rebase --abort`: Abort rebase and return to original state
- `git rebase --skip`: Skip current commit during rebase

### Rebase Best Practices

1. **One commit per logical change**: Use interactive rebase to ensure each commit represents a single logical change
2. **Clean history**: Maintain a linear, easy-to-read commit history
3. **Test after rebase**: Always test the code after rebasing to ensure nothing broke
4. **Force push carefully**: Only force push (`git push --force-with-lease`) after rebasing if you're sure no one else is working on the branch
5. **Communicate**: If you must rebase a shared branch, communicate with your team first

### Rebase vs Merge

- **Use rebase** for: Feature branches, cleaning up local commits, maintaining linear history, preparing develop for merge into main
- **Use merge** for: Fast-forward merges only (after rebasing), never create merge commits
- **Avoid merge commits**: Always rebase before merging to maintain a linear history. Merge commits create unnecessary clutter in git history.

## Vibe Coding Log Rules

### Purpose

The Vibe Coding Log (`docs/vibe_coding_log.md`) tracks all prompts used during development, their intent, verification, and refinements as required by the RFQ.

### When to Log

The agent MUST ask the user if they should add a log entry to `vibe_coding_log.md` after:

1. **Major prompts**: Significant prompts that result in substantial code changes or new features
2. **Feature completion**: When a feature or major component has been completed
3. **Development milestones**: After completing a significant development task or milestone
4. **Multi-step implementations**: When a task required multiple prompts or iterations to complete

### Log Entry Format

Each log entry MUST follow this format:

```
## Feature: [Feature Name]
- **Intent:** What you wanted to build
- **Prompt:** The exact prompt given to Cursor/AI assistant
- **Verification:** How you checked it worked
- **Refinement:** If it failed, what you asked next
```

### Logging Process

1. **After completing major work**: When a significant prompt or development task is completed, ask the user: "Should I add a log entry to `vibe_coding_log.md` for this work?"
2. **Wait for confirmation**: Only add the log entry if the user confirms
3. **Include all details**: When logging, include the exact prompt, intent, verification steps, and any refinements made
4. **Be specific**: Clearly document what was built and how it was verified

### What Constitutes "Major"

Consider the following as "major" prompts or development:
- Creating new features or components
- Implementing significant functionality
- Refactoring large portions of code
- Adding new integrations or APIs
- Completing multi-step tasks that required multiple prompts
- Any work that represents a meaningful milestone in the project

### What Does NOT Need Logging

Do NOT ask about logging for:
- Minor bug fixes or typo corrections
- Simple formatting or style changes
- Small refactoring that doesn't change functionality
- Documentation updates that don't involve code changes
- Routine maintenance tasks

## Agent Responsibilities

When handling git commits and rebases, the agent MUST:

1. **Follow commit message format**: Always use the Conventional Commits format
2. **Create meaningful messages**: Write clear, descriptive commit messages
3. **Review changes**: Show a summary of changes before committing
4. **Ask for confirmation**: Confirm with the user before force pushing or rebasing shared branches
5. **Handle conflicts**: Help resolve merge conflicts during rebase
6. **Maintain clean history**: Suggest squashing or reorganizing commits when appropriate
7. **Test before commit**: Remind to run tests before committing (if applicable)
8. **Rebase before merging**: When merging develop into main, always rebase develop onto main first, then perform a fast-forward merge to avoid merge commits
9. **Follow branch strategy**: Use develop as primary working branch for MVP, create feature branches only when needed
10. **Clean up branches**: Suggest deleting feature branches after they are merged
11. **Log major development**: After completing major prompts or development work, ask the user if they should add a log entry to `vibe_coding_log.md` documenting the intent, prompt, verification, and refinements

## Prohibited Actions

The agent MUST NOT:

1. **Force push to main/master**: Never force push to the main/master branch
2. **Rebase shared branches**: Never rebase branches that others might be working on without explicit permission
3. **Commit without review**: Never commit changes without showing what will be committed
4. **Skip tests**: Never commit code that breaks existing tests
5. **Create empty commits**: Never create commits with no changes
6. **Amend pushed commits**: Never amend commits that have already been pushed (unless rebasing)
7. **Create merge commits**: Never merge develop into main without rebasing first. Always rebase develop onto main, then fast-forward merge to avoid merge commits

