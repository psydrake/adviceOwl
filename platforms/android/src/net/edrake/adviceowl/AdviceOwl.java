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

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.LinearLayout;
import android.view.View;

import org.apache.cordova.*;
//import com.google.ads.*;
import com.google.analytics.tracking.android.EasyTracker;

import java.util.Timer;
import java.util.TimerTask;

public class AdviceOwl extends CordovaActivity {
    //private static final String ADMOB_AD_UNIT = "ca-app-pub-8928397865273246/9320737011";
	
    private String versionName = "0";
    private int versionCode = 0;

	Timer timer;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        
        Config.init(this); // makes whitelisting succeed
        
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
        
        // Display vertical scrollbar and hide horizontal scrollBar
        //super.appView.setVerticalScrollBarEnabled(true);
        //super.appView.setHorizontalScrollBarEnabled(false);
        
        // set scrollbar style
        //super.appView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        
        // make versionName and versionCode accessible in front end
        //super.appView.addJavascriptInterface(this, "AdviceOwl");
        
        Context context = getApplicationContext();
        try {
        	versionName = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        	versionCode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;        	
        }
        catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

		// Google AdMob
		//AdView adView = new AdView(this, AdSize.BANNER, ADMOB_AD_UNIT); 
		//LinearLayout layout = super.root;
		//layout.addView(adView); 

        //timer = new Timer(); // Delay the launch of ads; otherwise we get a seg fault
        //timer.schedule(new AdMobTask(adView), 10*1000); // delay 10 seconds
    }

    /*class AdMobTask extends TimerTask {
		private Handler mHandler = new Handler(Looper.getMainLooper());
		private AdView adView;

		public AdMobTask(AdView adView) {
			this.adView = adView;
		}

        @Override
        public void run() {
			mHandler.post(new Runnable() {
				public void run() {
					AdRequest request = new AdRequest();
					//request.setTesting(true);
					adView.loadAd(request);
		            timer.cancel();
				}
			});
        }
	}*/

    @Override
    public void onStart() {
      super.onStart();      
      EasyTracker.getInstance(this).activityStart(this); // Google analytics
    }

    @Override
    public void onStop() {
      super.onStop();      
      EasyTracker.getInstance(this).activityStop(this); // Google analytics      
    }

	public String getVersionName() {
		return versionName;
	}
	
	public int getVersionCode() {
		return versionCode;
	}
}


