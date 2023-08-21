# To prepare CP with out routes:

- Copy respective boilerplate
  - Coding Practice - `cp-boilerplate`
  - Session Practice - `session-boilerplate`
- Change the folder name to [set_count]-[set_name]
- Update the `title` key in `package.json` file with `Coding_Practice_Name`
- Prepare the coding practice solution.
- Prepare the coding practice tests.
- Update their _README.md_ file accordingly
- Update their `ide_based_coding.json` file accordingly
- Prepare the coding practice initial.
- Go to the `output_scripts/coding_x_config.mjs` and update you project config.
- `sessionUniqueKey` - [Course][type][5 Random alphanumeric characters]
- Run the following command in the terminal
  ```cmd
  cd output_scripts && cd utils && cd ide_loading && npm i && node zip_coding_x.mjs && cd ../../..
  ```

  Note: 
  1. If you get error create folder named `zip_outputs` in `output_scripts/` (One time task)

# To test whether all tests are covering the entire code

- Command: `CI=true npm test -- --coverage`
