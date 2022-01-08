#!/usr/bin/env python

import sys
import os
import json

if __name__ == "__main__":
    if len(sys.argv) < 4:
       print("usage: merge_gps.py <DIR> <PREFIX> <POSTFIX>")
       sys.exit(1)

    dirname = sys.argv[1]
    prefix = sys.argv[2]
    postfix = sys.argv[3]

    gps_data = {"1":{"streams":{"GPS5":{"samples":[]}}}}
    # gps_data = {"data":[]}  # old format

    idx = 1
    filename = "%s/%s%02d%s.json" % (dirname, prefix, idx, postfix)

    while(os.path.isfile(filename)):
        print(filename)
        with open(filename) as f:
            data = json.load(f)
            # gps_data["data"].extend(filter(lambda gps : "gps_fix" in gps, data["data"]))  # old format
            if "GPS5" in data["1"]["streams"]:
                gps_data["1"]["streams"]["GPS5"]["samples"].extend(data["1"]["streams"]["GPS5"]["samples"])

        idx += 1
        filename = "%s/%s%02d%s.json" % (dirname, prefix, idx, postfix)

    outfile = "%s/%sXX%s.json" % (dirname, prefix, postfix)

    with open(outfile, "w") as f:
        json.dump(gps_data, f)

