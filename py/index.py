#!/usr/bin/env python

"""Produces index.html given a list of JavaScript sources."""

import markup
import sys

index = markup.page()
index.init(
    title = "Cargo-Not: Educational Cargo-Bot",
    script = sys.argv[1:])
index.script('main();')

print index
