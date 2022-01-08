// original file: gopro-telemetry/samples/example.js

// MIT License

// Copyright (c) 2019 Juan Irache Duesca

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE

const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const path = require('path');

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function toJSON(in_filename, out_filename) {
  try {
    const file = await readFileAsync(in_filename);
    const result = await goproTelemetry(
      { rawData: file },
      {
        stream: 'GPS5',
        repeatSticky: true,
        repeatHeaders: true,
        // WrongSpeed: 180.0,  // in km/h? this option eill skip some samples
        GPS5Fix: 2,
        GPS5Precision: 220
      }
    );
    await writeFileAsync(out_filename, JSON.stringify(result));
    console.log('File saved: ' + out_filename);
  } catch (error) {
    console.error(error);
  }
}

if (process.argv.length < 3) {
  console.error('usage: node to_json.js <in_filename> <out_filename>');
} else {
  toJSON(process.argv[2], process.argv[3]);
}
