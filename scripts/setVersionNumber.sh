#!/bin/bash
# Set version number in gradle build script to the latest git version tag
# Should Run before building apk
set -eo pipefail

# GitHub action doesn't accept `git tag`
getTags() {
	cd ./.git/refs/tags || return
	for tag in *; do
		echo "${tag}"
	done
}
getVersionTags() {
	getTags | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]'
}
existingVersionNumbers="$(getVersionTags)"
declare -i quantitiesOfExistingVersionNumbers
quantitiesOfExistingVersionNumbers="$(echo "${existingVersionNumbers}" | wc --lines)"
declare existingLatestVersionNumber
existingLatestVersionNumber="$(
	echo "${existingVersionNumbers}" | tail --lines 1
)"

if [[ "$1" == "--bump" ]]; then
	versionNumberBumped="$(
		echo "${existingLatestVersionNumber}" |
			awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
	)"
	versionNumberToSet="${versionNumberBumped}"
	# Substitute version numbers in package.json and commit
	sed --in-place --regexp-extended \
		"s/\"version\": \".*\"/\"version\": \"${versionNumberToSet/v/}\"/" \
		"./package.json"
	git add "./package.json"
	git commit -m "chore: bump to ${versionNumberToSet}"

	git tag -a "${versionNumberToSet}" -m "Bump version"
	quantitiesOfExistingVersionNumbers+=1
else
	versionNumberToSet="${existingLatestVersionNumber}"
fi

# Set Internal version number of apk
if [[ "${GITHUB_ACTIONS}" == true ]]; then
	versionCode="${GITHUB_RUN_NUMBER}"
else
	versionCode="${quantitiesOfExistingVersionNumbers}"
fi

# Substitute version numbers in gradle build script
ANDROID_PROJECT_DIR="${CAPACITOR_ANDROID_PATH:=./release/android}"
ANDROID_BUILD_SCRIPT="${ANDROID_PROJECT_DIR}/app/build.gradle"
sed --in-place --regexp-extended \
	"s/versionCode [0-9]+/versionCode ${versionCode}/" \
	"${ANDROID_BUILD_SCRIPT}"
sed --in-place --regexp-extended \
	"s/versionName \".*\"/versionName \"${versionNumberToSet}\"/" \
	"${ANDROID_BUILD_SCRIPT}"
