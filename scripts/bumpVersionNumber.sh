#!/bin/bash
# Go to the root dir of the repo
cd "$(git rev-parse --show-toplevel)" || return
allVersionNumbers="$(git tag | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]')"
numberOfVersionNumbers="$(echo "${allVersionNumbers}" | wc --lines)"
newVersionNumber="$(
	echo "${allVersionNumbers}" | tail --lines 1 |
		awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
)"
git tag -a "${newVersionNumber}" -m "Bump version"
sed --in-place --regexp-extended "s/versionCode [0-9]+/versionCode ${numberOfVersionNumbers}/" ./android/app/build.gradle
sed --in-place --regexp-extended "s/versionName \".*\"/versionName \"${newVersionNumber/v/}\"/" ./android/app/build.gradle
