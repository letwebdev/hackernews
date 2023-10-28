#!/bin/bash
# Run before build apk

# GitHub action doesn't accept `git tag`
existingVersionNumbers="$(ls ./.git/refs/tags/ | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]')"
declare -i numberOfVersionNumbers
#  "1" stands for the newVersionNumber
numberOfVersionNumbers="$(echo "${existingVersionNumbers}" | wc --lines)"

if [[ "$1" == "--bump" ]]; then
	newVersionNumber="$(
		echo "${existingVersionNumbers}" | tail --lines 1 |
			awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
	)"
	git tag -a "${newVersionNumber}" -m "Bump version"
	numberOfVersionNumbers+=1
fi

sed --in-place --regexp-extended "s/versionCode [0-9]+/versionCode ${numberOfVersionNumbers}/" ./android/app/build.gradle
sed --in-place --regexp-extended "s/versionName \".*\"/versionName \"${newVersionNumber/v/}\"/" ./android/app/build.gradle
