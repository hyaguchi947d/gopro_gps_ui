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

    gps_data = {"data":[]}

    idx = 1
    filename = "%s/%s%02d%s.json" % (dirname, prefix, idx, postfix)

    while(os.path.isfile(filename)):
        print(filename)
        with open(filename) as f:
            data = json.load(f)
            gps_data["data"].extend(filter(lambda gps : "gps_fix" in gps, data["data"]))

        idx += 1
        filename = "%s/%s%02d%s.json" % (dirname, prefix, idx, postfix)

    outfile = "%s/%sXX%s.json" % (dirname, prefix, postfix)

    with open(outfile, "w") as f:
        json.dump(gps_data, f)

