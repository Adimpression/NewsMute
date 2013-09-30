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

package ai.newsmute;

import android.os.Bundle;
import android.widget.LinearLayout;
import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;
import org.apache.cordova.*;

public class Main extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")

        //renderAdMobAds();
    }

    /**
     * http://kineticsproject.com/phonegap-2-8-0-for-android-and-admob/
     */
    private void renderAdMobAds() {
        final AdView adView = new AdView(this, AdSize.SMART_BANNER , "a15222c59b1f090");
        final LinearLayout layout = super.root;
        layout.addView(adView);
        layout.setHorizontalGravity(android.view.Gravity.CENTER_HORIZONTAL); //This centers the ads in landscape mode.
        adView.loadAd(new AdRequest());
    }
}

