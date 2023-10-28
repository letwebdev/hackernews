#!/bin/bash
# Run before build apk
if [[ "$1" == "--bump" ]]; then

	existingVersionNumbers="$(git tag | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]')"

	newVersionNumber="$(
		echo "${existingVersionNumbers}" | tail --lines 1 |
			awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
	)"

	declare -i numberOfVersionNumbers
	#  "1" stands for the newVersionNumber
	numberOfVersionNumbers=$(("$(echo "${existingVersionNumbers}" | wc --lines)" + 1))
	git tag -a "${newVersionNumber}" -m "Bump version"
	sed --in-place --regexp-extended "s/versionCode [0-9]+/versionCode ${numberOfVersionNumbers}/" ./android/app/build.gradle
	sed --in-place --regexp-extended "s/versionName \".*\"/versionName \"${newVersionNumber/v/}\"/" ./android/app/build.gradle
fi
