/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package net.edrake.adviceowl;

//import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import org.apache.cordova.*;

public class AdviceOwl extends DroidGap {
	
	//private VersionReader versionReader;
    private String versionName = "0";
    private int versionCode = 0;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
                        
        // Display vertical scrollbar and hide horizontal scrollBar
        super.appView.setVerticalScrollBarEnabled(true);
        super.appView.setHorizontalScrollBarEnabled(false);
        
        // set scrollbar style
        super.appView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        
        // make versionName and versionCode accessible in front end
        super.appView.addJavascriptInterface(this, "AdviceOwl");
        
        Context context = getApplicationContext();
        try {
        	versionName = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        	versionCode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;        	
        }
        catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }
    
	public String getVersionName() {
		return versionName;
	}
	
	public int getVersionCode() {
		return versionCode;
	}
}

