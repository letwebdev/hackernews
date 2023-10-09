#!/bin/bash
allVersionNumbers="$(git tag | grep --extended-regexp 'v[0-9]+.[0-9]+.[0-9]')"
newVersionNumber="$(
	echo "${allVersionNumbers}" | tail --lines 1 |
		awk --field-separator=. '/[0-9]+./{$NF++;print}' OFS=.
)"
git tag -a "${newVersionNumber}" -m "Bump version"
