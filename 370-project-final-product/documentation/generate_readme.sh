# Adjust working directory so that relative links work
script_dir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
cd $script_dir || exit

# List of files that will be compiled into the main one!
# You can comment them out, or add any you'd like.
# The order they are listed is the order they will be in the final product.
readme_files=(
  01_introduction.md
  05_tests.md
  02_cloning.md
  03_viewing.md
  04_usage.md
  06_documentation.md
  07_troubleshooting.md
  08_acknowledgements.md
)

# Name of the README. Assume that it will go in the root of the project.
readme=../README.md

# Clear the file
echo "" > $readme

for partial_file in "${readme_files[@]}"
do
  # Skip the file if it's not found
  if [ -e $partial_file ]
  then
    cat $partial_file >> $readme  # Concatenate onto end of current README
  fi
done
