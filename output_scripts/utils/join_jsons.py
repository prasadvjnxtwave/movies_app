import os
import glob
import json


output_file_names = [
    "ce_1_multiple_column_layouts_output.json",
    "ce_1_3_1_multiple_column_layouts_across_devices_output.json",
    "ce_1_3_2_multiple_column_layouts_across_devices_output.json",
    "ce_2_1_1_css_selectors_output.json",
    "ce_2_1_2_css_inheritance_output.json",
    "ce_2_2_1_css_specificity_output.json",
    "ce_2_2_2_css_specificity_output.json",
    "ce_3_1_1_bootstrap_navbar_output.json",
]


# DIR_PATH = os.path.dirname(os.path.abspath(__file__))

# DIR_PATH = '../projects/output_jsons/responsive_website'
DIR_PATH = '../projects/output_jsons/static_website'

final_output_json_name = "coding_exam_set_1.json"

def main():
    json_files_folder = DIR_PATH

    final_output_json = []
    for each in output_file_names:
        json_file = os.path.join(json_files_folder, each)
        print(json_file)
        with open(json_file, "r") as f:
            data = f.read()
            data = json.loads(data)
        final_output_json.extend(data)

    output_path = os.path.join(DIR_PATH, final_output_json_name)
    with open(output_path, "w") as f:
        json.dump(final_output_json, f, indent=2)


if __name__ == "__main__":
    main()
