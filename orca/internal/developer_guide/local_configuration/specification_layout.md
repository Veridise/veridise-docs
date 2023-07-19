# Specification Layout

The specifications should be contained in a folder. The relative path from the configuration file to this folder should be set as the configuration argument `specs_path`. Any file in the `specs_path` that ends in `.spec` will be parsed as a [V] specification -- all other files will be ignored.

**Important**: Orca expects all specifications to be in the folder path listed and will not recursively search other paths.

By default, if multiple specifications are passed, all will be run in a fuzzing campaign (i.e. after every fuzzed transaction, all specifications are checked for violations) and all violations of these specs are reported at the end of the run.

If there are multiple specifications but the user would like to only run a specific spec, they can set the `spec` field of the configuration to the name of that specification -- in that case, only that specification will be run.
