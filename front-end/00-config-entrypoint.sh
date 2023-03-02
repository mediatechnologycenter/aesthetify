#!/bin/sh
# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details


# First we create a Javascript expression that creates an object containing the env variables
# and stores it in window.configs.
echo "Creating JSON_STRING"
JSON_STRING="{"
PLACEHOLDER_STRING='"ENV_PLACEHOLDER"'

# In the following loop, we split the env file by newline
IFS=$'\n'

# Iterate over all environment variables
for item in $(env); do
  value=${item#*=}
  name=${item%%=*}

  # We care only about env variables that start with the prefix "VUE_APP"
  case "$name" in "REACT_APP"*)
    # Append the variable name and value to the JSON_STRING
  	JSON_STRING="$JSON_STRING $name: \"$value\","
  esac
done

JSON_STRING="$JSON_STRING }"

echo "Done:"
echo $JSON_STRING

# Now we replace the placeholder in index.html with the Javascript expression (JSON_STRING) that
# we just created. Once the frontend starts, the browser will evaluate this expression and thus
# store our env variables in a window.configs object.
echo "Writing the JSON_STRING to index.html:"
echo JSON_STRING = $JSON_STRING
echo sed command:   sed -i "s/$PLACEHOLDER_STRING/${JSON_STRING}/" /usr/share/nginx/html/index.html

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s@//$PLACEHOLDER_STRING@${JSON_STRING}@" /usr/share/nginx/html/index.html
else
  sed -i "s/$PLACEHOLDER_STRING/${JSON_STRING}/" /usr/share/nginx/html/index.html
fi
