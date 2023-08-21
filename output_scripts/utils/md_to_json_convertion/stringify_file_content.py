import sys
import os
import glob
import json

DIR_PATH = os.path.dirname(os.path.abspath(__file__))


def get_file_data():
    filepath = os.path.join(DIR_PATH, 'input.md')
    file = open(filepath, "r", encoding="utf-8")
    data = file.read()
    file.close()
    final_details = {
        "Stringified_content": data
    }

    output_path = os.path.join(DIR_PATH, "output.json")
    with open(output_path, "w") as f:
        json.dump(final_details, f, indent=2)


if __name__ == "__main__":
    get_file_data()
