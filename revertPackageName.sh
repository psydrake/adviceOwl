# Run this after you finish packaging the app for iOS
# It reverts the parts of ./fixIOSBuild.sh that affect android
perl -pi -e "s/net.edrake.AdviceOwl/net.edrake.adviceowl/g" www/config.xml
perl -pi -e "s/net.edrake.AdviceOwl/net.edrake.adviceowl/g" .cordova/config.json
