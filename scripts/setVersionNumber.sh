#!/bin/bash
# Run before build apk

# GitHub action doesn't accept `git tag`
existingVersionNumbers="$(ls ./.git/refs/tags/ | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]')"
declare -i numberOfVersionNumbers
#  "1" stands for the newVersionNumber
numberOfVersionNumbers="$(echo "${existingVersionNumbers}" | wc --lines)"
declare existingLatestVersionNumbers
existingLatestVersionNumbers="$(
	echo "${existingVersionNumbers}" | tail --lines 1
)"
versionCode="${numberOfVersionNumbers}"
versionNumber="${existingLatestVersionNumbers}"

if [[ "$1" == "--bump" ]]; then
	newVersionNumber="$(
		echo "${existingLatestVersionNumbers}" |
			awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
	)"
	versionNumber="${newVersionNumber}"
	git tag -a "${newVersionNumber}" -m "Bump version"
	numberOfVersionNumbers+=1
fi

if [[ "${GITHUB_ACTIONS}" == true ]]; then
	versionCode="${GITHUB_RUN_NUMBER}"
fi
ANDROID_PROJECT_DIR="./release/android"
ANDROID_BUILD_SCRIPT="${ANDROID_PROJECT_DIR}/app/build.gradle"
sed --in-place --regexp-extended \
	"s/versionCode [0-9]+/versionCode ${versionCode}/" \
	"${ANDROID_BUILD_SCRIPT}"
sed --in-place --regexp-extended \
	"s/versionName \".*\"/versionName \"${versionNumber}\"/" \
	"${ANDROID_BUILD_SCRIPT}"
