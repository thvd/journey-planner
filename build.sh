#!/bin/sh

cp -f index.html build.html

GOOGLE_API_KEY=`cat .GOOGLE_API_KEY`
perl -pi -e "s/GOOGLE_API_KEY/$GOOGLE_API_KEY/g" build.html
