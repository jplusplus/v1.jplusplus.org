#!/bin/bash

convert $1 -thumbnail x160 -resize '160x<' -resize 50% -gravity center -crop 80x80+0+0 -alpha set circle.png -compose DstIn -composite $2