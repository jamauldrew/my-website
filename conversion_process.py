#! /usr/bin/env python3

# import libredwg
from LibreDWG import *

import sys

if len(sys.argv) != 2:
    print("Usage: load_dwg.py <filename>")
    exit()

filename = sys.argv[1]
a = Dwg_Data()
a.object = new_Dwg_Object_Array(1000)
error = dwg_read_file(filename, a)

if error > 0:  # critical errors
    print("Error: ", error)
    if error > 127:
        exit()

print(".dwg version: %s" % a.header.version)
print("Num objects: %d " % a.num_objects)

# XXX TODO Error: Dwg_Object_LAYER_CONTROL object has no attribute 'tio'
# print "Num layers: %d" % a.layer_control.tio.object.tio.LAYER_CONTROL.num_entries

# XXX ugly, but works
for i in range(0, a.num_objects):
    obj = Dwg_Object_Array_getitem(a.object, i)
    print(" Supertype: ", obj.supertype)
    print("      Type: ", obj.type)

# #!/usr/bin/env python3
# from flask import Flask, request, jsonify
# import subprocess
# import os

# app = Flask(__name__)

# UPLOAD_FOLDER = "uploads"
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# @app.route("/convert", methods=["POST"])
# def convert_cad_file():
#     file = request.files["file"]
#     if not file:
#         return jsonify({"error": "No file provided"}), 400

#         # Save the uploaded file
#     original_filename = file.filename
#     if original_filename is None:
#         return jsonify({"error": "No file provided"}), 400

#     ext = original_filename.split(".")[-1].lower()
#     if ext not in ["dwg", "step"]:
#         return jsonify({"error": "Unsupported file type"}), 400

#     filepath = os.path.join(app.config["UPLOAD_FOLDER"], original_filename)
#     file.save(filepath)

#     # Determine the conversion process based on file extension
#     if ext == "dwg":
#         converted_filename = original_filename.rsplit(".", 1)[0] + ".stl"
#         converted_filepath = os.path.join(
#             app.config["UPLOAD_FOLDER"], converted_filename
#         )
#         cmd = f'libredwg dwg2dxf "{filepath}" | openscad -o "{converted_filepath}"'
#     elif ext == "step":
#         converted_filename = original_filename.rsplit(".", 1)[0] + ".obj"
#         converted_filepath = os.path.join(
#             app.config["UPLOAD_FOLDER"], converted_filename
#         )
#         cmd = f'freecadcmd --convert "{filepath}" "{converted_filepath}"'

#     try:
#         subprocess.run(cmd, shell=True, check=True)
#         return (
#             jsonify(
#                 {"message": f"File converted successfully to {converted_filepath}"}
#             ),
#             200,
#         )
#     except subprocess.CalledProcessError as e:
#         return jsonify({"error": f"Conversion failed: {str(e)}"}), 500


# if __name__ == "__main__":
#     app.run(debug=True)
