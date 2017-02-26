# I unfortunately need to run this script before building the iOS app, because the provisioning profile is for net.edrake.AdviceOwl, not net.edrake.adviceowl
#
# Run this before building in Xcode
# When finished, run revertPackageName.sh to make the package name normal again for Android
#
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/Advice\ Owl/Advice\ Owl-Info.plist
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/Advice\ Owl/config.xml
#perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/build/emulator/Advice\ Owl.app/config.xml
#perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/build/emulator/Advice\ Owl.app/Info.plist
#perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/build/emulator/Advice\ Owl.app/www/config.xml
#perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/build/emulator/Advice\ Owl.app.dSYM/Contents/Info.plist
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/www/config.xml
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" plugins/ios.json
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/ios.json
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" platforms/ios/Advice\ Owl/Advice\ Owl-Info.plist
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" www/config.xml
perl -pi -e "s/net.edrake.adviceowl/net.edrake.AdviceOwl/g" .cordova/config.json
