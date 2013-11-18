# Run this script to set the versions in each platform to the values declared below

# Before packaging a new version for distribution:
# 1. Increment VERSION and VERSION_CODE 
# 2. run this script: ./setVersion.sh

# Universal version - in Android, this is versionName
VERSION=1.3

# Only used in Android. Appended as minor version number if avaliable
VERSION_CODE=19

perl -pi -e "s/\sversion=\"\d+\.\d+\"\s/\ version=\"${VERSION}\"\ /" www/config.xml

perl -pi -e "s/DEFAULT_VERSION_NAME\s*=\s*'\d+\.\d+'/DEFAULT_VERSION_NAME\ =\ '${VERSION}'/" www/js/index.js 

perl -pi -e "s/android\:versionCode=\"\d+\"/android\:versionCode=\"${VERSION_CODE}\"/" platforms/android/AndroidManifest.xml
