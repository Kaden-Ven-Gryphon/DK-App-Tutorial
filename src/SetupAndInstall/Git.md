# Git

Git is a version control tool that is very common for most projects.  In it most simple form it is used to create a set of save states of the project so that if a change cause major unrecoverable issues you can roll your project back to an older version you know works.

It can also be used with platforms like GitHub to store your projects in the cloud and coordinate changes between multiple computers or team members.

Another common use relevant to us is to create branches where you can work on implementing a new feature or explore experimental ideas saving those changes to a different branch with out affecting the main known functional version.

### Install

Git can be found here:
https://git-scm.com/

### Setup

Most of the setup will be covered in creating the project structure.

Git's basic parts though are made up of a `.git` directory that is managed by git, and `.gitignore` files that list files to not include in the version management.

#### Config

Git can be configured through the command line.  The most common config that you will likely have to change is your name, and email.

```
git config --global user.name "<NAME>"
git config --global user.email "<EMAIL>"
```

These will be used to record who created the changes for the commit (project save), and the email will be used to match accounts if you are pushing you project to a remote platform like GitHub.

Quick reference of common git commands: [Git Cheat Sheet](./../Appendix/Git%20Cheat%20Sheet.md)
